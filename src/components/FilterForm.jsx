function FilterForm({
  searchQuery,
  setSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  handleGeneratePDF,
}) {
  return (
    <div className='bg-white p-4 rounded-lg shadow-md mb-6'>
      <div className='flex flex-col md:flex-row gap-4'>
        <input
          type='text'
          placeholder='Search by description or category'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='p-2 border rounded flex-1'
        />
        <input
          type='date'
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className='p-2 border rounded'
        />
        <input
          type='date'
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className='p-2 border rounded'
        />
        <button
          onClick={handleGeneratePDF}
          className='bg-green-500 text-white p-2 rounded hover:bg-green-600'
        >
          Generate PDF Report
        </button>
      </div>
    </div>
  );
}

export default FilterForm;
