import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Button from '../components/Button';
import { Mail, GraduationCap, Code, FileText, Loader2, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';

const StudentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await api.get(`/students/${id}`);
                setStudent(response.data);
            } catch (error) {
                console.error('Error fetching student details:', error);
                setError(error?.response?.data?.message || 'Failed to load student details.');
            } finally {
                setLoading(false);
            }
        };

        fetchStudentDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950">
                <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 pt-24 text-slate-100 flex flex-col items-center justify-center p-8">
                <Navbar />
                <div className="text-red-400 mb-4">{error}</div>
                <Button onClick={() => navigate('/manage-students')}>Go Back</Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 pt-24 text-slate-100">
            <Navbar />
            <div className="p-8 max-w-4xl mx-auto space-y-8">
                <header className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/manage-students')}
                        className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">Student Profile</h1>
                        <p className="text-slate-400 mt-1">Detailed view of the student's records.</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="md:col-span-1 p-8 text-center flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-4xl font-bold border-4 border-indigo-500/30 mb-6">
                            {student?.name?.charAt(0) || 'U'}
                        </div>
                        <h2 className="text-xl font-bold">{student?.name}</h2>
                        <p className="text-slate-400 text-sm mt-1 capitalize">{student?.role}</p>

                        <div className="w-full mt-8 space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5 text-sm">
                                <Mail size={16} className="text-indigo-400" />
                                <span className="truncate">{student?.email}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="md:col-span-2 p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="text-indigo-400">Personal Details</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Name</p>
                                    <p className="text-slate-200">{student?.name}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Email</p>
                                    <p className="text-slate-200">{student?.email}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <GraduationCap size={20} className="text-indigo-400" />
                                Academic Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Department</p>
                                    <p className="text-slate-200">{student?.department}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">CGPA</p>
                                    <span className="px-2 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-sm font-bold border border-indigo-500/20">
                                        {student?.cgpa}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Code size={20} className="text-indigo-400" />
                                Technical Skills
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {(Array.isArray(student?.skills) ? student.skills : []).map((skill) => (
                                    <span key={skill} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm border border-indigo-500/20">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <FileText size={20} className="text-indigo-400" />
                                Resume
                            </h3>
                            <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-red-500/10 text-red-400">
                                        <FileText size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {student?.resume ? 'Resume link available' : 'No resume uploaded'}
                                        </p>
                                    </div>
                                </div>
                                {student?.resume ? (
                                    <a
                                        className="text-indigo-400 text-sm font-bold hover:underline"
                                        href={student.resume}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        View Resume
                                    </a>
                                ) : null}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default StudentDetails;
