import { useState } from "react";
import { Box, Button, TextField, Typography, CircularProgress } from "@mui/material";
import { Explore } from "@mui/icons-material";
import { apiFetch } from "../../api/apiFetch";
import { useAlertStore } from "../../store/alertStore";
import { useNavigate } from "react-router-dom";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const addAlert = useAlertStore((state) => state.addAlert);
  const navigate = useNavigate();

  async function register() {
    try {
      setLoading(true);
      const res = await apiFetch(
        "/auth/register",
        { method: "POST", body: JSON.stringify({ name, email, password }) },
        false
      );
      await res.json();
      addAlert({ severity: "success", message: "Account created, please log in" });
      setName("");
      setEmail("");
      setPassword("");
      navigate("/login");
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Something went wrong";
      addAlert({ severity: "error", message });
    } finally {
      setLoading(false);
    }
  }

  const disabled = !name || !email || !password;

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 340,
        bgcolor: "#FFFFFF",
        borderRadius: 2,
        boxShadow: 3,
        p: { xs: 3, md: 4 },
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{ fontFamily: "Outfit, sans-serif", fontWeight: 600, color: "#101828" }}
      >
        Sign up
      </Typography>
      <Typography
        align="center"
        sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: "#64748B", mt: 0.5 }}
      >
        Ready to kick off your next vacation?
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 3 }}>
        <TextField label="Name" size="small" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField label="Email" size="small" value={email} onChange={(e) => setEmail(e.target.value)} />
        <TextField
          label="Password"
          size="small"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          helperText={password ? passwordStrengthLabel(password) : " "}
        />
      </Box>

      <Button
        fullWidth
        variant="contained"
        disabled={disabled || loading}
        onClick={register}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Explore fontSize="small" />}
      >
        Sign up
      </Button>

      <Typography align="center" sx={{ fontSize: 14, color: "#64748B", mt: 2 }}>
        Already have an account?{" "}
        <Box component="a" href="/login" sx={{ color: "primary.main", fontWeight: 500, textDecoration: "none" }}>
          Login
        </Box>
      </Typography>
    </Box>
  );
}

function passwordStrengthLabel(pw: string) {
  if (pw.length < 6) return "Weak";
  if (pw.length < 10) return "Okay";
  return "Strong";
}