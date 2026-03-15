import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProjects, addProject, editProject, removeProject } from "../store/projectsSlice";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import RoleGuard from "../components/RoleGuard";
import Pagination from "../components/Pagination";

const statusColors = {
  active: "bg-green-100 text-green-700",
  completed: "bg-blue-100 text-blue-700",
  "on-hold": "bg-yellow-100 text-yellow-700",
};

const ProjectModal = ({ initial, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
  });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name.length < 3) return setError("Name must be at least 3 characters");
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900">
            {initial ? "Edit Project" : "New Project"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setError(""); }}
              placeholder="e.g. Website Redesign"
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
              placeholder="What is this project about?"
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm lg:text-base font-medium hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="flex-1 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg text-sm lg:text-base font-medium transition-colors">
              {loading ? "Saving..." : initial ? "Save Changes" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const DeleteModal = ({ project, onClose, onConfirm, loading }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
      <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-2">Delete Project</h2>
      <p className="text-sm lg:text-base text-gray-500 mb-6">
        Are you sure you want to delete <span className="font-semibold text-gray-700">"{project.name}"</span>? This will also delete all tasks under it.
      </p>
      <div className="flex gap-3">
        <button onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={loading} className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white rounded-lg text-sm font-medium transition-colors">
          {loading ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  </div>
);

const Projects = () => {
  const dispatch = useDispatch();
  const { items: projects, loading, totalPages } = useSelector((s) => s.projects);
  const { user } = useAuth();
  const { showToast } = useToast();

  const [showCreate, setShowCreate] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchProjects({ page: currentPage, limit: 10 }));
  }, [dispatch, currentPage]);

  const handleCreate = async (form) => {
    setActionLoading(true);
    const result = await dispatch(addProject(form));
    setActionLoading(false);
    if (result.meta.requestStatus === "fulfilled") {
      showToast("Project created successfully");
      setShowCreate(false);
      dispatch(fetchProjects({ page: currentPage, limit: 10 }));
    } else {
      showToast(result.payload || "Failed to create project", "error");
    }
  };

  const handleEdit = async (form) => {
    setActionLoading(true);
    const result = await dispatch(editProject({ id: editTarget._id, data: form }));
    setActionLoading(false);
    if (result.meta.requestStatus === "fulfilled") {
      showToast("Project updated successfully");
      setEditTarget(null);
    } else {
      showToast(result.payload || "Failed to update project", "error");
    }
  };

  const handleDelete = async () => {
    setActionLoading(true);
    const result = await dispatch(removeProject(deleteTarget._id));
    setActionLoading(false);
    if (result.meta.requestStatus === "fulfilled") {
      showToast("Project deleted");
      setDeleteTarget(null);
      dispatch(fetchProjects({ page: currentPage, limit: 10 }));
    } else {
      showToast(result.payload || "Failed to delete project", "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Projects</h2>
          <p className="text-gray-500 text-xs sm:text-sm lg:text-base mt-0.5">Manage your company projects</p>
        </div>
        <RoleGuard allowedRoles={["admin", "manager"]}>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 sm:px-4 lg:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm lg:text-base font-medium transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">New Project</span>
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
      {!loading && projects.length === 0 && (
        <div className="text-center py-20">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-gray-700 font-semibold text-sm sm:text-base">No projects yet</p>
          <RoleGuard allowedRoles={["admin", "manager"]}>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">Click "New Project" to get started</p>
          </RoleGuard>
        </div>
      )}

      {!loading && projects.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((project) => (
            <div key={project._id} className="bg-white rounded-2xl border border-gray-200 p-4 sm:p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 leading-tight">{project.name}</h3>
                <span className={`shrink-0 text-xs font-medium px-2.5 py-1 rounded-full ${statusColors[project.status]}`}>
                  {project.status}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 line-clamp-2">
                {project.description || "No description provided."}
              </p>
              <RoleGuard allowedRoles={["admin", "manager"]}>
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button onClick={() => setEditTarget(project)} className="flex-1 text-xs sm:text-sm text-purple-600 hover:text-purple-700 hover:bg-purple-50 py-1.5 rounded-lg font-medium transition-colors">
                    Edit
                  </button>
                  <button onClick={() => setDeleteTarget(project)} className="flex-1 text-xs sm:text-sm text-red-500 hover:text-red-600 hover:bg-red-50 py-1.5 rounded-lg font-medium transition-colors">
                    Delete
                  </button>
                </div>
              </RoleGuard>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {showCreate && <ProjectModal onClose={() => setShowCreate(false)} onSubmit={handleCreate} loading={actionLoading} />}
      {editTarget && <ProjectModal initial={editTarget} onClose={() => setEditTarget(null)} onSubmit={handleEdit} loading={actionLoading} />}
      {deleteTarget && <DeleteModal project={deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} loading={actionLoading} />}
    </div>
  );
};

export default Projects;