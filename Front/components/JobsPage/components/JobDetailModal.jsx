import { useRef, useEffect, useState } from 'react';
import styles from '../styles/JobsPage.module.css';

const JobDetailModal = ({
  job,
  isOpen,
  onClose,
  theme,
  currentUser, 
  onApply,    
  isApplying,  
  applySuccess,
  applyError  
}) => {
  const modalRef = useRef(null);

  const hasApplied = currentUser?.appliedJobs?.some(
      appliedJobId => appliedJobId.toString() === job?._id?.toString()
  );
  const canApply = currentUser && (currentUser.role === 'trainee' || currentUser.role === 'supervisor');

  useEffect(() => {
    const handleEscapeKey = (e) => { if (e.key === 'Escape') onClose(); };
    const handleClickOutside = (e) => { if (modalRef.current && !modalRef.current.contains(e.target)) onClose(); };
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  const backdropClass = theme === 'dark' ? 'bg-black/70' : 'bg-black/50';
  const modalClass = theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800';
  const sectionClass = theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50';

  const formatDate = (dateString) => {
      if (!dateString) return 'N/A';
      try {
          return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      } catch {
          return 'Invalid Date';
      }
  }

  return (
    <div className={`${styles.modalBackdrop} fixed inset-0 z-50 flex items-center justify-center ${backdropClass}`}>
      <div
        ref={modalRef}
        className={`${styles.modalContent} ${modalClass} w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl`}
      >
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-start justify-between">
             <div className="flex items-center">
               <div className="w-16 h-16 rounded-lg overflow-hidden border dark:border-gray-700 mr-4 flex-shrink-0">
                 <img src={job.logo || '/default-logo.png'} alt={`${job.company} logo`} className="w-full h-full object-cover" />
               </div>
               <div>
                 <h2 className="text-xl font-bold">{job.title}</h2>
                 <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{job.company}</p>
                 <div className="flex items-center flex-wrap gap-2 mt-2"> 
                   {job.type && <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ theme === 'dark' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-800' }`}>{job.type}</span>}
                   {job.experience && <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800' }`}>{job.experience}</span>}
                 </div>
               </div>
             </div>
             <button onClick={onClose} className={`p-2 rounded-full ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`} aria-label="Close">
               <ion-icon name="close-outline" class="text-2xl"></ion-icon>
             </button>
          </div>
        </div>

        <div className="p-6">

           <div className={`${sectionClass} p-4 rounded-lg mb-6`}>
             <h3 className="text-lg font-semibold mb-3">Overview</h3>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <div className="flex items-center">
                 <ion-icon name="location-outline" class={`text-xl mr-2 ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}></ion-icon>
                 <div><p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Location</p><p>{job.location}</p></div>
               </div>
               <div className="flex items-center">
                 <ion-icon name="cash-outline" class={`text-xl mr-2 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}></ion-icon>
                 <div><p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Salary</p><p>{job.salary}</p></div>
               </div>
               <div className="flex items-center">
                 <ion-icon name="time-outline" class={`text-xl mr-2 ${theme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}></ion-icon>
                 <div><p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Apply By</p><p>{formatDate(job.deadline)}</p></div>
               </div>
               <div className="flex items-center">
                 <ion-icon name="calendar-outline" class={`text-xl mr-2 ${theme === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}></ion-icon>
                 <div><p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Start Date</p><p>{job.startDate}</p></div>
               </div>
             </div>
           </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Description</h3>
            <p className="whitespace-pre-line">{job.description}</p>
            {job.extendedDescription && <p className="whitespace-pre-line mt-4">{job.extendedDescription}</p>}
          </div>

          {job.requirements && job.requirements.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {job.requirements.map((req, index) => (<li key={index}>{req}</li>))}
                </ul>
              </div>
          )}

           {job.responsibilities && job.responsibilities.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Responsibilities</h3>
                <ul className="list-disc pl-5 space-y-2">
                  {job.responsibilities.map((resp, index) => (<li key={index}>{resp}</li>))}
                </ul>
              </div>
          )}

          {job.benefits && job.benefits.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Benefits</h3>
              <ul className="list-disc pl-5 space-y-2">
                {job.benefits.map((benefit, index) => (<li key={index}>{benefit}</li>))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Posted: </span>
                {formatDate(job.postedDate)}
              </p>
              <p className="text-sm">
                <span className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}>Applications: </span>
                {job.applications || '0+'} candidates
              </p>
            </div>

            {canApply && (
              <div className={`${styles.applyButtonWrapper} flex items-center`}>
                <button
                  onClick={onApply}
                  disabled={isApplying || hasApplied}
                  className={`${styles.applyButton} px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isApplying ? 'Applying...' : hasApplied ? 'Applied' : 'Apply Now'}
                  {!hasApplied && !isApplying && <ion-icon name="arrow-forward-outline" class="ml-2"></ion-icon>}
                  {hasApplied && <ion-icon name="checkmark-circle-outline" class="ml-2 text-green-400"></ion-icon>}
                </button>
                <button className={`${styles.saveButton} ml-3 p-3 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'} rounded-lg transition-colors duration-300`} title="Save Job">
                  <ion-icon name="bookmark-outline"></ion-icon>
                </button>
              </div>
            )}
             {!currentUser && <p className="text-sm text-yellow-600 dark:text-yellow-400">Please log in to apply.</p>}
             {currentUser && !canApply && <p className="text-sm text-yellow-600 dark:text-yellow-400">Only trainees or supervisors can apply.</p>}

          </div>
           {applySuccess && <p className="mt-3 text-sm text-center text-green-600 dark:text-green-400">{applySuccess}</p>}
           {applyError && <p className="mt-3 text-sm text-center text-red-600 dark:text-red-400">{applyError}</p>}
        </div>

      </div>
    </div>
  );
};

export default JobDetailModal;