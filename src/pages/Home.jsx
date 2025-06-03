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

  // Format amount with commas and RWF
  const formatAmount = (amount) => {
    return `RWF ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  return (
    <div className='container mx-auto p-4 font-sans'>
      <div className='flex flex-col md:flex-row md:items-start'>
        <div className='flex-1'>
          <h1 className='text-3xl font-bold mb-6 text-gray-800'>
            Expense Tracker
          </h1>
          <div className='mb-4 flex flex-col sm:flex-row sm:gap-4'>
            <button
              onClick={handleAddExpense}
              className='bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mb-2 sm:mb-0'
            >
              Add Expense
            </button>
            <button
              onClick={handleTestDailyPDF}
              className='bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition'
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
          <ExpenseTable
            expenses={filteredExpenses.filter(
              (expense) =>
                new Date(expense.date).toISOString().split('T')[0] === today
            )}
          />
        </div>
        <div className='mt-6 md:mt-0 md:ml-6 w-full md:w-80'>
          <div className='bg-white shadow-lg rounded-lg p-6 border border-gray-200'>
            <h2 className='text-lg font-semibold text-gray-800 mb-4'>
              Summary
            </h2>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-lg text-gray-600'>Total Expenses</span>
                <span className='text-xl font-semibold text-blue-600'>
                  {formatAmount(totalExpenses)}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-lg text-gray-600'>Today's Total</span>
                <span className='text-xl font-semibold text-blue-600'>
                  {formatAmount(dailyTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
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
