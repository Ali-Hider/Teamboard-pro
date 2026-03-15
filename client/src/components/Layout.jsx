import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true); // open by default on all devices

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      <div className="flex flex-1 relative">

        {/* Backdrop — mobile only */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-20 sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar — controlled by state on ALL devices */}
        {sidebarOpen && (
          <aside className="fixed sm:static top-14 sm:top-0 left-0 z-30 h-[calc(100vh-3.5rem)] sm:h-auto">
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </aside>
        )}

        {/* Page content — shifts right when sidebar is open on desktop */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>

      </div>
      <Footer/>
    </div>
  );
};

export default Layout;