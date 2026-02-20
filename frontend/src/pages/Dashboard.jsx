import React from 'react';
import { useAuth } from '../context/AuthContext';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import HRDashboard from './HRDashboard';
import Navbar from '../components/Navbar';

const Dashboard = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-slate-950 pt-24 text-slate-100">
            <Navbar />
            <main>
                {user?.role === 'admin' ? <AdminDashboard /> : user?.role === 'hr' ? <HRDashboard /> : <StudentDashboard />}
            </main>
        </div>
    );
};

export default Dashboard;
