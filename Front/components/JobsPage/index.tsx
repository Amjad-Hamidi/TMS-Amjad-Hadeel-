"use client";

import { useState, useEffect, useMemo } from 'react';
import { useTheme } from '@/context/ThemeContext'; 
import { useAuth } from '@/context/AuthContext';  
import type { IUser } from '@/models/User';        
import type { IJob as JobModelInterface } from '@/models/Job';

import JobBanner from '@/components/JobsPage/components/JobBanner';
import JobSearch from '@/components/JobsPage/components/JobSearch';
import JobFilter from '@/components/JobsPage/components/JobFilter';
import JobCard from '@/components/JobsPage/components/JobCard';
import JobDetailModal from '@/components/JobsPage/components/JobDetailModal';

import { filterJobs } from './utils/jobFilters'; 
import styles from './styles/JobsPage.module.css'; 

interface PopulatedJob extends Omit<JobModelInterface, 'company' | 'applicants' | 'supervisor'> {
  _id: string;
  company: {
    _id: string;
    username: string;
    googlePhotoUrl?: string;
    email?: string;
  };
  featured?: boolean;
  type?: string;
  experience?: string;
  salary?: string;
  deadline?: string; 
  postedDate: Date | string; 
  startDate?: string;
  responsibilities?: string[];
  benefits?: string[];
  extendedDescription?: string;
  applicationCount?: number;
  location?: string;
  requirements?: string[];
  category?: string; 
}


