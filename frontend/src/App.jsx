import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ManageCompanies from './pages/ManageCompanies';
import ManageApplications from './pages/ManageApplications';
import ManageStudents from './pages/ManageStudents';
import StudentDetails from './pages/StudentDetails';
import StudentApplications from './pages/StudentApplications';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Router>
            <div className="w-full min-h-screen bg-slate-950">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/companies" element={<ManageCompanies />} />
                        <Route path="/applications" element={<ManageApplications />} />
                        <Route path="/students" element={<ManageStudents />} />
                        <Route path="/students/:id" element={<StudentDetails />} />
                        <Route path="/my-applications" element={<StudentApplications />} />
                        <Route path="/profile" element={<Profile />} />
                    </Route>

                    {/* Default Redirects */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </div>
        </Router>
    )
}

export default App
