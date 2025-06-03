import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Home from './pages/Home';
import Settings from './pages/Settings';
import Navbar from './components/Navbar';

function App() {
  const { token } = useAuth();

  return (
    <div className='min-h-screen bg-gray-100'>
      {token && <Navbar />}
      <Routes>
        <Route
          path='/login'
          element={!token ? <Login /> : <Navigate to='/' />}
        />
        <Route path='/' element={token ? <Home /> : <Navigate to='/login' />} />
        <Route
          path='/settings'
          element={token ? <Settings /> : <Navigate to='/login' />}
        />
      </Routes>
    </div>
  );
}

export default App;
