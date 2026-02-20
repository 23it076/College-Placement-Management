import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[grid-slate-900/[0.04]] bg-[bottom_left_-4rem] dark:bg-grid-slate-400/[0.05]">
            <Card className="max-w-md w-full">
                <div className="text-center mb-10">
                    <h2 className="gradient-text text-3xl font-bold mb-2">Welcome Back</h2>
                    <p className="text-slate-400">Enter your credentials to access the portal</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Input
                        label="Email Address"
                        placeholder="student@college.edu"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                            <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-indigo-600" />
                            Remember me
                        </label>
                        <a href="#" className="text-indigo-400 hover:text-indigo-300">Forgot password?</a>
                    </div>

                    <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                        {loading ? 'Signing In...' : 'Sign In'}
                    </Button>

                    <p className="text-center text-slate-500 text-sm mt-8">
                        Dont have an account? <Link to="/register" className="text-indigo-400 font-semibold hover:underline">Register now</Link>
                    </p>
                </form>
            </Card>
        </div>
    );
};

export default Login;
