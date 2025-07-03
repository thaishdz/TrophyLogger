import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div className="flex">
     <Sidebar />
     <div className="ml-20 w-full bg-gray-50 min-h-screen p-6">
       {children}
     </div>
    </div>
  );
}

export default Layout;