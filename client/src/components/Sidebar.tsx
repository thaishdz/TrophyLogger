

function Sidebar() {
  return (
  <div className="w-20 bg-white shadow-sm min-h-screen fixed left-0 top-0 flex flex-col items-center py-6">
    <div className="w-10 h-10 flex items-center justify-center mb-8">
      <svg className="w-5 h-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    </div>
    
    <div className="w-10 h-10 flex items-center justify-center mb-8 text-indigo-600 relative">
       <div className="absolute left-0 w-1 h-10 bg-yellow-600 rounded-r"></div>
       <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
         <path d="M9.5 12a2 2 0 0 0-0.59-1.42l-1.5-1.5A2 2 0 0 06 8.5H1.5A1.5 1.5 0 0 00 10v4a1.5 1.5 0 0 01.5 1.5H6a2 2 0 0 01.41-0.59l1.5-1.5A2 2 0 0 09.5 12Z" fill="#000"/>
         <path d="M22.5 8.5H18a2 2 0 0 0-1.41 0.58l-1.5 1.5a2 2 0 0 00 2.83l1.5 1.5a2 2 0 0 01.41 0.59h4.5A1.5 1.5 0 0 024 14v-4a1.5 1.5 0 0 0-1.5-1.5Z" fill="#000"/>
         <path d="M13.41 15.08a2 2 0 0 0-2.82 0l-1.5 1.5A2 2 0 0 08.5 18v4.5A1.5 1.5 0 0 010 24h4a1.5 1.5 0 0 01.5-1.5V18a2 2 0 0 0-0.59-1.42Z" fill="#000"/>
         <path d="M10.59 8.91a2 2 0 0 0 2.82 0l1.51 -1.5A2 2 0 0 015.5 6V1.5A1.5 1.5 0 0 014 0h-4a1.5 1.5 0 0 0-1.5 1.5V6a2 2 0 0 0 0.59 1.41Z" fill="#000"/>
       </svg>
     </div>
  </div>
  );
}

export default Sidebar;