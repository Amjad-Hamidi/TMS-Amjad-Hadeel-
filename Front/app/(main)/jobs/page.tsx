'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
    Briefcase, Loader2, CheckCircle2, UserCheck, UserX, AlertCircle,
    Inbox, ListChecks, Clock, Users, Power, PowerOff, Mail, University
} from 'lucide-react';

interface BaseJob {
    _id: { toString: () => string; } | string;
    title: string;
    postedDate: string | Date;
    isActive: boolean;
    acceptedApplicants?: BaseUser[] | { _id: { toString: () => string } | string }[]; 
    applicationCount?: number;
    company?: any;
}
interface BaseUser {
     _id: { toString: () => string; } | string;
     username: string;
     email?: string;
     university?: string;
     specialization?: string;
     phone?: string;
}
interface PopulatedJobWithAcceptedArray extends Omit<BaseJob, 'acceptedApplicants'> {
    _id: string;
    applicants: BaseUser[];
    acceptedApplicants: BaseUser[]; 
    isActive: boolean;
    description?: string;
    requirements?: string[];
    location?: string;
    type?: string;
    experience?: string;
}

const ApplicantListItem = ({ applicant, selectedJobDetails, handleAcceptApplicant, handleRejectApplicant, acceptingApplicantId, rejectingApplicantId }) => {
    const applicantIdStr = applicant._id.toString();
    const isAcceptedHere = selectedJobDetails.acceptedApplicants?.some(acc => acc._id.toString() === applicantIdStr);
    const isJobActive = selectedJobDetails.isActive;

    const isProcessingAccept = acceptingApplicantId === applicantIdStr;
    const isProcessingReject = rejectingApplicantId === applicantIdStr;
    const acceptDisabled = !isJobActive || isProcessingAccept || isProcessingReject;
    const rejectDisabled = isProcessingAccept || isProcessingReject;

    return (
        <li className={`p-4 rounded-lg border dark:border-gray-700 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${isAcceptedHere ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700' : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-600'}`}>
            <div className="flex-grow space-y-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">{applicant.username}</p>
                {applicant.email && <a href={`mailto:${applicant.email}`} className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 w-fit"><Mail size={12}/> {applicant.email}</a>}
                {applicant.university && <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><University size={12}/> {applicant.university}{applicant.specialization ? ` - ${applicant.specialization}` : ''}</p>}
                {applicant.phone && <p className="text-xs text-gray-500 dark:text-gray-400">{applicant.phone}</p>}
                {applicant.role && <p className="text-xs text-gray-500 dark:text-gray-400">Role: {applicant.role}</p>}

            </div>
            <div className="flex items-center gap-2 mt-2 md:mt-0 flex-shrink-0 self-end md:self-center">
                {isAcceptedHere ? (
                    <span className="inline-flex items-center px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30 rounded-full">
                        <CheckCircle2 className="w-4 h-4 mr-1"/> Accepted
                    </span>
                ) : ( 
                    <>
                        <button onClick={() => handleRejectApplicant(selectedJobDetails._id.toString(), applicantIdStr)} disabled={rejectDisabled} className={`p-2 rounded-md text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${isProcessingReject ? 'animate-pulse' : ''}`} title="Reject Applicant">
                            {isProcessingReject ? <Loader2 className="w-4 h-4 animate-spin"/> : <UserX className="w-4 h-4"/>}
                        </button>
                        <button onClick={() => handleAcceptApplicant(selectedJobDetails._id.toString(), applicantIdStr)} disabled={acceptDisabled} className={`p-2 rounded-md text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all ${isProcessingAccept ? 'animate-pulse' : ''}`} title={isJobActive ? "Accept Applicant" : "Cannot accept for inactive job"}>
                            {isProcessingAccept ? <Loader2 className="w-4 h-4 animate-spin"/> : <UserCheck className="w-4 h-4"/>}
                        </button>
                    </>
                )}
            </div>
        </li>
    );
};


function MyJobsPage() {
  const { state: authState } = useAuth();
  const currentUser = authState.user;

  const [myJobs, setMyJobs] = useState<BaseJob[]>([]);
  const [selectedJobDetails, setSelectedJobDetails] = useState<PopulatedJobWithAcceptedArray | null>(null);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [acceptingApplicantId, setAcceptingApplicantId] = useState<string | null>(null);
  const [acceptError, setAcceptError] = useState<string | null>(null);
  const [rejectingApplicantId, setRejectingApplicantId] = useState<string | null>(null);
  const [rejectError, setRejectError] = useState<string | null>(null);
  const [togglingJobId, setTogglingJobId] = useState<string | null>(null);
  const [acceptSuccess, setAcceptSuccess] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyJobs = async () => {
        if (currentUser?.role !== 'company') { setIsLoadingJobs(false); setMyJobs([]); return; }
        setIsLoadingJobs(true); setPageError(null);
        const token = localStorage.getItem('token');
        if (!token) { setPageError("Not authenticated"); setIsLoadingJobs(false); return; }
        try {
            const res = await fetch('/api/jobs/my-jobs', { headers: { Authorization: `Bearer ${token}` } });
            if (!res.ok) { let e = `Failed jobs (${res.status})`; try { const d = await res.json(); e = d.message || e; } catch {} throw new Error(e); }
            const data = await res.json();
            setMyJobs(Array.isArray(data.jobs) ? data.jobs : []);
        } catch (err: any) { console.error("Err fetchMyJobs:", err); setPageError(err.message || "Error fetching jobs."); setMyJobs([]); }
        finally { setIsLoadingJobs(false); }
        };
        fetchMyJobs();
    }, [currentUser]);

    const fetchJobDetails = async (jobId: string) => {
        console.log(`Fetching details for job: ${jobId}`);
        setIsLoadingDetails(true); setSelectedJobDetails(null); setAcceptError(null); setRejectError(null); setPageError(null); setAcceptSuccess(null);
        const token = localStorage.getItem('token');
        if (!token) { setPageError("Not authenticated"); setIsLoadingDetails(false); return; }
        try {
        const res = await fetch(`/api/jobs/${jobId}?populate=applicants,acceptedApplicants,company`, { headers: { Authorization: `Bearer ${token}` } });
        console.log(`Fetch details status for ${jobId}:`, res.status);
        if (!res.ok) { let e = `Failed details (${res.status})`; try { const d = await res.json(); e = d.message || e; } catch {} throw new Error(e); }
        const data = await res.json();
        if (data.job && typeof data.job === 'object') {
            data.job.acceptedApplicants = Array.isArray(data.job.acceptedApplicants) ? data.job.acceptedApplicants : [];
            setSelectedJobDetails(data.job);
        } else { throw new Error("Invalid job data."); }
        } catch (err: any) { setPageError(err.message || "Could not load details."); console.error("Err fetchJobDetails:", err); }
        finally { setIsLoadingDetails(false); }
    };

    const handleAcceptApplicant = async (jobId: string, applicantId: string) => {
        setAcceptingApplicantId(applicantId); setAcceptError(null); setRejectError(null); setAcceptSuccess(null);
        const token = localStorage.getItem('token');
        if (!token) { setAcceptError("Auth needed."); setAcceptingApplicantId(null); return; }
        try {
            const res = await fetch(`/api/jobs/${jobId}/applicants/${applicantId}/accept`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' } });
            const data = await res.json();
            if (!res.ok) { throw new Error(data.message || 'Failed accept.'); }
            setAcceptSuccess(data.message || 'Applicant accepted!');
            fetchJobDetails(jobId); // Refetch
            setTimeout(() => setAcceptSuccess(null), 4000);
        } catch (err: any) { console.error("Err accepting:", err); setAcceptError(err.message || "Accept error."); }
        finally { setAcceptingApplicantId(null); }
    };
    

   const handleRejectApplicant = async (jobId: string, applicantId: string) => {
    setRejectingApplicantId(applicantId); setRejectError(null); setAcceptError(null); setAcceptSuccess(null);
    const token = localStorage.getItem('token');
    if (!token) { setRejectError("Auth needed."); setRejectingApplicantId(null); return; }
    try {
        const res = await fetch(`/api/jobs/${jobId}/applicants/${applicantId}`, { 
            method: 'DELETE', 
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
            let errorMsg = `Failed reject (${res.status})`;
            try{ const d = await res.json(); errorMsg = d?.message || errorMsg; } catch{}
            throw new Error(errorMsg);
        }
        console.log("Rejection successful, refetching details...");
        fetchJobDetails(jobId); 
    } catch (err: any) { console.error("Err rejecting:", err); setRejectError(err.message || "Reject error."); }
    finally { setRejectingApplicantId(null); }
};

    const handleToggleJobStatus = async (jobId: string, currentStatus: boolean) => {
            setTogglingJobId(jobId); setPageError(null);
            const token = localStorage.getItem('token');
            if (!token) { setPageError("Auth needed."); setTogglingJobId(null); return; }
            try {
                const res = await fetch(`/api/jobs/${jobId}/status`, { method: 'PUT', headers: { Authorization: `Bearer ${token}` } });
                const data = await res.json();
                if (!res.ok) { throw new Error(data.message || 'Failed toggle.'); }
                setMyJobs(prev => prev.map(j => j._id.toString() === jobId ? { ...j, isActive: !currentStatus } : j));
                if (selectedJobDetails?._id.toString() === jobId) {
                    setSelectedJobDetails(prev => prev ? { ...prev, isActive: !currentStatus } : null);
                }
            } catch (err: any) { console.error("Err toggling:", err); setPageError(err.message || "Could not toggle."); }
            finally { setTogglingJobId(null); }
        };


  if (isLoadingJobs) return (
      <div className="flex justify-center items-center h-screen ">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600 dark:text-indigo-400" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">Loading your jobs...</span>
      </div>
  );
  if (!currentUser || currentUser.role !== 'company') return (
      <div className="p-8 text-center min-h-screen  ">
          <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Access Denied</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">This page is only accessible to company accounts.</p>
      </div>
  );
   if (pageError && myJobs.length === 0) return (
       <div className="p-8 text-center min-h-screen  ">
            <AlertCircle className="w-12 h-12 mx-auto text-red-500 mb-4" />
            <h2 className="text-xl font-semibold text-red-600 dark:text-red-400">Error Loading Jobs</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">{pageError}</p>
       </div>
   );

   return (

    <div className=" dark:text-gray-300 min-h-screen">
        <div className="mb-8 pb-4 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <Briefcase className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            Manage Job Postings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Review jobs, manage applicants, and control job status.</p>
        </div>

        {pageError && <div role="alert" className="mb-4 p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-md text-sm flex items-center gap-2"><AlertCircle size={16}/> {pageError}</div>}

        {myJobs.length === 0 && !isLoadingJobs && !pageError && (
           <div className="text-center py-16 px-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50">
              <Inbox className="w-12 h-12 mx-auto text-gray-400 dark:text-gray-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Jobs Posted Yet</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Post a new job opportunity.</p>
           </div>
       )}

        {myJobs.length > 0 && (
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="lg:w-1/3 xl:w-1/4 flex-shrink-0">
              <h2 className="text-lg font-semibold mb-3 text-gray-700 dark:text-gray-300">Your Jobs ({myJobs.length})</h2>
              <div className="space-y-3 max-h-[75vh] overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-2 bg-white dark:bg-gray-800/50 shadow-sm [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-gray-400/50 dark:[&::-webkit-scrollbar-thumb]:bg-gray-600/50 [&::-webkit-scrollbar-thumb]:rounded-full">
                {myJobs.map((job) => {
                    const jobIdStr = job._id.toString();
                    const isSelected = selectedJobDetails?._id.toString() === jobIdStr;
                    const isProcessingToggle = togglingJobId === jobIdStr;
                    const acceptedCount = (job as any).acceptedApplicants?.length || 0;

                    return (
                      <div key={jobIdStr} className={`relative p-4 rounded-md border-l-4 transition-all duration-150 shadow-sm ${ isSelected ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 ring-1 ring-indigo-500 dark:ring-indigo-700' : 'border-transparent bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700'}`}>
                         <button onClick={(e) => { e.stopPropagation(); handleToggleJobStatus(jobIdStr, job.isActive); }} disabled={isProcessingToggle} className={`absolute top-2 right-2 p-1 rounded-full text-xs ${job.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900' : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900'} disabled:opacity-50`} title={job.isActive ? "Close Job" : "Re-open Job"}>
                              {isProcessingToggle ? <Loader2 size={14} className="animate-spin" /> : job.isActive ? <PowerOff size={14} /> : <Power size={14} />}
                          </button>

                         <button onClick={() => fetchJobDetails(jobIdStr)} disabled={isLoadingDetails || isProcessingToggle} className={`w-full text-left focus:outline-none pr-8 ${isLoadingDetails ? 'cursor-wait' : 'cursor-pointer'}`}>
                              <h3 className={`font-semibold truncate ${isSelected ? 'text-indigo-800 dark:text-indigo-200' : 'text-gray-800 dark:text-gray-100'}`}>{job.title}</h3>
                              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-1"><Clock size={12}/> Posted: {job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <span className={`mr-1 inline-block w-2 h-2 rounded-full ${job.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                  Status: {job.isActive ? 'Active' : 'Inactive'}
                              </p>
                              {acceptedCount > 0 && <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1"><UserCheck size={12}/> Accepted: {acceptedCount}</p>}
                              <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><Users size={12}/> Applicants: {job.applicationCount ?? 0}</p>
                         </button>
                      </div>
                    );
                 })}
              </div>
            </div>

            <div className="flex-grow lg:w-2/3 xl:w-3/4 min-w-0">
              {isLoadingDetails && (
                  <div className="flex justify-center items-center h-64 p-6 text-gray-500 dark:text-gray-400 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                      <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading details...
                  </div>
              )}
              {!isLoadingDetails && !selectedJobDetails && !pageError && (
                  <div className="flex flex-col justify-center items-center h-64 p-6 text-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 shadow-sm">
                      <ListChecks className="w-10 h-10 text-gray-400 dark:text-gray-500 mb-3" />
                      <p>Select a job from the list</p>
                      <p className="text-sm">to view its details and manage applicants.</p>
                  </div>
              )}
              {!isLoadingDetails && !selectedJobDetails && pageError && (
                   <div className="flex flex-col justify-center items-center h-64 p-6 text-center text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700 rounded-lg bg-red-50 dark:bg-red-900/20 shadow-sm">
                       <AlertCircle className="w-10 h-10 mb-3"/>
                       <p className="font-semibold">Could not load job details</p>
                       <p className="text-sm mt-1">{pageError}</p>
                   </div>
               )}

              {selectedJobDetails && !isLoadingDetails && (
                <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
                   <div className="pb-4 mb-4 border-b border-gray-200 dark:border-gray-700 flex flex-wrap justify-between items-start gap-2">
                      <div>
                        <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">{selectedJobDetails.title}</h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 dark:text-gray-400">
                          <span>Status: <span className={`font-medium ${selectedJobDetails.isActive ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-500'}`}>{selectedJobDetails.isActive ? 'Active' : 'Inactive'}</span></span>
                           {selectedJobDetails.acceptedApplicants && selectedJobDetails.acceptedApplicants.length > 0 && (
                              <span className="font-semibold text-green-600 dark:text-green-400 flex items-center gap-1">
                                   <UserCheck size={14}/> Accepted ({selectedJobDetails.acceptedApplicants.length})
                               </span>
                           )}
                        </div>
                      </div>

                       <button onClick={() => handleToggleJobStatus(selectedJobDetails._id.toString(), selectedJobDetails.isActive)} disabled={togglingJobId === selectedJobDetails._id.toString()} className={`flex items-center px-3 py-1.5 rounded-md text-xs font-medium self-start ${selectedJobDetails.isActive ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/50 dark:text-red-300 dark:hover:bg-red-900' : 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/50 dark:text-green-300 dark:hover:bg-green-900'} disabled:opacity-50`}>
                            {togglingJobId === selectedJobDetails._id.toString() ? <Loader2 size={14} className="animate-spin mr-1" /> : selectedJobDetails.isActive ? <PowerOff size={14} className="mr-1"/> : <Power size={14} className="mr-1"/>}
                            {selectedJobDetails.isActive ? "Close Job" : "Re-open Job"}
                        </button>
                   </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-gray-800  flex items-center gap-2"><Users size={20}/> Applicants ({selectedJobDetails.applicants?.length || 0})</h3>
                    {acceptSuccess && <div role="status" className="mb-3 p-3 text-sm text-green-800 bg-green-100 dark:text-green-300 dark:bg-green-900/30 rounded border border-green-200 dark:border-green-800 flex items-center gap-2"><CheckCircle2 size={16}/> {acceptSuccess}</div>}
                    {acceptError && <div role="alert" className="mb-3 p-3 text-sm text-red-800 bg-red-100 dark:text-red-300 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800 flex items-center gap-2"><AlertCircle size={16}/> {acceptError}</div>}
                    {rejectError && <div role="alert" className="mb-3 p-3 text-sm text-red-800 bg-red-100 dark:text-red-300 dark:bg-red-900/30 rounded border border-red-200 dark:border-red-800 flex items-center gap-2"><AlertCircle size={16}/> {rejectError}</div>}

                    {selectedJobDetails.applicants && selectedJobDetails.applicants.length > 0 ? (
                      <ul className="space-y-4">
                        {selectedJobDetails.applicants.map((applicant) => (
                          <ApplicantListItem
                              key={applicant._id.toString()}
                              applicant={applicant}
                              selectedJobDetails={selectedJobDetails}
                              handleAcceptApplicant={handleAcceptApplicant}
                              handleRejectApplicant={handleRejectApplicant}
                              acceptingApplicantId={acceptingApplicantId}
                              rejectingApplicantId={rejectingApplicantId}
                          />
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-sm italic mt-4 text-center py-6 border border-dashed border-gray-200 dark:border-gray-600 rounded-md">No applicants yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
    </div>
  );
}

export default MyJobsPage;