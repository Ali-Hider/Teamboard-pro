import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTasks, addTask, changeTaskStatus } from "../store/tasksSlice";
import { getProjects } from "../api/projects";
import { getUsers } from "../api/users";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import RoleGuard from "../components/RoleGuard";
import Pagination from "../components/Pagination";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const TaskModal = ({ onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({ title: "", description: "", projectId: "", assignedTo: "" });
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [dropdownLoading, setDropdownLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setDropdownLoading(true);
        const [pRes, uRes] = await Promise.all([
          getProjects({ page: 1, limit: 100 }),
          getUsers(),
        ]);
        setProjects(pRes.data.projects);
        setUsers(uRes.data.users);
      } catch (err) {
        setError("Failed to load projects or users");
      } finally {
        setDropdownLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.title.length < 3) return setError("Title must be at least 3 characters");
    if (!form.projectId) return setError("Please select a project");
    if (!form.assignedTo) return setError("Please assign to a user");
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">New Task</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>
        )}

        {dropdownLoading ? (
          <div className="flex justify-center py-8">
            <div className="w-7 h-7 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => { setForm({ ...form, title: e.target.value }); setError(""); }}
                placeholder="e.g. Design homepage"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description <span className="text-gray-400">(optional)</span>
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Task details..."
                rows={2}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project</label>
              {projects.length === 0 ? (
                <div className="w-full px-4 py-2.5 border border-yellow-300 bg-yellow-50 rounded-lg text-sm text-yellow-700">
                  No projects found. Please create a project first.
                </div>
              ) : (
                <select
                  value={form.projectId}
                  onChange={(e) => { setForm({ ...form, projectId: e.target.value }); setError(""); }}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
                >
                  <option value="">Select a project</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>{p.name}</option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assign To</label>
              <select
                value={form.assignedTo}
                onChange={(e) => { setForm({ ...form, assignedTo: e.target.value }); setError(""); }}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
              >
                <option value="">Select a user</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm lg:text-base font-medium hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || projects.length === 0}
                className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 disabled:cursor-not-allowed text-white rounded-lg text-sm lg:text-base font-medium transition-colors"
              >
                {loading ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const Tasks = () => {
  const dispatch = useDispatch();
  const { items: tasks, loading, totalPages } = useSelector((s) => s.tasks);
  const { user } = useAuth();
  const { showToast } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchTasks({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handleCreate = async (form) => {
    setActionLoading(true);
    const result = await dispatch(addTask(form));
    setActionLoading(false);
    if (result.meta.requestStatus === "fulfilled") {
      showToast("Task created successfully");
      setShowCreate(false);
      dispatch(fetchTasks({ page: currentPage, limit: 10 }));
    } else {
      showToast(result.payload || "Failed to create task", "error");
    }
  };

  const handleStatusChange = async (taskId, status) => {
    const result = await dispatch(changeTaskStatus({ taskId, status }));
    if (result.meta.requestStatus === "fulfilled") {
      showToast("Status updated");
    } else {
      showToast(result.payload || "Failed to update status", "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Tasks</h2>
          <p className="text-gray-500 text-xs sm:text-sm lg:text-base mt-0.5">Track and manage your team's work</p>
        </div>
        <RoleGuard allowedRoles={["admin", "manager"]}>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm lg:text-base font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Task</span>
            <span className="sm:hidden">New</span>
          </button>
        </RoleGuard>
      </div>

      {loading && (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
        </div>
      )}

      {/* ✅ Updated empty state with icon */}
      {!loading && tasks.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-700 font-semibold text-sm sm:text-base">No tasks yet</p>
          <RoleGuard allowedRoles={["admin", "manager"]}>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Click "New Task" to get started</p>
          </RoleGuard>
        </div>
      )}

      {!loading && tasks.length > 0 && (
        <div className="flex flex-col gap-3">
          {tasks.map((task) => {
            const isOwner = task.assignedTo?._id === user?.id;
            const canChangeStatus = user?.role === "admin" || user?.role === "manager" || isOwner;

            return (
              <div key={task._id} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-1">{task.title}</h3>
                    {task.description && (
                      <p className="text-xs sm:text-sm text-gray-500 mb-2 line-clamp-1">{task.description}</p>
                    )}
                    <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <span className="text-gray-400">Project:</span>
                        <span className="font-medium text-gray-700">{task.projectId?.name}</span>
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <span className="text-gray-400">Assigned to:</span>
                        <span className="font-medium text-gray-700">{task.assignedTo?.name}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[task.status]}`}>
                      {task.status}
                    </span>
                    {canChangeStatus && (
                      <select
                        value={task.status}
                        onChange={(e) => handleStatusChange(task._id, e.target.value)}
                        className="text-xs sm:text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white text-gray-700"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                      </select>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {showCreate && (
        <TaskModal onClose={() => setShowCreate(false)} onSubmit={handleCreate} loading={actionLoading} />
      )}
    </div>
  );
};

export default Tasks;