import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';
import { Building2, Plus, Search, MapPin, Briefcase, Trash2, Edit, Loader2, X } from 'lucide-react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const ManageCompanies = () => {
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCompany, setEditingCompany] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        role: '',
        ctc: '',
        description: '',
        deadline: ''
    });

    const fetchCompanies = async () => {
        try {
            const response = await api.get('/companies');
            setCompanies(response.data);
        } catch (error) {
            console.error('Error fetching companies:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompanies();
    }, []);

    const handleApply = async (companyId) => {
        try {
            await api.post(`/applications/apply/${companyId}`);
            alert('Application submitted successfully!');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to apply');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this company?')) return;
        try {
            await api.delete(`/companies/${id}`);
            fetchCompanies();
        } catch (error) {
            alert('Failed to delete company');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const dataToSubmit = {
                ...formData,
                eligibility: {
                    cgpa: 0,
                    skills: [],
                    branches: []
                }
            };
            if (editingCompany) {
                // If it already had eligibility, preserve it but we just overwrite defaults for now since UI doesn't have it
                await api.put(`/companies/${editingCompany._id}`, dataToSubmit);
            } else {
                await api.post('/companies', dataToSubmit);
            }
            setIsModalOpen(false);
            setEditingCompany(null);
            setFormData({ name: '', location: '', role: '', ctc: '', description: '', deadline: '' });
            fetchCompanies();
        } catch (error) {
            alert('Failed to save company: ' + (error.response?.data?.message || error.message));
        }
    };

    const openEditModal = (company) => {
        setEditingCompany(company);
        setFormData({
            name: company.name,
            location: company.location,
            role: company.role,
            ctc: company.ctc,
            description: company.description,
            deadline: company.deadline ? company.deadline.split('T')[0] : ''
        });
        setIsModalOpen(true);
    };

    const filteredCompanies = companies.filter(c =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.role.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold gradient-text">
                            {user?.role === 'admin' ? 'Manage Companies' : 'Explore Companies'}
                        </h1>
                        <p className="text-slate-400 mt-1">
                            {user?.role === 'admin' ? 'Add or update information for recruiting partners.' : 'Find your dream job among top recruiting partners.'}
                        </p>
                    </div>
                    {user?.role === 'admin' && (
                        <Button variant="primary" className="flex items-center gap-2" onClick={() => { setEditingCompany(null); setFormData({ name: '', location: '', role: '', ctc: '', description: '', deadline: '' }); setIsModalOpen(true); }}>
                            <Plus size={18} />
                            Add New Company
                        </Button>
                    )}
                </header>

                <Card className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                        <input
                            type="text"
                            placeholder="Search companies by name or role..."
                            className="w-full bg-slate-800/50 border border-white/10 rounded-xl py-3 pl-11 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCompanies.map((company) => (
                        <Card key={company._id} className="p-6 hover:border-indigo-500/30 transition-all group">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xl group-hover:scale-110 transition-transform">
                                        {company.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{company.name}</h3>
                                        <p className="text-indigo-400 font-medium text-sm">{company.role}</p>
                                        <div className="flex items-center gap-2 text-sm text-slate-400 mt-1">
                                            <MapPin size={14} />
                                            {company.location}
                                        </div>
                                    </div>
                                </div>
                                {user?.role === 'admin' && (
                                    <div className="flex gap-2">
                                        <button onClick={() => openEditModal(company)} className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(company._id)} className="p-2 rounded-lg bg-red-500/5 text-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition-all">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                <div className="flex gap-4">
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                        <Briefcase size={14} className="text-indigo-400" />
                                        ₹{company.ctc} LPA
                                    </div>
                                    {company.deadline && (
                                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                            Deadline: {new Date(company.deadline).toLocaleDateString()}
                                        </div>
                                    )}
                                </div>
                                {user?.role === 'student' ? (
                                    <Button variant="primary" className="text-xs py-1.5 px-4 h-auto" onClick={() => handleApply(company._id)}>Apply Now</Button>
                                ) : (
                                    <Button variant="outline" className="text-xs py-1.5 px-4 h-auto">View Stats</Button>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Company Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <Card className="w-full max-w-lg p-8 relative">
                            <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white">
                                <X size={20} />
                            </button>
                            <h2 className="text-2xl font-bold mb-6">{editingCompany ? 'Edit Company' : 'Add New Company'}</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <Input label="Company Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                                <Input label="Role" value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} required />
                                <Input label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
                                <Input label="CTC (LPA)" type="number" value={formData.ctc} onChange={(e) => setFormData({ ...formData, ctc: e.target.value })} required />
                                <Input label="Application Deadline" type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} required />
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-400">Description</label>
                                    <textarea
                                        className="w-full bg-slate-800/50 border border-white/10 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-white min-h-[100px]"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <Button type="submit" variant="primary" className="w-full mt-4">
                                    {editingCompany ? 'Update Company' : 'Create Company'}
                                </Button>
                            </form>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageCompanies;

