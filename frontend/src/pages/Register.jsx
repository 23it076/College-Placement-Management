import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        department: '',
        cgpa: '',
        skills: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            const signupData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                department: formData.department,
                cgpa: parseFloat(formData.cgpa),
                skills: formData.skills.split(',').map(s => s.trim()).filter(s => s !== ''),
                role: 'student'
            };

            const data = await authService.register(signupData);
            // If the backend returns a token, we can log them in directly
            if (data && data.token) {
                localStorage.setItem('user', JSON.stringify(data));
                window.location.reload(); // Refresh to update AuthContext state
            } else {
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
            <Card className="max-w-2xl w-full">
                <div className="text-center mb-10">
                    <h2 className="gradient-text text-3xl font-bold mb-2">Create Account</h2>
                    <p className="text-slate-400">Join the placement portal to explore opportunities</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input
                        label="Full Name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <Input
                        label="Email Address"
                        placeholder="john@college.edu"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <Input
                        label="Department"
                        placeholder="Computer Science"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    />
                    <Input
                        label="CGPA"
                        placeholder="8.5"
                        type="number"
                        value={formData.cgpa}
                        onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                    />
                    <div className="md:col-span-2">
                        <Input
                            label="Skills (Comma separated)"
                            placeholder="React, Node.js, Python"
                            value={formData.skills}
                            onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                        />
                    </div>
                    <Input
                        label="Password"
                        placeholder="••••••••"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                    <Input
                        label="Confirm Password"
                        placeholder="••••••••"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    />

                    <div className="md:col-span-2 mt-4">
                        <Button type="submit" variant="primary" className="w-full" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Register'}
                        </Button>
                        <p className="text-center text-slate-500 text-sm mt-6">
                            Already have an account? <Link to="/login" className="text-indigo-400 font-semibold hover:underline">Sign In</Link>
                        </p>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default Register;
