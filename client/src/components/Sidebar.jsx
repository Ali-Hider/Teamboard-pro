import { NavLink } from "react-router-dom";
import RoleGuard from "./RoleGuard";

const links = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    to: "/projects",
    label: "Projects",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
  },
  {
    to: "/tasks",
    label: "Tasks",
    icon: (
      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

const teamIcon = (
  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Sidebar = ({ onClose }) => {
  return (
    <div className="w-56 sm:w-60 lg:w-64 h-full bg-gradient-to-b from-white via-purple-50 to-purple-100 flex flex-col py-4 sm:py-6 shadow-xl border-r border-purple-100">

      {/* Close button — mobile only */}
      <div className="flex justify-end px-3 mb-3 sm:mb-4">
  <button
    onClick={onClose}
    className="text-purple-400 hover:text-purple-700 hover:bg-purple-100 p-1.5 rounded-lg transition-colors"
    aria-label="Close sidebar"
  >
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  </button>
</div>

      {/* Section label */}
      <p className="text-purple-400 text-xs font-semibold uppercase tracking-widest px-4 sm:px-5 mb-2">
        Navigation
      </p>

      {/* Nav links */}
      <nav className="flex flex-col gap-0.5 px-2 sm:px-3">
        {links.map((link) => (
  <NavLink
    key={link.to}
    to={link.to}
    onClick={() => { if (window.innerWidth < 768) onClose(); }}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 ${
        isActive
          ? "bg-purple-600 text-white shadow-md"
          : "text-purple-700 hover:bg-purple-200 hover:text-purple-900"
      }`
    }
  >
    {link.icon}
    {link.label}
  </NavLink>
))}

{/* Team link same fix */}
<RoleGuard allowedRoles={["admin"]}>
  <NavLink
    to="/team"
    onClick={() => { if (window.innerWidth < 768) onClose(); }}
    className={({ isActive }) =>
      `flex items-center gap-3 px-3 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 ${
        isActive
          ? "bg-purple-600 text-white shadow-md"
          : "text-purple-700 hover:bg-purple-200 hover:text-purple-900"
      }`
    }
  >
    {teamIcon}
    Team
  </NavLink>
</RoleGuard>
      </nav>

      {/* Bottom — version tag */}
      <div className="mt-auto px-4 sm:px-5">
        <p className="text-purple-300 text-xs">v1.0.0</p>
      </div>
    </div>
  );
};

export default Sidebar;