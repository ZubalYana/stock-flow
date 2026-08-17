import { useState } from "react";
import { Button, TextField, CircularProgress } from "@mui/material";
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
    <div
      style={{
        width: "100%",
        maxWidth: 340,
        background: "#FFFFFF",
        borderRadius: 8,
        boxShadow: "0 4px 12px rgba(16,24,40,0.1)",
        padding: 32,
      }}
    >
      <h1
        style={{
          fontFamily: "Outfit, sans-serif",
          fontWeight: 600,
          fontSize: 24,
          color: "#101828",
          textAlign: "center",
          margin: 0,
        }}
      >
        Sign up
      </h1>
      <p
        style={{
          fontFamily: "'Open Sans', sans-serif",
          fontSize: 14,
          color: "#64748B",
          textAlign: "center",
          marginTop: 4,
        }}
      >
        Ready to kick off your next vacation?
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "24px 0" }}>
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
      </div>

      <Button
        fullWidth
        variant="contained"
        disabled={disabled || loading}
        onClick={register}
        startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Explore fontSize="small" />}
        sx={{
          bgcolor: "#101828",
          "&:hover": { bgcolor: "#1D2939" },
        }}
      >
        Sign up
      </Button>

      <p style={{ fontSize: 14, color: "#64748B", textAlign: "center", marginTop: 16 }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: "#101828", fontWeight: 500, textDecoration: "none" }}>
          Login
        </a>
      </p>
    </div>
  );
}

function passwordStrengthLabel(pw: string) {
  if (pw.length < 6) return "Weak";
  if (pw.length < 10) return "Okay";
  return "Strong";
}