import { Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import UploadResume from './pages/UploadResume';
import AnalysisResults from './pages/AnalysisResults';
import ResumeHistory from './pages/ResumeHistory';
import ProtectedRoute from './pages/ProtectedRoute';
import TemplateGallery from './pages/TemplateGallery';

function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Login required */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
<Route path="/templates" element={<TemplateGallery />} />
        <Route path="/upload" element={<UploadResume />} />
        <Route path="/history" element={<ResumeHistory />} />
        <Route
          path="/analysis/:resumeId"
          element={<AnalysisResults />}
        />
      </Route>

      {/* Unknown URLs return to the home page */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;