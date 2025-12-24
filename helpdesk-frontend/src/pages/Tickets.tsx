import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import type { Ticket } from "../types";
import { useFetchStatuses, useFetchPriorities } from "../hooks/useQueries";
import { getStatusColor, getPriorityColor } from "../utils/colorUtils";
import { 
  Container, Typography, Paper, CircularProgress, Alert, Button, Box, 
  TextField, FormControl, InputLabel, Select, MenuItem, Card, CardContent,
  CardActions, Chip
} from '@mui/material';
import { useNavigate } from "react-router-dom";
import SearchIcon from '@mui/icons-material/Search';
const Tickets = () => {
  const { state } = useAuth();
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [filterStatus, setFilterStatus] = useState<number | string>("");
  const [filterPriority, setFilterPriority] = useState<number | string>("");
  const { data: tickets, isLoading, error } = useQuery<Ticket[]>({
    queryKey: ["tickets", state.user?.id],
    queryFn: async () => {
      let endpoint = '/tickets';
      if (state.user?.role === 'customer') endpoint += `?created_by=${state.user.id}`;
      else if (state.user?.role === 'agent') endpoint += `?assigned_to=${state.user.id}`;
      const res = await api.get(endpoint);
      return res.data;
    }
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
  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }
  if (error) {
    return (
      <Container>
        <Alert severity="error">Error loading tickets</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
            Support Tickets
          </Typography>
          {state.user?.role === 'customer' && (
            <Button 
              variant="contained" 
              onClick={() => navigate('/tickets/new')}
            >
              Create New Ticket
            </Button>
          )}
        </Box>
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
        {filteredTickets.length === 0 ? (
          <Alert severity="info">
            {tickets?.length === 0 
              ? "No tickets found. Create one to get started!" 
              : "No tickets match your filters. Try adjusting your search."}
          </Alert>
        ) : (
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: 'repeat(3, 1fr)' }, gap: 2 }}>
            {filteredTickets.map(ticket => (
              <Card 
                key={ticket.id}
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'box-shadow 0.3s',
                  '&:hover': {
                    boxShadow: 4,
                    cursor: 'pointer'
                  }
                }}
                onClick={() => navigate(`/tickets/${ticket.id}`)}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#666', fontWeight: 'bold' }}>
                      #{ticket.id}
                    </Typography>
                    <Chip 
                      label={ticket.status_name} 
                      size="small"
                      sx={{ 
                        backgroundColor: getStatusColor(ticket.status_name),
                        color: '#fff'
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {ticket.subject}
                  </Typography>
                  <Typography variant="body2" color="textSecondary" sx={{ mb: 2, minHeight: 40 }}>
                    {ticket.description.substring(0, 80)}...
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                    <Chip 
                      label={ticket.priority_name}
                      size="small"
                      color={getPriorityColor(ticket.priority_name) as any}
                      variant="outlined"
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
                  <Typography variant="caption" color="textSecondary">
                    Created: {new Date(ticket.created_at).toLocaleDateString()}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/tickets/${ticket.id}`);
                    }}
                  >
                    View Details
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="textSecondary">
            Showing {filteredTickets.length} of {tickets?.length} tickets
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Tickets;