import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Users, Building2, FileCheck, TrendingUp, Loader2 } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#10b981', '#f43f5e']; // Emerald for Placed, Rose for Unplaced

const AdminDashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState([
        { label: 'Total Students', count: 0, icon: Users, color: 'text-blue-400', link: '/students' },
        { label: 'Partner Companies', count: 0, icon: Building2, color: 'text-indigo-400', link: '/companies' },
        { label: 'Active Applications', count: 0, icon: FileCheck, color: 'text-emerald-400', link: '/applications' },
        { label: 'Placement Rate', count: '0%', icon: TrendingUp, color: 'text-rose-400' },
    ]);
    const [pendingApps, setPendingApps] = useState([]);
    const [analytics, setAnalytics] = useState({ pieData: [], barData: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [studentsRes, companiesRes, appsRes] = await Promise.all([
                    api.get('/students'),
                    api.get('/companies'),
                    api.get('/applications')
                ]);

                const allApps = appsRes.data;
                const placedCount = allApps.filter(a => a.status === 'hired').length;
                const placementRate = studentsRes.data.length > 0
                    ? Math.round((placedCount / studentsRes.data.length) * 100)
                    : 0;

                setStats([
                    { label: 'Total Students', count: studentsRes.data.length, icon: Users, color: 'text-blue-400', link: '/students' },
                    { label: 'Partner Companies', count: companiesRes.data.length, icon: Building2, color: 'text-indigo-400', link: '/companies' },
                    { label: 'Active Applications', count: allApps.length, icon: FileCheck, color: 'text-emerald-400', link: '/applications' },
                    { label: 'Placement Rate', count: `${placementRate}%`, icon: TrendingUp, color: 'text-rose-400' },
                ]);

                // Analytics setup
                const pieData = [
                    { name: 'Placed', value: placedCount },
                    { name: 'Unplaced', value: studentsRes.data.length - placedCount }
                ];

                const deptMap = {};
                studentsRes.data.forEach(s => {
                    const dept = s.department || 'Unknown';
                    if (!deptMap[dept]) deptMap[dept] = { name: dept, Students: 0, Placed: 0 };
                    deptMap[dept].Students += 1;
                });

                allApps.filter(a => a.status === 'hired').forEach(a => {
                    const dept = a.student?.department || 'Unknown';
                    if (deptMap[dept]) {
                        deptMap[dept].Placed += 1;
                    }
                });

                setAnalytics({ pieData, barData: Object.values(deptMap) });
                setPendingApps(allApps.filter(a => a.status === 'pending').slice(0, 5));
            } catch (error) {
                console.error('Error fetching admin dashboard data:', error);
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
            <header>
                <h1 className="text-3xl font-bold gradient-text">Admin Control Center</h1>
                <p className="text-slate-400 mt-1">Manage placements, companies, and student records.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                    <Card key={idx} className="p-0 overflow-hidden group">
                        <Link to={stat.link || '#'} className="block p-6 hover:bg-white/[0.02] transition-all">
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl bg-slate-800/50 ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-slate-400">{stat.label}</p>
                                    <p className="text-2xl font-bold text-white">{stat.count}</p>
                                </div>
                            </div>
                        </Link>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8">
                    <h3 className="text-xl font-bold mb-6">Placed vs Unplaced</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={analytics.pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                    {analytics.pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="p-8">
                    <h3 className="text-xl font-bold mb-6">Department Placements</h3>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analytics.barData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                                <RechartsTooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} cursor={{ fill: '#334155', opacity: 0.4 }} />
                                <Legend />
                                <Bar dataKey="Students" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="Placed" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Pending Applications</h3>
                        <Link to="/applications" className="text-sm text-indigo-400 hover:underline">View all</Link>
                    </div>
                    <div className="space-y-4">
                        {pendingApps.map((app) => (
                            <div key={app._id} className="flex items-center justify-between p-4 rounded-xl bg-slate-800/30 border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold">
                                        {app.student?.name?.[0] || 'S'}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">{app.student?.name || 'Unknown'}</h4>
                                        <p className="text-xs text-slate-400">Applying for {app.company?.name} • {app.company?.role}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link to="/applications">
                                        <button className="px-3 py-1 rounded-md bg-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-500/30 transition-all">Review</button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                        {pendingApps.length === 0 && (
                            <p className="text-slate-500 text-center py-4">No pending applications.</p>
                        )}
                    </div>
                </Card>

                <Card className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold">Quick Actions</h3>
                        <p className="text-sm text-slate-400 italic">System management shortcuts</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Link to="/companies" className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-center hover:bg-indigo-500/20 transition-all">
                            <Building2 className="mx-auto mb-2 text-indigo-400" size={24} />
                            <span className="text-sm font-semibold">New Company</span>
                        </Link>
                        <Link to="/students" className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-center hover:bg-blue-500/20 transition-all">
                            <Users className="mx-auto mb-2 text-blue-400" size={24} />
                            <span className="text-sm font-semibold">View Students</span>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;

