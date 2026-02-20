import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Briefcase, GraduationCap, CheckCircle, Clock, Loader2 } from 'lucide-react';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([
        { label: 'Total Jobs', count: 0, icon: Briefcase, color: 'text-indigo-400' },
        { label: 'Applied', count: 0, icon: Clock, color: 'text-amber-400' },
        { label: 'Interviews', count: 0, icon: GraduationCap, color: 'text-purple-400' },
        { label: 'Offers', count: 0, icon: CheckCircle, color: 'text-emerald-400' },
    ]);
    const [recentCompanies, setRecentCompanies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [companiesRes, applicationsRes] = await Promise.all([
                    api.get('/companies'),
                    api.get('/applications/my')
                ]);

                const apps = applicationsRes.data;
                const counts = {
                    total: companiesRes.data.length,
                    applied: apps.length,
                    interviews: apps.filter(a => a.status === 'shortlisted').length,
                    offers: apps.filter(a => a.status === 'hired').length
                };

                setStats([
                    { label: 'Total Jobs', count: counts.total, icon: Briefcase, color: 'text-indigo-400' },
                    { label: 'Applied', count: counts.applied, icon: Clock, color: 'text-amber-400' },
                    { label: 'Interviews', count: counts.interviews, icon: GraduationCap, color: 'text-purple-400' },
                    { label: 'Offers', count: counts.offers, icon: CheckCircle, color: 'text-emerald-400' },
                ]);

                setRecentCompanies(companiesRes.data.slice(0, 3));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold gradient-text">Welcome, {user?.name}!</h1>
                    <p className="text-slate-400 mt-1">Here's what's happening with your job applications today.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="p-6">
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl bg-slate-800/50 ${stat.color}`}>
                                <stat.icon size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-slate-400">{stat.label}</p>
                                <p className="text-2xl font-bold text-white">{stat.count}</p>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 p-8">
                    <h3 className="text-xl font-bold mb-6">Recent Opportunities</h3>
                    <div className="space-y-4">
                        {recentCompanies.map((company) => (
                            <Link key={company._id} to="/companies" className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer">
                                <div>
                                    <h4 className="font-semibold text-white">{company.name}</h4>
                                    <p className="text-sm text-slate-400">{company.role} • {company.location} • ₹{company.ctc} LPA</p>
                                </div>
                                <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-medium">View</span>
                            </Link>
                        ))}
                        {recentCompanies.length === 0 && (
                            <p className="text-slate-500 text-center py-4">No companies listed yet.</p>
                        )}
                    </div>
                </Card>

                <Card className="p-8">
                    <h3 className="text-xl font-bold mb-6">Profile Summary</h3>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                            <div>
                                <p className="font-bold text-white">{user?.name}</p>
                                <p className="text-sm text-slate-400">CGPA: {user?.cgpa || 'N/A'}</p>
                            </div>
                        </div>
                        <div className="pt-6 border-t border-white/5 space-y-4">
                            <div>
                                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Skills</p>
                                <div className="flex flex-wrap gap-2">
                                    {(user?.skills || []).map(skill => (
                                        <span key={skill} className="px-2 py-1 rounded-md bg-slate-800 text-slate-300 text-xs">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default StudentDashboard;