export default function JobsPage() { 
  const { theme } = useTheme ? useTheme() : { theme: 'light' }; 
  const { state: authState } = useAuth(); 
  const currentUser = authState.user;

  const [jobs, setJobs] = useState<PopulatedJob[]>([]); 
  const [filteredJobs, setFilteredJobs] = useState<PopulatedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); 
  const [selectedJob, setSelectedJob] = useState<PopulatedJob | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    location: '',
    type: '',
    experience: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 6;

  const [isApplying, setIsApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState<string | null>(null);
  const [applyError, setApplyError] = useState<string | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      setError(null); 
      try {
        const response = await fetch('/api/jobs'); 
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to fetch jobs: ${response.statusText}`);
        }
        const data = await response.json();
        setJobs((data.jobs as PopulatedJob[]) || []);
        setFilteredJobs((data.jobs as PopulatedJob[]) || []); 
      } catch (error: any) {
        console.error('Error fetching jobs:', error);
        setError(error.message || 'Could not load jobs.'); 
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []); 

  useEffect(() => {
    setFilteredJobs(filterJobs(jobs, filters));
    setCurrentPage(1); 
  }, [jobs, filters]);

  const handleSearch = (search: string) => {
    setFilters(prev => ({ ...prev, search }));
  };
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const handleJobClick = (job: PopulatedJob) => {
    setSelectedJob(job);
    setShowModal(true);
    setApplyError(null);
    setApplySuccess(null);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleApply = async (jobId: string) => {
    if (!currentUser) { setApplyError("You must be logged in."); return; }
    if (currentUser.role !== 'trainee' && currentUser.role !== 'supervisor') { setApplyError("Only trainees or supervisors can apply."); return; }

    const alreadyAppliedLocally = currentUser.appliedJobs?.some(id => id.toString() === jobId);
    if (alreadyAppliedLocally) {
        setApplySuccess("You have already applied for this job."); 
        return;
    }


    setIsApplying(true);
    setApplyError(null);
    setApplySuccess(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error("Auth token not found.");

      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Apply failed.');

      setApplySuccess(data.message || 'Applied successfully!');

       if (currentUser && currentUser.appliedJobs) {
           const updatedUser: IUser = {
               ...currentUser,
               appliedJobs: [...currentUser.appliedJobs, jobId as any], 
           };
       }


    } catch (err: any) {
      setApplyError(err.message || 'Could not apply.');
    } finally {
      setIsApplying(false);
    }
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const bgClass = theme === 'dark' ? 'bg-[rgb(16,23,42)]' : 'bg-gray-50';
  const textClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const containerClass = theme === 'dark' ? 'bg-[rgb(22,30,50)]' : 'bg-white';

  const preparedJobs = useMemo(() => currentJobs.map(job => prepareJobForComponent(job)), [currentJobs]);
  const preparedSelectedJob = useMemo(() => selectedJob ? prepareJobForComponent(selectedJob) : null, [selectedJob]);

  function prepareJobForComponent(job: PopulatedJob | null) {
      if (!job) return null;
       const jobType = job.type || job.category || 'General';

      return {
          ...job,
          id: job._id?.toString(), 
          _id: job._id?.toString(),
          company: job.company?.username || 'Unknown Company',
          logo: job.company?.googlePhotoUrl || '/default-logo.png',
          postedDate: job.postedDate, 
          deadline: job.deadline,
          requirements: job.requirements || [],
          responsibilities: job.responsibilities || [],
          benefits: job.benefits || [],
          applications: job.applicationCount ? `${job.applicationCount}+` : '0+',
          experience: job.experience || 'N/A',
          salary: job.salary || 'Not specified',
          location: job.location || 'Not specified',
          type: jobType, 
          category: jobType, 
          startDate: job.startDate || 'Not specified',
      };
  }

  const categories = useMemo(() => [...new Set(jobs.map(job => job.type || job.category || 'General').filter(Boolean))], [jobs]);
  const locations = useMemo(() => [...new Set(jobs.map(job => job.location).filter(Boolean))], [jobs]);
  const jobTypes = useMemo(() => [...new Set(jobs.map(job => job.type).filter(Boolean))], [jobs]);
  const experienceLevels = useMemo(() => [...new Set(jobs.map(job => job.experience).filter(Boolean))], [jobs]);
  // ---

  return (
    <div className={`${bgClass} min-h-screen transition-colors duration-300`}>

      <JobBanner /> 

      <div className="container mx-auto px-4 py-12">
        <div className={`${containerClass} rounded-xl p-6 shadow-lg transition-all duration-300`}>

          <div className="mb-8">
            <JobSearch onSearch={handleSearch} theme={theme} />
            <div className="mt-6">
              <JobFilter
                categories={categories}
                locations={locations}
                jobTypes={jobTypes} 
                experienceLevels={experienceLevels}
                filters={filters}
                onFilterChange={handleFilterChange}
                theme={theme}
              />
            </div>
          </div>

          <div className="mb-8">
             <h2 className={`text-2xl font-bold mb-6 ${textClass}`}>
               {isLoading ? 'Loading opportunities...' : filteredJobs.length === 0 ? 'No opportunities found' : `Showing ${filteredJobs.length} opportunities`}
             </h2>

             {isLoading ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[...Array(jobsPerPage)].map((_, i) => (
                   <div key={i} className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-6 animate-pulse h-64`}>
                     <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-3/4 mb-4 rounded`}></div>
                     <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-3 w-1/2 mb-3 rounded`}></div>
                   </div>
                 ))}
               </div>
             ) : filteredJobs.length === 0 ? (
                 <div className={`${styles.emptyState} text-center py-12`}>
                    <ion-icon name="search-outline" class={`text-6xl ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`}></ion-icon>
                    <p className={`mt-4 text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>No jobs match your search criteria.</p>
                    <button onClick={() => setFilters({ search: '', category: '', location: '', type: '', experience: '' })} className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">Clear Filters</button>
                 </div>
             ) : (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {preparedJobs.map(job => job && (
                   <JobCard
                     key={job.id || job._id} 
                     job={job}
                     onClick={() => handleJobClick(jobs.find(j => j._id === job._id)!)} 
                     theme={theme}
                   />
                 ))}
               </div>
             )}
          </div>

          {filteredJobs.length > jobsPerPage && !isLoading && (
             <div className="flex justify-center mt-8"> 
               <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                 <button onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} disabled={currentPage === 1} className={`relative inline-flex items-center px-2 py-2 rounded-l-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'} text-sm font-medium ${currentPage === 1 ? 'text-gray-500 dark:text-gray-600' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} disabled:opacity-50`}>
                   <span className="sr-only">Previous</span>
                   <ion-icon name="chevron-back-outline" class="h-5 w-5"></ion-icon>
                 </button>
                 {[...Array(totalPages)].map((_, i) => (
                   <button key={i} onClick={() => handlePageChange(i + 1)} aria-current={currentPage === i + 1 ? 'page' : undefined} className={`relative inline-flex items-center px-4 py-2 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'} text-sm font-medium ${currentPage === i + 1 ? `z-10 bg-indigo-600 border-indigo-500 text-white` : `${theme === 'dark' ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' : 'bg-white text-gray-500 hover:bg-gray-50'}`}`}>
                     {i + 1}
                   </button>
                 ))}
                 <button onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className={`relative inline-flex items-center px-2 py-2 rounded-r-md border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-300 bg-white'} text-sm font-medium ${currentPage === totalPages ? 'text-gray-500 dark:text-gray-600' : 'text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'} disabled:opacity-50`}>
                   <span className="sr-only">Next</span>
                   <ion-icon name="chevron-forward-outline" class="h-5 w-5"></ion-icon>
                 </button>
               </nav>
             </div>
           )}

        </div>
      </div>

      {preparedSelectedJob && (
        <JobDetailModal
          job={preparedSelectedJob} 
          isOpen={showModal}
          onClose={handleCloseModal}
          theme={theme}
          currentUser={currentUser}
          onApply={() => handleApply(preparedSelectedJob._id)} 
          isApplying={isApplying}
          applySuccess={applySuccess}
          applyError={applyError}
        />
      )}
    </div>
  );
}
