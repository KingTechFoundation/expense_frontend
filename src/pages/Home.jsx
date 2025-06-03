import { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseTable from '../components/ExpenseTable';
import FilterForm from '../components/FilterForm';
import ExpenseFormModal from '../components/ExpenseFormModal';
import { generateDailyPDF, generateDateRangePDF } from '../utils/generatePDF';
import { useAuth } from '../context/AuthContext';

function Home() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [dailyTotal, setDailyTotal] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchExpenses();
    // Check if it's the end of the day (midnight)
    const checkMidnight = setInterval(() => {
      const now = new Date();
      if (now.getHours() === 23 && now.getMinutes() === 59) {
        generateDailyPDF(filteredExpenses, dailyTotal);
      }
    }, 60000); // Check every minute
    return () => clearInterval(checkMidnight);
  }, []);

  useEffect(() => {
    filterExpenses();
  }, [expenses, searchQuery, startDate, endDate]);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/expenses`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setExpenses(response.data.expenses);
      calculateTotals(response.data.expenses);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const calculateTotals = (expenses) => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const todayExpenses = expenses.filter(
      (expense) => new Date(expense.date).toISOString().split('T')[0] === today
    );
    const daily = todayExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0
    );
    setTotalExpenses(total);
    setDailyTotal(daily);
  };

  const filterExpenses = () => {
    let result = expenses;
    if (searchQuery) {
      result = result.filter(
        (expense) =>
          expense.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          expense.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    if (startDate && endDate) {
      result = result.filter(
        (expense) =>
          new Date(expense.date) >= new Date(startDate) &&
          new Date(expense.date) <= new Date(endDate)
      );
    }
    setFilteredExpenses(result);
  };

  const handleGeneratePDF = () => {
    generateDateRangePDF(filteredExpenses, startDate, endDate, totalExpenses);
  };

  const handleAddExpense = () => {
    setIsModalOpen(true);
  };

  const handleTestDailyPDF = () => {
    generateDailyPDF(filteredExpenses, dailyTotal);
  };

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-3xl font-bold mb-6'>Expense Tracker</h1>
      <div className='mb-4'>
        <button
          onClick={handleAddExpense}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mr-2'
        >
          Add Expense
        </button>
        <button
          onClick={handleTestDailyPDF}
          className='bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600'
        >
          Test Daily PDF
        </button>
      </div>
      <FilterForm
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        handleGeneratePDF={handleGeneratePDF}
      />
      <div className='mb-4'>
        <p className='text-lg'>Total Expenses: ${totalExpenses.toFixed(2)}</p>
        <p className='text-lg'>Today's Total: ${dailyTotal.toFixed(2)}</p>
      </div>
      <ExpenseTable
        expenses={filteredExpenses.filter(
          (expense) =>
            new Date(expense.date).toISOString().split('T')[0] === today
        )}
      />
      <ExpenseFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchExpenses}
        token={token}
      />
    </div>
  );
}

export default Home;
