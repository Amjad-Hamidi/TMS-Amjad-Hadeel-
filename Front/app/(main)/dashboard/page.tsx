'use client';

import React, { useState, useEffect, ReactElement } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import {
    LayoutDashboard, User, Briefcase, Users, CheckCircle2, FileText, UserCheck,
    UserCog, Building, Settings, Loader2, AlertCircle, BarChart3, ListChecks, PlusCircle ,Activity,
    BookMarked,
    ClipboardList ,
    UserCheck as TraineeIcon
} from 'lucide-react'; 
import TitleOfSection from '@/components/TitleOfSection';
import ApexChart from '@/components/chart';
import ReactStars from 'react-stars';
import Table from '@/components/Table';

interface DashboardData {
    stats?: {
        // Company
        totalJobs?: number;
        activeJobs?: number;
        totalApplicants?: number;
        totalAccepted?: number;
        assignedTrainees?: number;
        assignedSupervisors?: number;
        // Trainee
        appliedJobs?: number;
        acceptedOffers?: number; 
        ongoingCourses?: number;
        pendingAssignments?: number;
        // Supervisor
        supervisedJobsCount?: number; 
        totalSupervisedTrainees?: number; 
        directlyAssignedTrainees?: number; 
        pendingEvaluations?: number;
        activeSupervisedJobsCount?: number; 
        // Admin
        totalUsers?: number;
        totalCompanies?: number;
        totalSupervisors?: number;
        totalTrainees?: number;
        totalActiveJobs?: number; 
    };
    recentJobs?: { _id: string; title: string; applicantsCount: number; isActive: boolean }[]; 
    recentApplications?: { _id: string; jobTitle: string; companyName: string; status: string }[]; 
    assignedTrainees?: { _id: string; username: string; email?: string }[]; 
    traineeAssignments?: any[]; 
    traineeCertifications?: any[]; 
    supervisedTraineeList?: { _id: string; username: string; email?: string; activeJob?: string }[]; 
    weeklyApplicationsChart?: number[]; 
    supervisorTraineeChart?: number[]; 
    recentAcceptedTrainees?: { 
        _id: string; 
        username: string;
        jobTitle: string; 
        acceptedDate: Date | string; 
        jobId: string;
    }[];
}

const sampleRecentUsers =  [
    { _id: '1a', username: 'New Company Inc.', email: 'contact@company.com', role: 'company', createdAt: new Date(Date.now() - 86400000) }, 
    { _id: '2b', username: 'John Doe', email: 'john.t@example.com', role: 'trainee', createdAt: new Date(Date.now() - 172800000) }, 
    { _id: '3c', username: 'Jane Smith', email: 'jane.s@example.com', role: 'supervisor', createdAt: new Date(Date.now() - 259200000) },
];


