import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Briefcase, Building2 } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-8 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 shadow-2xl">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <Briefcase size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-xl tracking-tight hidden md:block">Placement<span className="text-indigo-400">Portal</span></span>
                </div>

                <div className="flex items-center gap-8">
                    <div className="hidden md:flex items-center gap-6">
                        <Link to="/dashboard" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            <LayoutDashboard size={16} />
                            Dashboard
                        </Link>
                        <Link to="/companies" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            <Building2 size={16} />
                            {user?.role === 'admin' ? 'Manage Companies' : 'Companies'}
                        </Link>
                        {user?.role === 'student' && (
                            <Link to="/my-applications" className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                <Briefcase size={16} />
                                My Applications
                            </Link>
                        )}
                    </div>

                    <div className="h-6 w-[1px] bg-white/10 hidden md:block"></div>

                    <div className="flex items-center gap-4">
                        <Link to="/profile" className="flex items-center gap-3 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                            <div className="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                            <span className="text-sm font-semibold text-slate-200 hidden sm:block">{user?.name}</span>
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
