import { useState } from 'react';
import axios from 'axios';

function ExpenseFormModal({ isOpen, onClose, onSuccess, token }) {
  const [formData, setFormData] = useState({
    date: '',
    description: '',
    category: '',
    amount: '',
    payment_method: '',
    received_by: '',
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const categories = ['materials', 'labor', 'transport', 'salary', 'other'];
  const paymentMethods = ['Cash', 'Mobile Money', 'Bank'];

  const validateForm = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.description.trim())
      newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.amount || isNaN(formData.amount) || formData.amount < 0) {
      newErrors.amount = 'Amount must be a non-negative number';
    }
    if (!formData.payment_method)
      newErrors.payment_method = 'Payment method is required';
    if (!formData.received_by.trim())
      newErrors.received_by = 'Received by is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/expenses`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFormData({
        date: '',
        description: '',
        category: '',
        amount: '',
        payment_method: '',
        received_by: '',
      });
      onSuccess();
      onClose();
    } catch (error) {
      setServerError(error.response?.data?.message || 'Error adding expense');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-full max-w-md'>
        <h2 className='text-2xl font-bold mb-4'>Add Expense</h2>
        {serverError && <p className='text-red-500 mb-4'>{serverError}</p>}
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-gray-700 mb-1' htmlFor='date'>
              Date
            </label>
            <input
              type='date'
              id='date'
              name='date'
              value={formData.date}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
            {errors.date && (
              <p className='text-red-500 text-sm'>{errors.date}</p>
            )}
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 mb-1' htmlFor='description'>
              Description
            </label>
            <input
              type='text'
              id='description'
              name='description'
              value={formData.description}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
            {errors.description && (
              <p className='text-red-500 text-sm'>{errors.description}</p>
            )}
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 mb-1' htmlFor='category'>
              Category
            </label>
            <select
              id='category'
              name='category'
              value={formData.category}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className='text-red-500 text-sm'>{errors.category}</p>
            )}
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 mb-1' htmlFor='amount'>
              Amount
            </label>
            <input
              type='number'
              id='amount'
              name='amount'
              value={formData.amount}
              onChange={handleChange}
              className='w-full p-2 border rounded'
              min='0'
              step='0.01'
            />
            {errors.amount && (
              <p className='text-red-500 text-sm'>{errors.amount}</p>
            )}
          </div>
          <div className='mb-4'>
            <label
              className='block text-gray-700 mb-1'
              htmlFor='payment_method'
            >
              Payment Method
            </label>
            <select
              id='payment_method'
              name='payment_method'
              value={formData.payment_method}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select Payment Method</option>
              {paymentMethods.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
            {errors.payment_method && (
              <p className='text-red-500 text-sm'>{errors.payment_method}</p>
            )}
          </div>
          <div className='mb-4'>
            <label className='block text-gray-700 mb-1' htmlFor='received_by'>
              Received By
            </label>
            <input
              type='text'
              id='received_by'
              name='received_by'
              value={formData.received_by}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
            {errors.received_by && (
              <p className='text-red-500 text-sm'>{errors.received_by}</p>
            )}
          </div>
          <div className='flex justify-end gap-4'>
            <button
              type='button'
              onClick={onClose}
              className='bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseFormModal;
