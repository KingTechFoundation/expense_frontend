import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSettings = () => {
    navigate('/settings');
  };

  return (
    <nav className='bg-blue-500 p-4'>
      <div className='container mx-auto flex justify-between items-center'>
        <h1 className='text-white text-xl font-bold'>Expense Tracker</h1>
        <div className='flex gap-4'>
          <button
            onClick={handleSettings}
            className='bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600'
          >
            Settings
          </button>
          <button
            onClick={handleLogout}
            className='bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600'
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
