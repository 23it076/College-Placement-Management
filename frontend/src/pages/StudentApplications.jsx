import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Clock, CheckCircle, XCircle, Building2, MapPin, ChevronRight, Loader2, Briefcase } from 'lucide-react';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const StudentApplications = () => {
    const { user } = useAuth();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const response = await api.get('/applications/my');
                setApplications(response.data);
            } catch (error) {
                console.error('Error fetching applications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchApplications();
    }, []);

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case 'hired':
            case 'approved': return <CheckCircle size={18} className="text-emerald-400" />;
            case 'rejected': return <XCircle size={18} className="text-rose-400" />;
            case 'shortlisted': return <CheckCircle size={18} className="text-indigo-400" />;
            default: return <Clock size={18} className="text-amber-400" />;
        }
    };

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
            <div className="p-8 max-w-5xl mx-auto space-y-8">
                <header>
                    <h1 className="text-3xl font-bold gradient-text">My Applications</h1>
                    <p className="text-slate-400 mt-1">Track the status of your journey with recruiting companies.</p>
                </header>

                <div className="space-y-4">
                    {applications.map((app) => (
                        <Card key={app._id} className="p-6 hover:border-indigo-500/30 transition-all group cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-800/50 flex items-center justify-center font-bold text-2xl text-indigo-400 border border-white/5 group-hover:bg-indigo-500/10 transition-colors">
                                        {app.company?.name?.[0] || 'C'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">{app.company?.role || 'N/A'}</h3>
                                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-400">
                                            <div className="flex items-center gap-1.5">
                                                <Building2 size={14} />
                                                {app.company?.name || 'Unknown'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <MapPin size={14} />
                                                {app.company?.location || 'Remote'}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} />
                                                Applied on {new Date(app.appliedAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border border-white/5 bg-slate-900/40`}>
                                        {getStatusIcon(app.status)}
                                        <span className="text-sm font-semibold capitalize">{app.status}</span>
                                    </div>
                                    <ChevronRight size={20} className="text-slate-600 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>

                {applications.length === 0 && (
                    <div className="text-center py-20 bg-slate-900/20 rounded-3xl border border-dashed border-white/10">
                        <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Briefcase size={32} className="text-slate-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400">No applications yet</h3>
                        <p className="text-slate-500 mt-2">Start exploring companies to find your dream role!</p>
                        <Link to="/companies">
                            <Button variant="primary" className="mt-8">Explore Companies</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StudentApplications;

