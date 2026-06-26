import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, BrainCircuit, LineChart, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const AiFeatures = () => {
    const [activeTab, setActiveTab] = useState('resume');
    const [resumeText, setResumeText] = useState('');
    const [resumeResult, setResumeResult] = useState(null);
    const [predictionResult, setPredictionResult] = useState(null);
    const [recommendations, setRecommendations] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleResumeAnalyze = async () => {
        if (!resumeText) return toast.error('Please enter resume text');
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/ai/resume-analyzer`,
                { text: resumeText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResumeResult(res.data);
            toast.success('Resume analyzed successfully');
        } catch (error) {
            toast.error('Failed to analyze resume');
        } finally {
            setLoading(false);
        }
    };

    const handlePredictPlacement = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/ai/placement-prediction`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPredictionResult(res.data);
            toast.success('Prediction generated successfully');
        } catch (error) {
            toast.error('Failed to predict placement');
        } finally {
            setLoading(false);
        }
    };

    const handleGetRecommendations = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/ai/job-recommendations`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setRecommendations(res.data.recommendations || []);
            toast.success('Recommendations fetched successfully');
        } catch (error) {
            toast.error('Failed to fetch recommendations');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                    <BrainCircuit className="w-8 h-8 text-indigo-500" />
                    AI Power Tools
                </h1>
            </div>

            {/* Tabs */}
            <div className="flex gap-4 border-b border-slate-800 pb-2 overflow-x-auto hide-scrollbar">
                <button
                    onClick={() => setActiveTab('resume')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'resume'
                            ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <Upload className="w-4 h-4" />
                    Resume Analyzer
                </button>
                <button
                    onClick={() => setActiveTab('predict')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'predict'
                            ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <LineChart className="w-4 h-4" />
                    Placement Prediction
                </button>
                <button
                    onClick={() => setActiveTab('jobs')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                        activeTab === 'jobs'
                            ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                >
                    <Briefcase className="w-4 h-4" />
                    Job Recommendations
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
                
                {/* Resume Analyzer */}
                {activeTab === 'resume' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Smart Resume Analyzer</h2>
                        <p className="text-slate-400 text-sm">Paste your resume text below to extract skills and get a score.</p>
                        <textarea 
                            value={resumeText}
                            onChange={(e) => setResumeText(e.target.value)}
                            className="w-full h-40 bg-slate-800 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Paste resume content here..."
                        />
                        <button 
                            onClick={handleResumeAnalyze}
                            disabled={loading}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                        >
                            {loading ? 'Analyzing...' : 'Analyze Resume'}
                        </button>
                        
                        {resumeResult && (
                            <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700">
                                <h3 className="text-lg font-semibold text-white mb-4">Analysis Result</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-slate-400 mb-1">Resume Score</p>
                                        <div className="text-3xl font-bold text-emerald-400">{resumeResult.resume_score}/100</div>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 mb-1">Estimated Experience</p>
                                        <div className="text-xl text-white">{resumeResult.experience}</div>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 mb-2">Detected Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {resumeResult.skills.map((s, i) => (
                                                <span key={i} className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-slate-400 mb-2">Missing Key Skills</p>
                                        <div className="flex flex-wrap gap-2">
                                            {resumeResult.missing_skills.map((s, i) => (
                                                <span key={i} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                                                    {s}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Placement Prediction */}
                {activeTab === 'predict' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">Placement Probability Prediction</h2>
                        <p className="text-slate-400 text-sm">Our AI model analyzes your profile (CGPA, skills, projects) to predict your chances.</p>
                        
                        <button 
                            onClick={handlePredictPlacement}
                            disabled={loading}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                        >
                            {loading ? 'Predicting...' : 'Run Prediction Model'}
                        </button>
                        
                        {predictionResult && (
                            <div className="mt-8 p-6 bg-slate-800/50 rounded-xl border border-slate-700 flex flex-col md:flex-row gap-8 items-center justify-around">
                                <div className="text-center">
                                    <p className="text-slate-400 mb-2">Probability of Placement</p>
                                    <div className="relative w-32 h-32 flex items-center justify-center">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-700" />
                                            <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="8" fill="transparent"
                                                strokeDasharray={2 * Math.PI * 60}
                                                strokeDashoffset={2 * Math.PI * 60 * (1 - predictionResult.placement_probability / 100)}
                                                className={predictionResult.placement_probability > 70 ? "text-emerald-500" : predictionResult.placement_probability > 40 ? "text-yellow-500" : "text-red-500"}
                                            />
                                        </svg>
                                        <div className="absolute text-3xl font-bold text-white">{predictionResult.placement_probability}%</div>
                                    </div>
                                </div>
                                <div className="space-y-4 flex-1">
                                    <div className="bg-slate-800 p-4 rounded-lg">
                                        <p className="text-sm text-slate-400">CGPA Impact</p>
                                        <p className="font-semibold text-white">{predictionResult.factors?.cgpa_impact}</p>
                                    </div>
                                    <div className="bg-slate-800 p-4 rounded-lg">
                                        <p className="text-sm text-slate-400">Skills Impact</p>
                                        <p className="font-semibold text-white">{predictionResult.factors?.skills_impact}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* Job Recommendations */}
                {activeTab === 'jobs' && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                        <h2 className="text-xl font-semibold text-white">AI Job Recommendations</h2>
                        <p className="text-slate-400 text-sm">Get personalized job suggestions based on your unique skill set and academics.</p>
                        
                        <button 
                            onClick={handleGetRecommendations}
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-xl font-medium transition-colors"
                        >
                            {loading ? 'Finding Matches...' : 'Find Best Matches'}
                        </button>
                        
                        {recommendations && (
                            <div className="mt-8 space-y-4">
                                {recommendations.length > 0 ? recommendations.map((job, idx) => (
                                    <div key={idx} className="bg-slate-800 p-5 rounded-xl border border-slate-700 flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{job.role}</h3>
                                            <p className="text-slate-400">{job.company}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-slate-400 mb-1">Match Score</p>
                                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 font-bold rounded-full">
                                                {job.match_score}%
                                            </span>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-slate-400">No strong matches found. Try updating your skills profile.</p>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default AiFeatures;
