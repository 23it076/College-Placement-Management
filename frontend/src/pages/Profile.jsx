import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import api from '../services/api';
import { Mail, GraduationCap, Code, FileText, Loader2 } from 'lucide-react';
import Navbar from '../components/Navbar';

const Profile = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        cgpa: '',
        skills: '',
        resume: '',
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setError('');
                const response = await api.get('/students/profile');
                setProfile(response.data);
                setFormData({
                    name: response.data?.name ?? '',
                    email: response.data?.email ?? '',
                    department: response.data?.department ?? '',
                    cgpa: response.data?.cgpa !== undefined && response.data?.cgpa !== null ? String(response.data.cgpa) : '',
                    skills: Array.isArray(response.data?.skills) ? response.data.skills.join(', ') : (response.data?.skills ?? ''),
                    resume: response.data?.resume ?? '',
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
                setError(error?.response?.data?.message || 'Failed to load profile. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');
            const updatedData = {
                ...formData,
                cgpa: formData.cgpa === '' ? undefined : parseFloat(formData.cgpa),
                skills: formData.skills
                    .split(',')
                    .map((s) => s.trim())
                    .filter((s) => s !== ''),
            };
            const response = await api.put('/students/profile', updatedData);
            setProfile(response.data);
            setFormData({
                name: response.data?.name ?? '',
                email: response.data?.email ?? '',
                department: response.data?.department ?? '',
                cgpa: response.data?.cgpa !== undefined && response.data?.cgpa !== null ? String(response.data.cgpa) : '',
                skills: Array.isArray(response.data?.skills) ? response.data.skills.join(', ') : (response.data?.skills ?? ''),
                resume: response.data?.resume ?? '',
            });
            setIsEditing(false);
        } catch (error) {
            console.error('Update Profile Error:', error);
            const message = error?.response?.data?.message || 'Failed to update profile. Please try again.';
            const stack = error?.response?.data?.stack;
            setError(stack ? `${message} (Server Error: ${stack.split('\n')[0]})` : message);
        } finally {
            setSaving(false);
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
            <div className="p-8 max-w-4xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">My Profile</h1>
                        <p className="text-slate-400 mt-1">Manage your personal and academic information.</p>
                    </div>
                    <Button
                        variant={isEditing ? 'primary' : 'outline'}
                        onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Edit Profile'}
                    </Button>
                </header>

                {error ? (
                    <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
                        {error}
                    </div>
                ) : null}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="md:col-span-1 p-8 text-center flex flex-col items-center">
                        <div className="w-32 h-32 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center text-4xl font-bold border-4 border-indigo-500/30 mb-6">
                            {profile?.name?.charAt(0) || 'U'}
                        </div>
                        <h2 className="text-xl font-bold">{profile?.name}</h2>
                        <p className="text-slate-400 text-sm mt-1 capitalize">{profile?.role}</p>

                        <div className="w-full mt-8 space-y-3">
                            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 border border-white/5 text-sm">
                                <Mail size={16} className="text-indigo-400" />
                                <span className="truncate">{profile?.email}</span>
                            </div>
                        </div>
                    </Card>

                    <Card className="md:col-span-2 p-8 space-y-8">
                        <div>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <span className="text-indigo-400">Personal Details</span>
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Input
                                    label="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    disabled={!isEditing}
                                />
                                <Input
                                    label="Email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <GraduationCap size={20} className="text-indigo-400" />
                                Academic Details
                            </h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Input
                                    label="Department"
                                    value={formData.department}
                                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                    disabled={!isEditing}
                                />
                                <Input
                                    label="CGPA"
                                    type="number"
                                    value={formData.cgpa}
                                    onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <Code size={20} className="text-indigo-400" />
                                Technical Skills
                            </h3>
                            {isEditing ? (
                                <Input
                                    label="Skills (Comma separated)"
                                    value={formData.skills}
                                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                                />
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {(Array.isArray(profile?.skills) ? profile.skills : []).map((skill) => (
                                        <span key={skill} className="px-3 py-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 text-sm border border-indigo-500/20">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="pt-8 border-t border-white/5">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                                <FileText size={20} className="text-indigo-400" />
                                Resume & AI Parsing
                            </h3>
                            {isEditing ? (
                                <div className="space-y-4">
                                    <label className="block text-sm font-medium text-slate-400">Upload PDF Resume</label>
                                    <input
                                        type="file"
                                        accept="application/pdf"
                                        onChange={async (e) => {
                                            const file = e.target.files[0];
                                            if (!file) return;

                                            const uploadData = new FormData();
                                            uploadData.append('resume', file);

                                            try {
                                                setSaving(true);
                                                const res = await api.put('/students/resume', uploadData, {
                                                    headers: { 'Content-Type': 'multipart/form-data' }
                                                });
                                                setProfile(res.data.student);
                                                setFormData(prev => ({
                                                    ...prev,
                                                    resume: res.data.student.resume,
                                                    skills: res.data.student.skills.join(', ')
                                                }));
                                                alert(`AI Parser Analysis: ${res.data.aiAnalysis.notes}\nDetected Skills: ${res.data.aiAnalysis.detectedSkills.join(', ')}`);
                                            } catch (err) {
                                                alert('Failed to upload resume: ' + (err.response?.data?.message || err.message));
                                            } finally {
                                                setSaving(false);
                                            }
                                        }}
                                        className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:font-semibold file:bg-indigo-500/10 file:text-indigo-400 hover:file:bg-indigo-500/20"
                                    />
                                    <p className="text-xs text-slate-500">Upon upload, our Mock AI will automatically parse your resume for skills.</p>
                                </div>
                            ) : (
                                <div className="p-4 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${profile?.resume ? 'bg-indigo-500/10 text-indigo-400' : 'bg-red-500/10 text-red-400'}`}>
                                            <FileText size={20} />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">
                                                {profile?.resume ? 'Resume stored securely' : 'No resume uploaded'}
                                            </p>
                                            <p className="text-[10px] text-slate-500 uppercase">
                                                {profile?.resume ? 'Available for HR Review' : 'Edit profile to upload PDF'}
                                            </p>
                                        </div>
                                    </div>
                                    {profile?.resume ? (
                                        <a
                                            className="text-indigo-400 text-sm font-bold hover:underline"
                                            href={`http://localhost:5000${profile.resume}`}
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            View PDF
                                        </a>
                                    ) : null}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Profile;

