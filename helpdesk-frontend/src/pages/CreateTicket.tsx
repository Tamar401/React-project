import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Container, TextField, Button, Typography, Paper, Box, FormControl, InputLabel, Select, MenuItem, CircularProgress, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Swal from 'sweetalert2';
import type { Priority } from '../types';

interface TicketForm {
  subject: string;
  description: string;
  priority_id: number;
}
const CreateTicket = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<TicketForm>({
    defaultValues: {
      priority_id: 2 
    }
  });
  const { data: priorities, isLoading: prioritiesLoading } = useQuery<Priority[]>({
    queryKey: ['priorities'],
    queryFn: () => api.get('/priorities').then(res => res.data)
  });
  const createMutation = useMutation({
    mutationFn: (data: TicketForm) => api.post('/tickets', data),
    onSuccess: (response) => {
      Swal.fire('Success', 'Ticket created!', 'success');
      navigate(`/tickets/${response.data.id}`);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create ticket';
      Swal.fire('Error', message, 'error');
    }
  });
  const onSubmit = (data: TicketForm) => {
    createMutation.mutate(data);
  };
  if (prioritiesLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }
  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          Create New Support Ticket
        </Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          Please provide detailed information about your issue so we can help you better.
        </Alert>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            label="Subject"
            margin="normal"
            placeholder="Brief summary of your issue"
            {...register("subject", { 
              required: "Subject is required",
              minLength: {
                value: 5,
                message: "Subject must be at least 5 characters"
              }
            })}
            error={!!errors.subject}
            helperText={errors.subject?.message}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={5}
            margin="normal"
            placeholder="Provide detailed information about your issue..."
            {...register("description", { 
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters"
              }
            })}
            error={!!errors.description}
            helperText={errors.description?.message}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Priority</InputLabel>
            <Select
              label="Priority"
              {...register("priority_id", { required: "Priority is required" })}
              onChange={(e) => setValue("priority_id", Number(e.target.value))}
              defaultValue={2}
            >
              {priorities?.map(p => (
                <MenuItem key={p.id} value={p.id}>
                  {p.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
            <Button 
              type="submit" 
              variant="contained" 
              fullWidth
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? "Creating..." : "Create Ticket"}
            </Button>
            <Button 
              type="button" 
              variant="outlined" 
              fullWidth
              onClick={() => navigate('/tickets')}
            >
              Cancel
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateTicket;