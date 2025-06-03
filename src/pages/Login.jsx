import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const result = await login(username, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
  };

  const handleCloseError = () => {
    setError('');
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-gray-200 font-sans'>
      <div className='bg-white/80 backdrop-blur-sm p-10 rounded-lg shadow-xl w-full max-w-lg border border-gray-200/50 transition-all hover:scale-105 animate-fade-in'>
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold text-blue-600'>Expense Tracker</h1>
          <h2 className='text-3xl font-bold text-gray-800 mt-2'>Login</h2>
        </div>
        {error && (
          <div className='mb-4 p-3 bg-red-100 text-red-700 border border-red-300 rounded-lg flex justify-between items-center'>
            <span>{error}</span>
            <button
              onClick={handleCloseError}
              className='text-red-700 hover:text-red-900'
            >
              &times;
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className='mb-5'>
            <label
              className='block text-lg font-semibold text-gray-700 mb-2'
              htmlFor='username'
            >
              Username
            </label>
            <input
              type='text'
              id='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
              required
            />
          </div>
          <div className='mb-6'>
            <label
              className='block text-lg font-semibold text-gray-700 mb-2'
              htmlFor='password'
            >
              Password
            </label>
            <input
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition'
              required
            />
          </div>
          <button
            type='submit'
            className='w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition text-lg font-semibold'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
