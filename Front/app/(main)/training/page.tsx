'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Loader2, AlertCircle, Briefcase, User, Users, Mail, Phone, University, Building, Info } from 'lucide-react';

interface CompanyInfo { _id: string; username: string; googlePhotoUrl?: string; }
interface SupervisorInfo { _id: string; username: string; email?: string; phone?: string; }
interface TraineeInfo { _id: string; username: string; email?: string; phone?: string; university?: string; specialization?: string; }

interface AcceptedJobForTrainee {
    _id: string;
    title: string;
    company?: CompanyInfo;
    supervisor?: SupervisorInfo;
    location?: string;
    type?: string;
    postedDate: string | Date;
}

interface SupervisedJob {
    _id: string;
    title: string;
    company?: CompanyInfo;
    acceptedTrainees: TraineeInfo[];
    location?: string;
    type?: string;
    isActive: boolean;
    postedDate: string | Date;
}

function TrainingPage() {
    const { state: authState } = useAuth();
    const currentUser = authState.user;
    const [acceptedJobsAsTrainee, setAcceptedJobsAsTrainee] = useState<AcceptedJobForTrainee[]>([]);
    const [supervisedJobs, setSupervisedJobs] = useState<SupervisedJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser || (currentUser.role !== 'trainee' && currentUser.role !== 'supervisor')) {
            setIsLoading(false);
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            const token = localStorage.getItem('token');
            if (!token) { setError("Not authenticated"); setIsLoading(false); return; }

            try {
                const res = await fetch('/api/training/summary', { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) { let e = `Failed fetch (${res.status})`; try { const d = await res.json(); e = d.message || e; } catch {} throw new Error(e); }
                const data = await res.json();

                if (currentUser.role === 'trainee') {
                    setAcceptedJobsAsTrainee(Array.isArray(data.acceptedJobsAsTrainee) ? data.acceptedJobsAsTrainee : []);
                } else if (currentUser.role === 'supervisor') {
                    setSupervisedJobs(Array.isArray(data.supervisedJobs) ? data.supervisedJobs : []);
                }

            } catch (err: any) {
                console.error("Error fetching training data:", err);
                setError(err.message || "Could not load data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentUser]);


    if (isLoading) return (
        <div className="flex justify-center items-center h-screen ">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading Training Data...</span>
        </div>
    );

    if (!currentUser || (currentUser.role !== 'trainee' && currentUser.role !== 'supervisor')) {
         return (
            <div className="p-8 text-center min-h-screen  dark:text-gray-200">
                <Info className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">No Training Data</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">This section is for Trainees and Supervisors.</p>
            </div>
         );
    }

    if (error) return (
         <div className="p-8 text-center min-h-screen  dark:text-gray-200">
              <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
              <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Error Loading Data</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{error}</p>
         </div>
     );

    if (currentUser.role === 'trainee') {
        return (
            <div className="p-4 sm:p-6 md:p-8  min-h-screen">
                <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        <Briefcase className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
                        My Accepted Jobs & Supervisors
                    </h1>
                </div>

                {acceptedJobsAsTrainee.length === 0 ? (
                     <p className="text-gray-500 dark:text-gray-400 italic">You haven't been accepted into any jobs yet.</p>
                ) : (
                    <div className="space-y-6">
                        {acceptedJobsAsTrainee.map(job => (
                            <div key={job._id} className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-3">
                                     <div>
                                         <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300">{job.title}</h2>
                                         {job.company && (
                                             <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                                                 <Building size={14}/> At {job.company.username}
                                             </p>
                                         )}
                                         {job.location && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{job.location}</p>}
                                     </div>
                                     {job.type && <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full self-start sm:self-center">{job.type}</span>}
                                </div>

                                {job.supervisor ? (
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">Your Supervisor:</h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <User size={16} />
                                            <span>{job.supervisor.username}</span>
                                            {job.supervisor.email && <a href={`mailto:${job.supervisor.email}`} className="text-indigo-600 hover:underline flex items-center gap-1"><Mail size={14}/> Email</a>}
                                            {job.supervisor.phone && <span className="flex items-center gap-1"><Phone size={14}/> {job.supervisor.phone}</span>}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-500 dark:text-gray-500 italic">No supervisor assigned yet.</p>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (currentUser.role === 'supervisor') {
        return (
            <div className="p-4 sm:p-6 md:p-8  min-h-screen">
                <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
                        <Users className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                        My Supervised Jobs & Trainees
                    </h1>
                </div>

                 {supervisedJobs.length === 0 ? (
                     <p className="text-gray-500 dark:text-gray-400 italic">You are not supervising any active jobs currently.</p>
                ) : (
                    <div className="space-y-8">
                        {supervisedJobs.map(job => (
                             <div key={job._id} className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2 mb-4 pb-4 border-b dark:border-gray-700">
                                     <div>
                                         <h2 className="text-xl font-semibold text-teal-700 dark:text-teal-300">{job.title}</h2>
                                         {job.company && (
                                             <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                                                 <Building size={14}/> At {job.company.username}
                                             </p>
                                         )}
                                         {job.location && <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{job.location}</p>}
                                     </div>
                                      <span className={`text-xs px-2 py-0.5 rounded-full self-start sm:self-center ${job.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-700  dark:bg-red-900/50 dark:text-red-300 '}`}>
                                          {job.isActive ? 'Active' : 'Inactive'}
                                      </span>
                                 </div>

                                 <div>
                                     <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-3">Accepted Trainees ({job.acceptedTrainees?.length || 0}):</h3>
                                     {job.acceptedTrainees && job.acceptedTrainees.length > 0 ? (
                                         <ul className="space-y-3">
                                             {job.acceptedTrainees.map(trainee => (
                                                  <li key={trainee._id.toString()} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 rounded bg-gray-50 dark:bg-gray-700/50 gap-2 border border-gray-200 dark:border-gray-600">
                                                       <div className="flex-grow space-y-0.5 min-w-0">
                                                           <p className="font-medium text-gray-900 dark:text-gray-100 truncate">{trainee.username}</p>
                                                            {trainee.email && <a href={`mailto:${trainee.email}`} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 w-fit"><Mail size={12}/> {trainee.email}</a>}
                                                             {trainee.university && <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><University size={12}/> {trainee.university}</p>}
                                                      </div>
                                                      <button className="text-xs text-blue-600 hover:underline mt-1 sm:mt-0">View Details</button>
                                                  </li>
                                             ))}
                                         </ul>
                                     ) : (
                                         <p className="text-sm text-gray-500 dark:text-gray-500 italic">No trainees accepted for this job yet.</p>
                                     )}
                                 </div>
                             </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // حالة غير متوقعة (إذا لم يكن أي دور من الأدوار المحددة)
    return <div className="p-8">Unexpected user role.</div>;
}

export default TrainingPage;