interface IStatCard{
  icon:ReactElement
   title:string 
   value:number|undefined
    href:string|undefined
 isLoading:boolean
}
const StatCard = ({ icon, title, value, href, isLoading }:IStatCard) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="flex justify-between items-start mb-3">
            <span className="text-indigo-600 dark:text-indigo-400 bg-indigo-100 dark:bg-indigo-900/30 p-2 rounded-lg">
                {React.cloneElement(icon, { size: 20 })}
            </span>
            {href && (
                <Link href={href} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                    View All
                </Link>
            )}
        </div>
        {isLoading ? (
            <div className="h-8 w-1/2 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ) : (
            <h3 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{value ?? '-'}</h3>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{title}</p>
    </div>
);

function DashboardPage() {
    const { state: authState } = useAuth();
    const currentUser = authState.user;
    const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!currentUser) { setIsLoading(false); return; }

        const fetchDashboardData = async () => {
            setIsLoading(true); setError(null);
            const token = localStorage.getItem('token');
            if (!token) { setError("Not authenticated"); setIsLoading(false); return; }

            try {
                const res = await fetch('/api/dashboard', { headers: { Authorization: `Bearer ${token}` } });
                if (!res.ok) { let e = `Failed fetch (${res.status})`; try { const d = await res.json(); e = d.message || e; } catch {} throw new Error(e); }
                const data: DashboardData = await res.json();
                setDashboardData(data);
            } catch (err: any) { console.error("Err fetchDashboardData:", err); setError(err.message || "Error loading data."); setDashboardData(null); }
            finally { setIsLoading(false); }
        };

        fetchDashboardData();
    }, [currentUser]);

    const renderContent = () => {
      if (!currentUser) return <div className="text-center p-10 text-gray-500 dark:text-gray-400">Please log in to view your dashboard.</div>;

      const role = currentUser.role;
      const stats = dashboardData?.stats || {};
      const weeklyChartData = dashboardData?.weeklyApplicationsChart || [5, 12, 8, 15, 10, 18, 14]; 
      const sampleAssignments = [
          { nameAssignments: 'Create Authentication Pages', supervisor: 'Hadeel W.', startDate: '2024-01-10', endDate: '2024-01-20', status: 'completed' },
          { nameAssignments: 'Implement User Profile', supervisor: 'Ahmed K.', startDate: '2024-01-22', endDate: '2024-02-05', status: 'pending' },
           { nameAssignments: 'Database Schema Design', supervisor: 'Sara M.', startDate: '2024-02-01', endDate: '2024-02-15', status: 'pending' },
      ];
      const sampleCertifications = [
           { role: 'ReactJs Advanced', supervisor: 'Coursera', graduationDate: '2023-11-15', rate: 5 },
           { role: 'Node.js Backend', supervisor: 'Udemy', graduationDate: '2024-01-05', rate: 4 },
      ];
        return (
            <>
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Welcome back, {currentUser.username}!</h1>
                    <p className="text-gray-600 dark:text-gray-400">Here's your {role} dashboard overview.</p>
                </div>
                 {error && !isLoading && <div role="alert" className="mb-6 p-4 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-md text-sm flex items-center gap-2"><AlertCircle size={16}/> {error}</div>}


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                    {role === 'company' && (
                        <>
                            <StatCard icon={<Users />} title="Total Applicants" value={stats.totalApplicants} isLoading={isLoading} href={undefined}/>
                             <StatCard icon={<UserCheck />} title="Accepted" value={stats.totalAccepted} isLoading={isLoading} href={undefined}/>
                             <StatCard icon={<Users />} title="Assigned Trainees" value={stats.assignedTrainees} href="/dashboard/manage-staff" isLoading={isLoading}/>
                             <StatCard icon={<UserCog />} title="Assigned Supervisors" value={stats.assignedSupervisors} href="/dashboard/manage-staff" isLoading={isLoading}/>
                        </>
                    )}
                     {role === 'trainee' && (
                        <>
                            <StatCard icon={<FileText />} title="Applied Jobs" value={stats.appliedJobs} href="/dashboard/applications" isLoading={isLoading}/>
                            <StatCard icon={<CheckCircle2 />} title="Accepted Offers" value={stats.acceptedOffers} isLoading={isLoading} href={''}/>
                            <StatCard icon={<Activity />} title="Active Accepted Jobs" value={stats.acceptedOffers} href="/dashboard/training" isLoading={isLoading}/>
                        </>
                    )}
                    {role === 'supervisor' && (
                        <>
                            <StatCard icon={<Briefcase />} title="Supervised Jobs" value={stats.supervisedJobsCount} href="/dashboard/training" isLoading={isLoading}/>
                            <StatCard icon={<Activity />} title="Active Supervised Jobs" value={stats.activeSupervisedJobsCount} href="/dashboard/training?status=active" isLoading={isLoading}/> 
                            <StatCard icon={<UserCheck />} title="Trainees in Jobs" value={stats.totalSupervisedTrainees} href="/dashboard/training" isLoading={isLoading}/>
                            <StatCard icon={<Users />} title="Applicants to Supervised Jobs" value={stats.totalApplicantsToJobs} href="/dashboard/training" isLoading={isLoading}/>
                        </>
                    )}
                     {role === 'admin' && (
                        <>
                            <StatCard icon={<Users />} title="Total Users" value={stats.totalUsers} href="/admin/users" isLoading={isLoading}/>
                            <StatCard icon={<Building />} title="Companies" value={stats.totalCompanies} href="/admin/users?role=company" isLoading={isLoading}/>
                            <StatCard icon={<UserCog />} title="Supervisors" value={stats.totalSupervisors} href="/admin/users?role=supervisor" isLoading={isLoading}/>
                            <StatCard icon={<Users />} title="Trainees" value={stats.totalTrainees} href="/admin/users?role=trainee" isLoading={isLoading}/>
                        </>
                    )}
                </div>

                {role === 'admin' && !isLoading && (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                          <div className="lg:col-span-2 p-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
                              <TitleOfSection title={'System Activity Overview'} icon={<BarChart3 />}/>
                              <div className='mt-4 h-80'>
                                 {weeklyChartData ? (
                                     <ApexChart data={weeklyChartData} />
                                  ) : (
                                     <p className="text-center text-gray-400 italic mt-10">Chart data not available.</p>
                                  )}
                              </div>
                          </div>

                           <div className="p-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
                              <TitleOfSection title="Recently Joined Users" icon={<Users />} />
                              {sampleRecentUsers && sampleRecentUsers.length > 0 ? ( 
                                 <ul className="mt-4 space-y-3 max-h-80 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400/50 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-thumb]:rounded-full pr-2">
                                     {sampleRecentUsers.map(user => (
                                         <li key={user._id} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-b-0">
                                             <div>
                                                 <span className="text-gray-800 dark:text-gray-200 font-medium truncate">{user.username}</span>
                                                 <span className="block text-xs text-gray-500 dark:text-gray-400">{user.email}</span>
                                             </div>
                                             <span className={`text-xs px-2 py-0.5 rounded-full capitalize
                                                ${user.role === 'company' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300' :
                                                 user.role === 'supervisor' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300' :
                                                 user.role === 'trainee' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                                                 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300'}`}>
                                                 {user.role}
                                             </span>
                                         </li>
                                     ))}
                                 </ul>
                              ) : (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">No recent users.</p>
                              )}
                               <Link href="/admin/users" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-4 block">Manage All Users</Link>
                           </div>
                      </div>
                 )}

                {role === 'company' && !isLoading && dashboardData?.recentJobs && (
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                         <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                             <TitleOfSection title="Recent Job Postings" icon={<Briefcase size={20} />} />
                             {dashboardData.recentJobs.length > 0 ? (
                                <ul className="mt-4 space-y-3">
                                    {dashboardData.recentJobs.slice(0, 5).map(job => ( 
                                        <li key={job._id} className="flex justify-between items-center text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-b-0">
                                            <Link href={`/dashboard/my-jobs?jobId=${job._id}`} className="text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium truncate pr-2">{job.title}</Link>
                                             <span className={`text-xs px-2 py-0.5 rounded-full ${job.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300'}`}>
                                                 {job.isActive ? 'Active' : 'Inactive'} ({job.applicantsCount ?? 0} apps)
                                             </span>
                                         </li>
                                     ))}
                                 </ul>
                             ) : (
                                 <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">No recent job postings.</p>
                             )}
                              <Link href="/dashboard/my-jobs" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-4 block">View All Jobs</Link>
                         </div>
                          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                              <TitleOfSection title="Quick Actions" icon={<PlusCircle size={20} />}/>
                              <div className="mt-4 space-y-3">
                                  <Link href="/dashboard/post-job" className="block text-center py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">Post a New Job</Link>
                                  <Link href="/dashboard/manage-staff" className="block text-center py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium">Manage Staff</Link>
                               </div>
                           </div>
                      </div>
                 )}

                    {role === 'supervisor' && !isLoading && (
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                          <div className="lg:col-span-2 p-6  dark:text-indigo-400 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
                              <TitleOfSection title={'Weekly Trainee Activity'} icon={<BarChart3 />}/>
                              <div className='mt-4 h-80'>
                                 {dashboardData?.supervisorTraineeChart ? (
                                     <ApexChart data={dashboardData.supervisorTraineeChart} />
                                  ) : (
                                     <p className="text-center text-gray-400 italic mt-10">Chart data not available.</p>
                                  )}
                              </div>
                          </div>
                           <div className="p-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
                              <TitleOfSection title="Recently Accepted Trainees" icon={<TraineeIcon />} />
                              {dashboardData?.recentAcceptedTrainees && dashboardData.recentAcceptedTrainees.length > 0 ? (
                                 <ul className="mt-4 space-y-3 max-h-80 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400/50 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-thumb]:rounded-full pr-2">
                                     {dashboardData.recentAcceptedTrainees.map(trainee => (
                                         <li key={`${trainee._id}-${trainee.jobId}`} className="flex flex-col text-sm border-b border-gray-100 dark:border-gray-700 pb-2 last:border-b-0">
                                             <span className="text-gray-800 dark:text-gray-200 font-medium truncate">{trainee.username}</span>
                                             <span className="text-xs text-gray-500 dark:text-gray-400">Accepted for: {trainee.jobTitle}</span>
                                              <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(trainee.acceptedDate).toLocaleDateString()}</span>
                                              <span  className="text-xs text-indigo-500 hover:underline cursor-pointer">Details</span>
                                         </li>
                                     ))}
                                 </ul>
                              ) : (
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">No trainees accepted recently in your supervised jobs.</p>
                              )}
                               <Link href="/dashboard/training" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline mt-4 block">View All Supervised Jobs</Link>
                           </div>
                      </div>
                 )}

                   {role === 'trainee' && !isLoading && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="lg:col-span-2 p-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
                           <TitleOfSection title='Courses & Certifications' icon={<BookMarked />}/>
                            <div className='mt-4'>
                                <h4 className='text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300'>Certifications</h4>
                                {sampleCertifications.length > 0 ? (
                                    <Table
                                        isDisplayCheckbox={false}
                                        columns={['Certification', 'Provider', 'Date', 'Rating']}
                                        bodydatatable={sampleCertifications.map(cert => ({
                                            Certification: cert.role,
                                            Provider: cert.supervisor, 
                                            Date: cert.graduationDate,
                                            Rating: <ReactStars count={5} value={cert.rate} size={16} color2={'#ffd700'} edit={false} /> 
                                        }))}
                                    />
                                ) : <p className='text-xs text-gray-500 italic'>No certifications yet.</p>}

                                <h4 className='text-sm font-semibold mb-2 mt-6 text-gray-700 dark:text-gray-300'>Ongoing Courses</h4>
                                <p className='text-xs text-gray-500 italic'>Course list coming soon.</p>
                             </div>
                        </div>

                        <div className="p-6 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
                            <TitleOfSection title={'Assignments'} icon={<ClipboardList />} />
                             <div className="mt-4 max-h-80 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400/50 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                                {sampleAssignments.length > 0 ? (
                                    <Table
                                        isDisplayCheckbox={false}
                                        columns={['Assignment', 'Due Date', 'Status']}
                                        bodydatatable={sampleAssignments.map(data => ({
                                        Assignment:<div className='flex items-center gap-2'><img src={`https://ui-avatars.com/api/?name=${data.nameAssignments.split(' ')[0]}&background=random&size=32`} className='rounded-full w-6 h-6'/>{data.nameAssignments}</div>,
                                        'Due Date': data.endDate,
                                        Status: <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                                                data.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' :
                                                data.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300' :
                                                'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300' 
                                            }`}>{data.status}</span>
                                        }))}
                                    />
                                ) : <p className='text-xs text-gray-500 italic'>No assignments yet.</p>}
                            </div>
                        </div>
                    </div>
                )}

                {role === 'company' && !isLoading && (
                     <div className=" mb-6">
                          <div className="lg:col-span-2 p-6 dark:text-indigo-400 bg-white dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700/50 shadow-sm">
                              <TitleOfSection title={'Weekly Applications'} icon={<BarChart3 />}/>
                              <div className='mt-4 h-80 w-full'> 
                                 <ApexChart data={weeklyChartData} />
                              </div>
                          </div>
                      </div>
                )}

            </>
        );
    };



    return (
        <div className="w-full transition-all">
            <div className="p-4 sm:p-6">
                {isLoading && !dashboardData ? ( 
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
                    </div>
                 ) : (
                    renderContent()
                 )}
            </div>
        </div>
    );
}

export default DashboardPage;