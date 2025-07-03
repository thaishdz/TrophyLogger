

function GameStatusTabs({ activeStatus, onStatusChange }) {
  const statusList = ['All', 'In Progress', 'Completed', 'Not Started'];
  return (
  <div className="relative border-b border-gray-200">
    <div className="flex items-center justify-start">
      {statusList.map((status) => (
        <button 
          key={status}
          className={`mt-8 px-4 py-2 text-sm font-bold focus:outline-none cursor-pointer ${
                        status == 'All'
                          ? 'text-gray-900'
                          : 'text-gray-500 hover:text-yellow-600'
                      }`}
          onClick={onStatusChange(status)}
        >
          {status}
        </button>
      ))}
    </div>
  </div>
  );
}


export default GameStatusTabs;