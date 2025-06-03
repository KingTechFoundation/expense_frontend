function ExpenseTable({ expenses, onEdit, onDelete }) {
  // Format amount with commas and RWF
  const formatAmount = (amount) => {
    return `RWF ${amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  };

  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full bg-white shadow-lg rounded-lg border border-gray-200 font-sans'>
        <thead>
          <tr className='bg-blue-600 text-white text-lg font-semibold'>
            <th className='py-4 px-6 text-left'>Date</th>
            <th className='py-4 px-6 text-left'>Description</th>
            <th className='py-4 px-6 text-left'>Category</th>
            <th className='py-4 px-6 text-right'>Amount</th>
            <th className='py-4 px-6 text-left'>Payment Method</th>
            <th className='py-4 px-6 text-left'>Received By</th>
            {onEdit && onDelete && (
              <th className='py-4 px-6 text-center'>Actions</th>
            )}
          </tr>
        </thead>
        <tbody className='text-gray-700 text-base'>
          {expenses.length === 0 ? (
            <tr className='bg-gray-50'>
              <td
                colSpan={onEdit && onDelete ? 7 : 6}
                className='py-4 px-6 text-center text-gray-500'
              >
                No expenses found
              </td>
            </tr>
          ) : (
            expenses.map((expense, index) => (
              <tr
                key={expense._id}
                className={`border-b border-gray-200 ${
                  index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                } hover:bg-blue-50 transition`}
              >
                <td className='py-3 px-6'>
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className='py-3 px-6'>{expense.description}</td>
                <td className='py-3 px-6'>{expense.category}</td>
                <td className='py-3 px-6 text-right'>
                  {formatAmount(expense.amount)}
                </td>
                <td className='py-3 px-6'>{expense.payment_method}</td>
                <td className='py-3 px-6'>{expense.received_by}</td>
                {onEdit && onDelete && (
                  <td className='py-3 px-6 text-center'>
                    <button
                      onClick={() => onEdit(expense)}
                      className='bg-blue-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-blue-600 transition text-sm'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(expense._id)}
                      className='bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition text-sm'
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ExpenseTable;
