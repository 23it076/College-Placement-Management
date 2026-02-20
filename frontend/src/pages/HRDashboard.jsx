import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, FileCheck, TrendingUp, Loader2, CheckCircle, XCircle } from 'lucide-react';

const HRDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([
        { label: 'Total Applicants', count: 0, icon: Users, color: 'text-blue-400' },
        { label: 'Pending Reviews', count: 0, icon: FileCheck, color: 'text-amber-400' },
        { label: 'Shortlisted', count: 0, icon: TrendingUp, color: 'text-indigo-400' },
        { label: 'Hired', count: 0, icon: CheckCircle, color: 'text-emerald-400' },
    ]);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user?.companyId) {
                setLoading(false);
                return;
            }
            try {
                const res = await api.get(`/applications/company/${user.companyId}`);
                const apps = res.data;

                setStats([
                    { label: 'Total Applicants', count: apps.length, icon: Users, color: 'text-blue-400' },
                    { label: 'Pending Reviews', count: apps.filter(a => a.status === 'pending').length, icon: FileCheck, color: 'text-amber-400' },
                    { label: 'Shortlisted', count: apps.filter(a => a.status === 'shortlisted').length, icon: TrendingUp, color: 'text-indigo-400' },
                    { label: 'Hired', count: apps.filter(a => a.status === 'hired').length, icon: CheckCircle, color: 'text-emerald-400' },
                ]);

                setApplications(apps);
            } catch (error) {
                console.error('Error fetching HR dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user?.companyId]);

    const handleUpdateStatus = async (appId, newStatus) => {
        try {
            const res = await api.put(`/applications/${appId}/status`, { status: newStatus });
            setApplications(prev => prev.map(a => a._id === appId ? { ...a, status: res.data.status } : a));

            // Re-calc stats locally
            const updatedApps = applications.map(a => a._id === appId ? { ...a, status: res.data.status } : a);
            setStats([
                { label: 'Total Applicants', count: updatedApps.length, icon: Users, color: 'text-blue-400' },
                { label: 'Pending Reviews', count: updatedApps.filter(a => a.status === 'pending').length, icon: FileCheck, color: 'text-amber-400' },
                { label: 'Shortlisted', count: updatedApps.filter(a => a.status === 'shortlisted').length, icon: TrendingUp, color: 'text-indigo-400' },
                { label: 'Hired', count: updatedApps.filter(a => a.status === 'hired').length, icon: CheckCircle, color: 'text-emerald-400' },
            ]);
        } catch (error) {
            alert('Failed to update status: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (!user?.companyId) {
        return (
            <div className="p-8 max-w-7xl mx-auto text-center">
                <h2 className="text-2xl font-bold text-slate-300">No Company Assigned</h2>
                <p className="text-slate-500 mt-2">Please ask the administrator to link your account to a specific company.</p>
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header>
                <h1 className="text-3xl font-bold gradient-text">HR Dashboard</h1>
                <p className="text-slate-400 mt-1">Manage applicants for your company.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="p-0 overflow-hidden group">
                        <div className="block p-6 transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-slate-800/50 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white">{stat.count}</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <Card className="p-8">
                <h3 className="text-xl font-bold mb-6">Candidate Applications</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-white/10 text-slate-400 text-sm">
                                <th className="pb-3 px-4 font-medium">Candidate</th>
                                <th className="pb-3 px-4 font-medium">Department</th>
                                <th className="pb-3 px-4 font-medium">CGPA</th>
                                <th className="pb-3 px-4 font-medium">Resume</th>
                                <th className="pb-3 px-4 font-medium">Status</th>
                                <th className="pb-3 px-4 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr key={app._id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm">
                                                {app.student?.name?.charAt(0) || 'U'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{app.student?.name || 'Unknown User'}</p>
                                                <p className="text-xs text-slate-400">{app.student?.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-slate-300">{app.student?.department || 'N/A'}</td>
                                    <td className="py-4 px-4 text-slate-300">{app.student?.cgpa || 'N/A'}</td>
                                    <td className="py-4 px-4">
                                        {app.student?.resume ? (
                                            <a href={`http://localhost:5000${app.student.resume}`} target="_blank" rel="noreferrer" className="text-indigo-400 text-sm hover:underline">
                                                View PDF
                                            </a>
                                        ) : (
                                            <span className="text-slate-500 text-sm">No Resume</span>
                                        )}
                                    </td>
                                    <td className="py-4 px-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${app.status === 'hired' ? 'bg-emerald-500/10 text-emerald-400' :
                                                app.status === 'rejected' ? 'bg-rose-500/10 text-rose-400' :
                                                    app.status === 'shortlisted' ? 'bg-indigo-500/10 text-indigo-400' :
                                                        'bg-amber-500/10 text-amber-400'
                                            }`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4 text-right space-x-2">
                                        {app.status === 'pending' && (
                                            <>
                                                <button onClick={() => handleUpdateStatus(app._id, 'shortlisted')} className="px-3 py-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 text-xs font-semibold hover:bg-indigo-500/30 transition-all">Shortlist</button>
                                                <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/30 transition-all">Reject</button>
                                            </>
                                        )}
                                        {app.status === 'shortlisted' && (
                                            <>
                                                <button onClick={() => handleUpdateStatus(app._id, 'hired')} className="px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/30 transition-all">Hire</button>
                                                <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-semibold hover:bg-rose-500/30 transition-all">Reject</button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {applications.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="py-8 text-center text-slate-500">
                                        No applications received yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default HRDashboard;
