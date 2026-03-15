import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleBadgeColor = {
  admin: "bg-purple-200 text-purple-800",
  manager: "bg-indigo-200 text-indigo-800",
  member: "bg-gray-200 text-gray-700",
};

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-14 sm:h-16 bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-lg z-40 sticky top-0">

      {/* Left — hamburger + branding */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onMenuClick}
          className="text-purple-600 hover:bg-white/10 p-2 rounded-lg transition-colors"
          aria-label="Toggle sidebar"
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

    <div className="flex items-baseline gap-1">
       <span className="font-extrabold text-base sm:text-lg lg:text-xl tracking-tight bg-gradient-to-r from-purple-300 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          TeamBoard Pro
        </span>
      </div>
       </div>

      {/* Right — badge + name + logout */}
<div className="flex items-center gap-2 sm:gap-3 lg:gap-4">

  {/* Role badge — visible on all sizes now */}
  <span className={`inline-flex text-xs sm:text-sm md:text-base lg:text-xl font-semibold px-2.5 md:px-3 lg:px-4 py-1 md:py-1.5 rounded-full ${roleBadgeColor[user?.role] || "bg-gray-200"}`}>
    {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
  </span>

  {/* Name only — no role under it anymore */}
  <span className="hidden sm:block text-purple-500 text-sm sm:text-sm md:text-base lg:text-xl font-semibold leading-tight">
    {user?.name}
  </span>

  <button
    onClick={handleLogout}
    className="text-xs sm:text-sm md:text-base lg:text-xl text-purple-500 hover:text-white hover:bg-purple-500 px-2.5 sm:px-3 md:px-3.5 lg:px-5 py-1 sm:py-1.5 md:py-2 rounded-lg transition-all duration-200 font-medium border border-purple-400/30 hover:border-purple-300 hover:-translate-y-0.5 hover:shadow-lg"
  >
    Logout
  </button>

</div>
    </header>
  );
};

export default Navbar;