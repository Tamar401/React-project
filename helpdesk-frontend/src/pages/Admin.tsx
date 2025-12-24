import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { User, Ticket } from '../types';
import { useFetchTickets, useFetchStatuses, useFetchPriorities } from '../hooks/useQueries';
import { showSuccessAlert, showErrorAlert } from '../utils/alertUtils';
import { getRoleColor } from '../utils/roleUtils';
import { useQuery } from '@tanstack/react-query';
import {
  Container, Typography, Paper, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, FormControl, InputLabel, Select, MenuItem,
  Tab, Tabs, Card, CardContent, CardActions, Avatar, Chip, Button, Box, CircularProgress, Alert,
  Table, TableBody, TableCell, TableHead, TableRow
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';

interface NewUserForm {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'agent' | 'customer';
}
interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index } = props;
  return (
    <div hidden={value !== index} style={{ width: '100%' }}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Admin = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<number | string>("");
  const [filterPriority, setFilterPriority] = useState<number | string>("");
  const [formData, setFormData] = useState<NewUserForm>({
    name: '',
    email: '',
    password: '',
    role: 'customer'
  });
  const queryClient = useQueryClient();
  const { data: tickets, isLoading: ticketsLoading } = useFetchTickets();
  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then(res => res.data)
  });
  const { data: statuses } = useFetchStatuses();
  const { data: priorities } = useFetchPriorities();

  const filteredTickets = tickets?.filter(ticket => {
    const matchesSearch = searchText === "" || 
      ticket.subject.toLowerCase().includes(searchText.toLowerCase());
    const matchesStatus = filterStatus === "" || 
      ticket.status_id === Number(filterStatus);
    const matchesPriority = filterPriority === "" || 
      ticket.priority_id === Number(filterPriority); 
    return matchesSearch && matchesStatus && matchesPriority;
  }) || [];
  const updateTicketMutation = useMutation({
    mutationFn: (updateData: { id: number; payload: any }) => 
      api.patch(`/tickets/${updateData.id}`, updateData.payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      showSuccessAlert('Success', 'Ticket updated!');
    },
    onError: () => {
      showErrorAlert('Failed to update ticket');
    }
  });
  const createUserMutation = useMutation({
    mutationFn: (data: NewUserForm) => api.post('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setOpenDialog(false);
      setFormData({ name: '', email: '', password: '', role: 'customer' });
      showSuccessAlert('User created successfully!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to create user';
      showErrorAlert(message);
    }
  });
  const handleAddUser = () => {
    if (!formData.name || !formData.email || !formData.password) {
      showErrorAlert('All fields are required');
      return;
    }
    createUserMutation.mutate(formData);
  };
  const stats = {
    totalTickets: tickets?.length || 0,
    openTickets: tickets?.filter((t: any) => t.status_name === 'open').length || 0,
    totalUsers: users?.length || 0,
    agents: users?.filter((u: User) => u.role === 'agent').length || 0
  };
  const agents = users?.filter((u: User) => u.role === 'agent') || [];
  if (ticketsLoading || usersLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Admin Panel - Ticket Management
      </Typography>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="All Tickets" />
          <Tab label="User Management" />
          <Tab label="Statistics" />
        </Tabs>
      </Box>
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
          All Tickets ({filteredTickets?.length || 0})
        </Typography>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Filters
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}>
            <Box>
              <TextField
                fullWidth
                placeholder="Search by subject..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                InputProps={{
                  startAdornment: <SearchIcon sx={{ mr: 1, color: '#999' }} />
                }}
                variant="outlined"
                size="small"
              />
            </Box>
            <Box>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All Statuses</MenuItem>
                  {statuses?.map(s => (
                    <MenuItem key={s.id} value={s.id}>
                      {s.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <FormControl fullWidth size="small">
                <InputLabel>Priority</InputLabel>
                <Select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  label="Priority"
                >
                  <MenuItem value="">All Priorities</MenuItem>
                  {priorities?.map(p => (
                    <MenuItem key={p.id} value={p.id}>
                      {p.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <Box>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setSearchText("");
                  setFilterStatus("");
                  setFilterPriority("");
                }}
              >
                Clear Filters
              </Button>
            </Box>
          </Box>
        </Paper>
        {filteredTickets && filteredTickets.length === 0 ? (
          <Alert severity="info">
            {tickets?.length === 0 
              ? "No tickets in the system" 
              : "No tickets match your filters. Try adjusting your search."}
          </Alert>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
            {filteredTickets?.map((ticket: Ticket) => (
              <Card 
                key={ticket.id}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: 4
                  }
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                      #{ticket.id}
                    </Typography>
                    <FormControl size="small" sx={{ minWidth: 100 }}>
                      <Select
                        value={ticket.status_id}
                        onChange={(e) => updateTicketMutation.mutate({ 
                          id: ticket.id, 
                          payload: { status_id: e.target.value } 
                        })}
                        sx={{ fontSize: '0.85rem' }}
                      >
                        {statuses?.map(s => (
                          <MenuItem key={s.id} value={s.id}>
                            {s.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {ticket.subject}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: 40 }}>
                    {ticket.description?.substring(0, 80)}...
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2 }}>
                    <Chip 
                      label={ticket.priority_name || 'N/A'}
                      size="small"
                      sx={{
                        bgcolor: ticket.priority_name === 'high' ? '#f44336' : 
                                 ticket.priority_name === 'medium' ? '#ff9800' : '#4caf50',
                        color: 'white'
                      }}
                    />
                    {ticket.assigned_to_name && (
                      <Chip 
                        label={`Assigned: ${ticket.assigned_to_name}`}
                        size="small"
                        variant="filled"
                        sx={{ backgroundColor: '#e3f2fd', color: '#1976d2' }}
                      />
                    )}
                  </Box>
                  <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 2 }}>
                    Created by: {ticket.created_by_name || 'Unknown'} • {new Date(ticket.created_at).toLocaleDateString()}
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Assign to Agent</InputLabel>
                      <Select
                        value={ticket.assigned_to ?? ''}
                        displayEmpty
                        onChange={(e) => updateTicketMutation.mutate({
                          id: ticket.id,
                          payload: { assigned_to: e.target.value || null }
                        })}
                        label="Assign to Agent"
                      >
                        <MenuItem value="">
                          <em>Unassigned</em>
                        </MenuItem>
                        {agents.map(agent => (
                          <MenuItem key={agent.id} value={agent.id}>
                            {agent.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={() => navigate(`/tickets/${ticket.id}`, { state: { from: '/admin' } })}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Users ({users?.length || 0})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenDialog(true)}
          >
            Add User
          </Button>
        </Box>
        <Paper sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">
                  Tickets
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: '#1976d2' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      {user.name}
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role}
                      color={getRoleColor(user.role) as any}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell align="center">
                    {user.role === 'agent'
                      ? tickets?.filter((t: any) => t.assigned_to === user.id).length || 0
                      : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr 1fr' }, gap: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Total Tickets
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                {stats.totalTickets}
              </Typography>
              <Typography variant="caption" color="success.main">
                ↑ 12% vs last month
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Open Tickets
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                {stats.openTickets}
              </Typography>
              <Typography variant="caption" color="error.main">
                ↓ 5% vs last month
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Total Users
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                {stats.totalUsers}
              </Typography>
              <Typography variant="caption" color="success.main">
                Active users
              </Typography>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ textAlign: 'center' }}>
              <Typography color="textSecondary" gutterBottom>
                Support Agents
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2196f3' }}>
                {stats.agents}
              </Typography>
              <Typography variant="caption">
                Handling tickets
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </TabPanel>
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Create New User</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Full Name"
            margin="normal"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
              label="Role"
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="agent">Agent</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            disabled={createUserMutation.isPending}
          >
            {createUserMutation.isPending ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Admin;
