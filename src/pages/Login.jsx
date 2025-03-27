import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
} from "@mui/material";
import { login } from "../store/slices/authSlice";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(login(formData));
    if (!result.error) {
      navigate("/dashboard");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            padding: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "100%",
            backgroundColor: "#f5f5f5",
            borderRadius: 2,
          }}
        >
          <Typography
            component="h1"
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              textAlign: "center",
            }}
          >
            Cinema Management System
          </Typography>
          <Typography
            component="h2"
            variant="h6"
            sx={{
              mt: 2,
              color: "#555",
              textAlign: "center",
            }}
          >
            Sign in to your account
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 3,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              sx={{
                "& .MuiInputBase-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#115293",
                },
                padding: "10px 0",
                fontSize: "16px",
                fontWeight: "bold",
              }}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
