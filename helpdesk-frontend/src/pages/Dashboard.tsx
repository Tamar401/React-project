import { useAuth } from '../context/AuthContext';
import Admin from './Admin';
import DashboardContent from './DashboardContent';

const Dashboard = () => {
  const { state } = useAuth();
  if (state.user?.role === 'admin') {
    return <Admin />;
  }
  return <DashboardContent />;
};

export default Dashboard;