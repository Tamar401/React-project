import { type FunctionComponent } from 'react';
import { Card, CardContent, CardActions, Box, Typography, Chip, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Ticket } from '../types';

interface TicketCardProps {
  ticket: Ticket;
  onView?: (id: number) => void;
}

const TicketCard: FunctionComponent<TicketCardProps> = ({ ticket, onView }) => {
  const navigate = useNavigate();
  const getStatusColor = (statusName?: string) => {
    switch (statusName?.toLowerCase()) {
      case 'open':
        return '#2196f3';
      case 'in_progress':
        return '#ff9800';
      case 'closed':
        return '#4caf50';
      default:
        return '#757575';
    }
  };

  const getPriorityColor = (priorityName?: string) => {
    switch (priorityName?.toLowerCase()) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleView = () => {
    if (onView) {
      onView(ticket.id);
    } else {
      navigate(`/tickets/${ticket.id}`);
    }
  };

  return (
    <Card
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
      onClick={handleView}
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
            handleView();
          }}
        >
          View Details
        </Button>
      </CardActions>
    </Card>
  );
};

export default TicketCard;
