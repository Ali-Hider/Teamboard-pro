import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SetPassword from "./pages/SetPassword";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Tasks from "./pages/Tasks";
import Team from "./pages/Team";

function App() {
  return (
    <Routes>
      {/* Landing page */}
      <Route path="/" element={<Landing />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/set-password" element={<SetPassword />} />

      {/* Protected routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>
      } />
      <Route path="/projects" element={
        <ProtectedRoute><Layout><Projects /></Layout></ProtectedRoute>
      } />
      <Route path="/tasks" element={
        <ProtectedRoute><Layout><Tasks /></Layout></ProtectedRoute>
      } />
      <Route path="/team" element={
        <ProtectedRoute><Layout><Team /></Layout></ProtectedRoute>
      } />

      {/* Unknown routes go to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;