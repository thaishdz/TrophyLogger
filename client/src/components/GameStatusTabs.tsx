type GameStatusTabsProps = {
  activeStatus: string;
  onStatusChange: (status: string) => void;
};

function GameStatusTabs({ activeStatus, onStatusChange }: GameStatusTabsProps) {
  const statusList = ['All', 'In Progress', 'Completed', 'Not Started']
  return (
    <div className="flex items-center gap-2 mt-8">
      {statusList.map((status) => (
        <button
          key={status}
          className={`px-4 py-2 text-sm font-bold rounded-full focus:outline-none cursor-pointer transition-colors ${
            status === activeStatus
              ? 'bg-[#FBF7EC] border-[3px] border-black neo-shadow'
              : 'text-gray-500 hover:text-black'
          }`}
          onClick={() => onStatusChange(status)}
        >
          {status}
        </button>
      ))}
    </div>
  )
}


export default GameStatusTabs
