import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '80vh',
        textAlign: 'center'
      }}>
        <ErrorOutlineIcon sx={{ fontSize: 80, color: '#d33', mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
          404
        </Typography>
        <Typography variant="h5" color="textSecondary" sx={{ mb: 4 }}>
          Page Not Found
        </Typography>
        <Button 
          variant="contained" 
          size="large"
          onClick={() => navigate('/')}
          sx={{ textTransform: 'none', borderRadius: 2 }}
        >
          Go Home
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;