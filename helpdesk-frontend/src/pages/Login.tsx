import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import Swal from "sweetalert2";
import LoginIcon from "@mui/icons-material/Login";

interface LoginForm {
  email: string;
  password: string;
}
const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();
  const loginMutation = useMutation({
    mutationFn: (data: LoginForm) => api.post('/auth/login', data),
    onSuccess: (response) => {
      const { token, user } = response.data;
      dispatch({ type: 'LOGIN', payload: { user, token } });
      Swal.fire({ icon: 'success', title: `Welcome, ${user.name}!`, timer: 1500, showConfirmButton: false });
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/tickets');
      }
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Invalid email or password";
      Swal.fire("Error", message, "error");
    }
  });
  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };
  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: 4, mt: 8 }}>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <LoginIcon sx={{ fontSize: 50, color: '#1976d2', mb: 1 }} />
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Helpdesk System
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Support Ticket Management
          </Typography>
        </Box>
        <Alert severity="info" sx={{ mb: 3 }}>
          Sign in with your account to access the support system
        </Alert>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField 
            fullWidth 
            label="Email" 
            margin="normal" 
            placeholder="your@email.com"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address"
              }
            })} 
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField 
            fullWidth 
            label="Password" 
            type="password" 
            margin="normal" 
            placeholder="Enter your password"
            {...register("password", { 
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters"
              }
            })} 
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ mt: 3, py: 1.2, fontWeight: 'bold' }}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </Button>
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2">
              Don't have an account?{" "}
              <Link to="/register" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
                Create one
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;