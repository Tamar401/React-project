import { Container, Typography, Button, Box, Stack, Paper } from '@mui/material';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import PeopleIcon from '@mui/icons-material/People';
import { Link } from 'react-router-dom';

const Home= () => {
  return (
    <Box sx={{ bgcolor: '#f0f2f5', minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="lg">
        <Paper elevation={3} sx={{ p: { xs: 4, md: 8 }, borderRadius: 4, textAlign: 'center', bgcolor: 'white' }}>
          <SupportAgentIcon sx={{ fontSize: 70, color: 'primary.main', mb: 2 }} />
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800, color: '#1a202c' }}>
            Helpdesk Management System
          </Typography>          
          <Typography variant="h5" color="textSecondary" sx={{ mb: 4, maxWidth: '700px', mx: 'auto' }}>
            Streamline your support process. A professional platform for customers to report issues and for teams to resolve them efficiently.
          </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center" sx={{ mb: 6 }}>
            <Button 
              variant="contained" 
              size="large" 
              component={Link} 
              to="/login"
              sx={{ px: 6, py: 1.5, fontSize: '1.1rem', textTransform: 'none', borderRadius: 2 }}
            >
              Login to Portal
            </Button>
          </Stack>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4, textAlign: 'center', borderTop: '1px solid #eee', pt: 6 }}>
            <Box>
              <AssignmentTurnedInIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Smart Ticketing</Typography>
              <Typography variant="body2" color="textSecondary">Create and track support requests with real-time status updates.</Typography>
            </Box>
            <Box>
              <PeopleIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Role-Based Access</Typography>
              <Typography variant="body2" color="textSecondary">Dedicated interfaces for Customers, Agents, and Administrators.</Typography>
            </Box>
            <Box>
              <SupportAgentIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Team Routing</Typography>
              <Typography variant="body2" color="textSecondary">Managers can easily assign tasks to the right team members.</Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Home;