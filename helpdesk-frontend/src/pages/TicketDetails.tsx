import { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import type { Ticket, Comment, User } from "../types";
import { useFetchStatuses, useFetchPriorities } from "../hooks/useQueries";
import { getStatusColor, getPriorityColor } from "../utils/colorUtils";
import { 
  Container, Paper, Typography, TextField, Button, List, ListItem, 
  ListItemText, CircularProgress, Box, Alert, Chip, FormControl, 
  Select, MenuItem, Divider, Card, CardContent,
  Avatar
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { showSuccessAlert, showErrorAlert } from '../utils/alertUtils';

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAuth();
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState("");
  const goBack = () => {
    const from = location.state?.from || (state.user?.role === 'admin' ? '/admin' : '/tickets');
    navigate(from);
  };
  const { data: ticket, isLoading: ticketLoading } = useQuery<Ticket>({
    queryKey: ["ticket", id],
    queryFn: () => api.get(`/tickets/${id}`).then(res => res.data)
  });
  const { data: comments, isLoading: commentsLoading } = useQuery<Comment[]>({
    queryKey: ["comments", id],
    queryFn: () => api.get(`/tickets/${id}/comments`).then(res => res.data)
  });
  const { data: statuses } = useFetchStatuses();
  const { data: priorities } = useFetchPriorities();
  const { data: agents } = useQuery<User[]>({
    queryKey: ['agents'],
    queryFn: () => api.get('/users').then(res => res.data.filter((u: User) => u.role === 'agent')),
    enabled: state.user?.role === 'admin'
  });
  const commentMutation = useMutation({
    mutationFn: (content: string) => api.post(`/tickets/${id}/comments`, { content }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setNewComment("");
      showSuccessAlert('Comment added!');
    },
    onError: () => {
      showErrorAlert('Failed to add comment');
    }
  });
  const updateTicketMutation = useMutation({
    mutationFn: (updateData: Partial<Ticket>) => api.patch(`/tickets/${id}`, updateData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      showSuccessAlert('Updated!');
    },
    onError: () => {
      showErrorAlert('Update failed');
    }
  });
  if (ticketLoading || commentsLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Container>
    );
  }
  if (!ticket) {
    return (
      <Container>
        <Alert severity="error">Ticket not found</Alert>
      </Container>
    );
  }
  const canEdit = state.user?.role === 'admin' || state.user?.role === 'agent';
  const isOwner = state.user?.id === ticket.created_by;
  if (state.user?.role === 'customer' && !isOwner) {
    return (
      <Container>
        <Alert severity="error">You don't have permission to view this ticket</Alert>
      </Container>
    );
  }
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button 
        onClick={goBack}
        sx={{ mb: 3 }}
      >
        ← Back
      </Button>
      <Paper sx={{ p: 4, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
              {ticket.subject}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Chip 
                label={ticket.status_name} 
                sx={{ backgroundColor: getStatusColor(ticket.status_name), color: '#fff' }}
              />
              <Chip 
                label={ticket.priority_name}
                color={getPriorityColor(ticket.priority_name) as any}
                variant="outlined"
              />
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: '#999' }}>
            #{ticket.id}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2, mb: 3 }}>
          <Card variant="outlined">
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                Created By
              </Typography>
              <Typography variant="body1">
                {ticket.created_by_name || 'Unknown'}
              </Typography>
            </CardContent>
          </Card>
          <Card variant="outlined">
            <CardContent sx={{ py: 2 }}>
              <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                Created Date
              </Typography>
              <Typography variant="body1">
                {new Date(ticket.created_at).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
          {(canEdit || ticket.assigned_to_name) && (
            <Card variant="outlined">
              <CardContent sx={{ py: 2 }}>
                <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                  Assigned To
                </Typography>
                <Typography variant="body1">
                  {ticket.assigned_to_name || 'Unassigned'}
                </Typography>
              </CardContent>
            </Card>
          )}
        </Box>
        <Box sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
            Description
          </Typography>
          <Typography variant="body1">
            {ticket.description}
          </Typography>
        </Box>
        {canEdit && (
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ flex: 1, minWidth: 200 }}>
              <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
                Update Status
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={ticket.status_id}
                  onChange={(e) => updateTicketMutation.mutate({ status_id: e.target.value as number })}
                  disabled={updateTicketMutation.isPending}
                >
                  {statuses?.map(s => (
                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            {state.user?.role === 'admin' && (
              <>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
                    Update Priority
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={ticket.priority_id}
                      onChange={(e) => updateTicketMutation.mutate({ priority_id: e.target.value as number })}
                      disabled={updateTicketMutation.isPending}
                    >
                      {priorities?.map(p => (
                        <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
                <Box sx={{ flex: 1, minWidth: 200 }}>
                  <Typography variant="caption" sx={{ fontWeight: 'bold', mb: 1, display: 'block' }}>
                    Assign to Agent
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select
                      value={ticket.assigned_to ?? ''}
                      onChange={(e) => updateTicketMutation.mutate({ assigned_to: e.target.value as number || null })}
                      displayEmpty
                      disabled={updateTicketMutation.isPending}
                    >
                      <MenuItem value="">Unassigned</MenuItem>
                      {agents?.map(a => (
                        <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              </>
            )}
          </Box>
        )}
      </Paper>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>
          Conversation ({comments?.length || 0} messages)
        </Typography>
        {comments && comments.length > 0 ? (
          <List sx={{ mb: 3 }}>
            {comments.map((comment, index) => (
              <Box key={comment.id}>
                <ListItem sx={{ px: 0, py: 2, alignItems: 'flex-start' }}>
                  <Avatar sx={{ mr: 2, backgroundColor: '#1976d2' }}>
                    {comment.author_name.charAt(0).toUpperCase()}
                  </Avatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {comment.author_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {new Date(comment.created_at).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ mt: 1, color: '#333' }}>
                        {comment.content}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < (comments?.length || 0) - 1 && <Divider />}
              </Box>
            ))}
          </List>
        ) : (
          <Alert severity="info" sx={{ mb: 3 }}>
            No comments yet. Be the first to comment!
          </Alert>
        )}
        <Divider sx={{ my: 3 }} />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            placeholder="Write your comment here..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={commentMutation.isPending}
          />
        </Box>
        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={() => {
            if (newComment.trim()) {
              commentMutation.mutate(newComment);
            }
          }}
          disabled={commentMutation.isPending || !newComment.trim()}
          sx={{ mt: 2 }}
        >
          {commentMutation.isPending ? "Sending..." : "Post Comment"}
        </Button>
      </Paper>
    </Container>
  );
};

export default TicketDetails;