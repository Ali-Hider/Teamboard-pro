import { useEffect, useState } from "react";
import { getProjects } from "../api/projects";
import { getTasks } from "../api/tasks";
import { getUsers } from "../api/users";
import { useAuth } from "../context/AuthContext";

const StatCard = ({ label, value, loading, color }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 p-5 sm:p-6 hover:shadow-md transition-shadow`}>
    <p className="text-xs sm:text-sm text-gray-500 mb-1 font-medium">{label}</p>
    <p className={`text-3xl sm:text-4xl font-bold ${color || "text-gray-900"}`}>
      {loading ? (
        <span className="inline-block w-8 h-8 border-4 border-gray-200 border-t-purple-500 rounded-full animate-spin" />
      ) : value}
    </p>
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ projects: 0, tasks: 0, members: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError("");
        const [projectsRes, tasksRes, usersRes] = await Promise.all([
          getProjects({ page: 1, limit: 1 }),
          getTasks({ page: 1, limit: 1 }),
          getUsers(),
        ]);
        setStats({
          projects: projectsRes.data.total,
          tasks: tasksRes.data.total,
          members: usersRes.data.users.length,
        });
      } catch (err) {
        setError("Failed to load dashboard data. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
          Welcome back, {user?.name} 👋
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm lg:text-base mt-1">
          Here's what's happening in your workspace
        </p>
      </div>

      {/* Error state */}
      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
          {error}
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Projects"
          value={stats.projects}
          loading={loading}
          color="text-purple-600"
        />
        <StatCard
          label="Total Tasks"
          value={stats.tasks}
          loading={loading}
          color="text-blue-600"
        />
        <StatCard
          label="Team Members"
          value={stats.members}
          loading={loading}
          color="text-green-600"
        />
      </div>
    </div>
  );
};

export default Dashboard;