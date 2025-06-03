function ExpenseTable({ expenses, onEdit, onDelete }) {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full bg-white shadow-md rounded-lg'>
        <thead>
          <tr className='bg-gray-200 text-gray-600 uppercase text-sm leading-normal'>
            <th className='py-3 px-6 text-left'>Date</th>
            <th className='py-3 px-6 text-left'>Description</th>
            <th className='py-3 px-6 text-left'>Category</th>
            <th className='py-3 px-6 text-right'>Amount</th>
            <th className='py-3 px-6 text-left'>Payment Method</th>
            <th className='py-3 px-6 text-left'>Received By</th>
            {onEdit && onDelete && (
              <th className='py-3 px-6 text-center'>Actions</th>
            )}
          </tr>
        </thead>
        <tbody className='text-gray-600 text-sm font-light'>
          {expenses.length === 0 ? (
            <tr>
              <td
                colSpan={onEdit && onDelete ? 7 : 6}
                className='py-3 px-6 text-center'
              >
                No expenses found
              </td>
            </tr>
          ) : (
            expenses.map((expense) => (
              <tr
                key={expense._id}
                className='border-b border-gray-200 hover:bg-gray-100'
              >
                <td className='py-3 px-6'>
                  {new Date(expense.date).toLocaleDateString()}
                </td>
                <td className='py-3 px-6'>{expense.description}</td>
                <td className='py-3 px-6'>{expense.category}</td>
                <td className='py-3 px-6 text-right'>
                  ${expense.amount.toFixed(2)}
                </td>
                <td className='py-3 px-6'>{expense.payment_method}</td>
                <td className='py-3 px-6'>{expense.received_by}</td>
                {onEdit && onDelete && (
                  <td className='py-3 px-6 text-center'>
                    <button
                      onClick={() => onEdit(expense)}
                      className='bg-blue-500 text-white px-2 py-1 rounded mr-2 hover:bg-blue-600'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(expense._id)}
                      className='bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600'
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
