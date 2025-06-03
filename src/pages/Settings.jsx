import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ExpenseTable from '../components/ExpenseTable';
import EditExpenseModal from '../components/EditExpenseModal';

function Settings() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editExpense, setEditExpense] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, startDate, endDate]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/expenses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExpenses(response.data.expenses);
      setFilteredExpenses(response.data.expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const filterExpenses = () => {
    let result = expenses;
    if (startDate && endDate) {
      result = result.filter(
        (expense) =>
          new Date(expense.date) >= new Date(startDate) &&
          new Date(expense.date) <= new Date(endDate)
      );
    }
    setFilteredExpenses(result);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?'))
      return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchExpenses();
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleEdit = (expense) => {
    setEditExpense(expense);
    setIsModalOpen(true);
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>Settings - Manage Expenses</h1>
      <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
        <div className='flex flex-col md:flex-row gap-4'>
          <input
            type='date'
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className='p-2 border rounded'
            placeholder='Start Date'
          />
          <input
            type='date'
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className='p-2 border rounded'
            placeholder='End Date'
          />
        </div>
      </div>
      <ExpenseTable
        expenses={filteredExpenses}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EditExpenseModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditExpense(null);
        }}
        expense={editExpense}
        onSuccess={fetchExpenses}
        token={token}
      />
    </div>
  );
}

export default Settings;
