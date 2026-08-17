import { useState } from "react";
import {
  Button,
  IconButton,
  InputAdornment,
  TextField,
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
      navigate("/goods");
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
        Welcome back
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
        Log in to keep planning your trips
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: 16, margin: "24px 0" }}>
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
      </div>

      {!forgotPasswordMode ? (
        <Button
          fullWidth
          variant="contained"
          disabled={disabled || loading}
          onClick={login}
          startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <Login fontSize="small" />}
          sx={{
            bgcolor: "#101828",
            "&:hover": { bgcolor: "#1D2939" },
          }}
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
          sx={{
            bgcolor: "#101828",
            "&:hover": { bgcolor: "#1D2939" },
          }}
        >
          Send reset link
        </Button>
      )}

      <p style={{ fontSize: 14, color: "#64748B", textAlign: "center", marginTop: 16 }}>
        Don't have an account?{" "}
        <a href="/register" style={{ color: "#101828", fontWeight: 500, textDecoration: "none" }}>
          Sign up
        </a>
      </p>

      <p style={{ fontSize: 12, color: "#64748B", textAlign: "center", marginTop: 12 }}>
        {!forgotPasswordMode ? (
          <>
            Forgot password?{" "}
            <button
              onClick={() => setForgotPasswordMode(true)}
              style={{ color: "#101828", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Reset
            </button>
          </>
        ) : (
          <>
            Remembered password?{" "}
            <button
              onClick={() => setForgotPasswordMode(false)}
              style={{ color: "#101828", fontWeight: 500, background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Log in
            </button>
          </>
        )}
      </p>
    </div>
  );
}