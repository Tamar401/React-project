import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Button, Box, 
  CircularProgress, FormControl, Select, MenuItem
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Ticket, User, Status, Priority } from '../types';
import Swal from 'sweetalert2';

const DashboardContent = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: tickets, isLoading: ticketsLoading } = useQuery<Ticket[]>({
    queryKey: ['tickets', state.user?.role],
    queryFn: async () => {
      let endpoint = '/tickets';
      if (state.user?.role === 'customer') endpoint += `?created_by=${state.user.id}`;
      else if (state.user?.role === 'agent') endpoint += `?assigned_to=${state.user.id}`;
      const res = await api.get(endpoint);
      return res.data;
    }
  });
  const { data: agents } = useQuery<User[]>({
    queryKey: ['agents'],
    queryFn: () => api.get('/users').then(res => res.data.filter((u: User) => u.role === 'agent')),
    enabled: state.user?.role === 'admin' 
  });
  const { data: statuses } = useQuery<Status[]>({ queryKey: ['statuses'], queryFn: () => api.get('/statuses').then(res => res.data) });
  const { data: priorities } = useQuery<Priority[]>({ queryKey: ['priorities'], queryFn: () => api.get('/priorities').then(res => res.data) });
  const updateTicketMutation = useMutation({
    mutationFn: (updateData: { id: number; payload: Partial<Ticket> }) => 
      api.patch(`/tickets/${updateData.id}`, updateData.payload),
    onMutate: async (newUpdate) => {
      await queryClient.cancelQueries({ queryKey: ['tickets'] });
      const previousTickets = queryClient.getQueryData(['tickets']);
      queryClient.setQueryData(['tickets'], (old: Ticket[] | undefined) => {
        return old?.map(ticket => 
          ticket.id === newUpdate.id ? { ...ticket, ...newUpdate.payload } : ticket
        );
      });
      return { previousTickets };
    },
    onError: (_err, _newUpdate, context) => {
      queryClient.setQueryData(['tickets'], context?.previousTickets);
      Swal.fire('Error', 'Update failed!', 'error');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
    }
  });
  if (ticketsLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          Welcome, {state.user?.name}
        </Typography>
        {state.user?.role === 'customer' && (
          <Button variant="contained" onClick={() => navigate('/tickets/new')}>Open New Ticket</Button>
        )}
      </Box>
      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              {state.user?.role === 'admin' && <TableCell sx={{ fontWeight: 'bold' }}>Priority</TableCell>}
              {state.user?.role === 'admin' && <TableCell sx={{ fontWeight: 'bold' }}>Assign To Agent</TableCell>}
              <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tickets?.map((ticket) => (
              <TableRow key={ticket.id} hover>
                <TableCell>#{ticket.id}</TableCell>
                <TableCell>{ticket.subject}</TableCell>        
                <TableCell>
                  {(state.user?.role === 'admin' || state.user?.role === 'agent') ? (
                    <FormControl size="small" fullWidth>
                      <Select 
                        value={ticket.status_id} 
                        onChange={(e) => updateTicketMutation.mutate({ id: ticket.id, payload: { status_id: e.target.value as number } })}
                      >
                        {statuses?.map(s => <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>)}
                      </Select>
                    </FormControl>
                  ) : ticket.status_name}
                </TableCell>
                {state.user?.role === 'admin' && (
                  <>
                    <TableCell>
                      <Select 
                        size="small" 
                        value={ticket.priority_id} 
                        onChange={(e) => updateTicketMutation.mutate({ id: ticket.id, payload: { priority_id: e.target.value as number } })}
                      >
                        {priorities?.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select 
                        size="small" 
                        value={ticket.assigned_to ?? ''} 
                        displayEmpty
                        onChange={(e) => updateTicketMutation.mutate({ id: ticket.id, payload: { assigned_to: e.target.value as number || null } })}
                      >
                        <MenuItem value=""><em>Unassigned</em></MenuItem>
                        {agents?.map(a => <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>)}
                      </Select>
                    </TableCell>
                  </>
                )}
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => navigate(`/tickets/${ticket.id}`)}>
                    Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default DashboardContent;
