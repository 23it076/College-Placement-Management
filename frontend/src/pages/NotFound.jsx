import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import { AlertTriangle } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
            <Navbar />
            <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center">
                <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center text-red-400 mb-4 animate-pulse">
                    <AlertTriangle size={48} />
                </div>
                <h1 className="text-5xl font-black tracking-tight gradient-text">404</h1>
                <h2 className="text-2xl font-bold text-white">Oops! Page Not Found</h2>
                <p className="text-slate-400 max-w-md">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <div className="pt-8">
                    <Link to="/dashboard">
                        <Button variant="primary" className="px-8 py-3 rounded-full font-bold shadow-lg shadow-indigo-500/20">
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default NotFound;
