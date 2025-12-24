import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Box } from '@mui/material';

function App() {
  return (
    <Box>
      <Navbar />
      <Box sx={{ p: 3 }}>
        <Outlet /> 
      </Box>
    </Box>
  );
}

export default App;