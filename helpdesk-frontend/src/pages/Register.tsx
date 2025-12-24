import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import Swal from "sweetalert2";

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
}
const Register = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const { register, handleSubmit, formState: { errors }, watch } = useForm<RegisterForm>();
  const password = watch("password");
  
  const registerMutation = useMutation({
    mutationFn: async (data: Omit<RegisterForm, 'passwordConfirm'>) => {
      const registerResponse = await api.post('/auth/register', data);
      
      // If backend returns token and user, use them directly
      if (registerResponse.data.token && registerResponse.data.user) {
        return registerResponse.data;
      }
      
      // If backend only returns id, do automatic login
      const loginResponse = await api.post('/auth/login', { 
        email: data.email, 
        password: data.password 
      });
      return loginResponse.data;
    },
    onSuccess: (response) => {
      const { token, user } = response;
      dispatch({ type: 'LOGIN', payload: { user, token } });
      Swal.fire({ icon: 'success', title: 'Account created!', timer: 1500, showConfirmButton: false });
      navigate('/tickets');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registration failed";
      Swal.fire("Error", message, "error");
    }
  });
  
  const onSubmit = (data: RegisterForm) => {
    const { passwordConfirm, ...submitData } = data;
    registerMutation.mutate(submitData);
  };
  return (
    <Container maxWidth="xs">
      <Paper sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold' }}>
          Create Account
        </Typography>    
        <Box sx={{ mb: 2 }}>
          <Alert severity="info">
            Create a new customer account
          </Alert>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField 
            fullWidth 
            label="Full Name" 
            margin="normal" 
            {...register("name", { required: "Name is required" })} 
            error={!!errors.name}
            helperText={errors.name?.message}
          />        
          <TextField 
            fullWidth 
            label="Email" 
            type="email"
            margin="normal" 
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
          <TextField 
            fullWidth 
            label="Confirm Password" 
            type="password" 
            margin="normal" 
            {...register("passwordConfirm", { 
              required: "Please confirm your password",
              validate: (value) => value === password || "Passwords do not match"
            })} 
            error={!!errors.passwordConfirm}
            helperText={errors.passwordConfirm?.message}
          />    
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            sx={{ mt: 3 }}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? "Creating Account..." : "Register"}
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
                Sign In
              </Link>
            </Typography>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Register;
