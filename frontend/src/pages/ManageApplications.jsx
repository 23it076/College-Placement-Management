import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import { FileCheck, Search, Filter, Check, X, Eye, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const ManageApplications = () => {
    const [filter, setFilter] = useState('all');
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications');
            setApplications(response.data);
        } catch (error) {
            console.error('Error fetching applications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleUpdateStatus = async (appId, status) => {
        try {
            await api.put(`/applications/${appId}/status`, { status });
            fetchApplications();
        } catch (error) {
            alert('Failed to update status');
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'hired':
            case 'approved': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            case 'rejected': return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
            case 'shortlisted': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
            default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
        }
    };

    const filteredApps = filter === 'all'
        ? applications
        : applications.filter(app => app.status.toLowerCase() === filter.toLowerCase());

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 text-slate-100">
            <Navbar />
            <div className="p-8 max-w-7xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold gradient-text">Application Matrix</h1>
                    <p className="text-slate-400 mt-1">Review and process student job applications.</p>
                </header>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex bg-slate-900/50 p-1 rounded-xl border border-white/5">
                        {['all', 'pending', 'shortlisted', 'hired', 'rejected'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-6 py-2 rounded-lg text-sm font-medium capitalize transition-all ${filter === tab ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <Card className="overflow-hidden p-0">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Student</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Company & Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredApps.map((app) => (
                                <tr key={app._id} className="hover:bg-white/[0.02] transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs font-bold">
                                                {app.student?.name?.[0] || 'S'}
                                            </div>
                                            <span className="font-medium">{app.student?.name || 'Unknown'}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-white">{app.company?.name || 'Unknown'}</div>
                                        <div className="text-xs text-slate-400">{app.company?.role || 'N/A'}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-400">{new Date(app.appliedAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(app.status)}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {app.status === 'pending' && (
                                                <button onClick={() => handleUpdateStatus(app._id, 'shortlisted')} className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all" title="Shortlist">
                                                    <Check size={16} />
                                                </button>
                                            )}
                                            {app.status === 'shortlisted' && (
                                                <button onClick={() => handleUpdateStatus(app._id, 'hired')} className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all" title="Hire">
                                                    <FileCheck size={16} />
                                                </button>
                                            )}
                                            {(app.status !== 'rejected' && app.status !== 'hired') && (
                                                <button onClick={() => handleUpdateStatus(app._id, 'rejected')} className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all" title="Reject">
                                                    <X size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredApps.length === 0 && (
                        <div className="text-center py-10 text-slate-500">No applications found.</div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default ManageApplications;

