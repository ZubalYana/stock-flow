import { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff, Login } from "@mui/icons-material";
import { apiFetch } from "../../api/apiFetch";
import { useAlertStore } from "../../store/alertStore";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const addAlert = useAlertStore((state) => state.addAlert);
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const disabled = !email || !password;

  async function login() {
    try {
      setLoading(true);
      const res = await apiFetch(
        "/auth/login",
        { method: "POST", body: JSON.stringify({ email, password }) },
        false
      );
      const data = await res.json();
      setAuth(data.data.token, data.data.user);
      navigate("/trips");
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Something went wrong";
      addAlert({ severity: "error", message });
    } finally {
      setLoading(false);
    }
  }

  async function forgotPassword() {
    if (!email) {
      addAlert({ severity: "error", message: "Enter your email" });
      return;
    }
    try {
      setLoading(true);
      const res = await apiFetch(
        "/auth/forgot-password",
        { method: "POST", body: JSON.stringify({ email }) },
        false
      );
      await res.json();
      addAlert({ severity: "success", message: "Password reset link sent to your email" });
    } catch (err) {
      console.error(err);
      const message = err instanceof Error ? err.message : "Something went wrong";
      addAlert({ severity: "error", message });
    } finally {
      setLoading(false);
    }
  }

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
        Welcome back
      </Typography>
      <Typography
        align="center"
        sx={{ fontFamily: "'Open Sans', sans-serif", fontSize: 14, color: "#64748B", mt: 0.5 }}
      >
        Log in to keep planning your trips
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, my: 3 }}>
        <TextField
          label="Email"
          size="small"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!forgotPasswordMode && (
          <TextField
            label="Password"
            size="small"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((v) => !v)} edge="end" size="small">
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        )}
      </Box>

      {!forgotPasswordMode ? (
        <Button
          fullWidth
          variant="contained"
          disabled={disabled || loading}
          onClick={login}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Login fontSize="small" />}
        >
          Log in
        </Button>
      ) : (
        <Button
          fullWidth
          variant="contained"
          disabled={!email || loading}
          onClick={forgotPassword}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          Send reset link
        </Button>
      )}

      <Typography align="center" sx={{ fontSize: 14, color: "#64748B", mt: 2 }}>
        Don't have an account?{" "}
        <Box component="a" href="/register" sx={{ color: "primary.main", fontWeight: 500, textDecoration: "none" }}>
          Sign up
        </Box>
      </Typography>

      <Typography align="center" sx={{ fontSize: 12, color: "#64748B", mt: 1.5 }}>
        {!forgotPasswordMode ? (
          <>
            Forgot password?{" "}
            <Box
              component="button"
              onClick={() => setForgotPasswordMode(true)}
              sx={{ color: "primary.main", fontWeight: 500, background: "none", border: "none", cursor: "pointer", p: 0 }}
            >
              Reset
            </Box>
          </>
        ) : (
          <>
            Remembered password?{" "}
            <Box
              component="button"
              onClick={() => setForgotPasswordMode(false)}
              sx={{ color: "primary.main", fontWeight: 500, background: "none", border: "none", cursor: "pointer", p: 0 }}
            >
              Log in
            </Box>
          </>
        )}
      </Typography>
    </Box>
  );
}