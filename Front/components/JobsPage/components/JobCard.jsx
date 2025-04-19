import { useState } from 'react';
import styles from '../styles/JobsPage.module.css';

const JobCard = ({ job, onClick, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  const textSecondaryClass = theme === 'dark' ? 'text-gray-400' : 'text-gray-500';
  
  // Format date to relative time
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };
  
  // Badge color based on job type
  const getBadgeColor = (type) => {
    const colors = {
      'Full-time': isHovered 
        ? 'bg-green-600 text-white' 
        : theme === 'dark' 
          ? 'bg-green-900/50 text-green-400' 
          : 'bg-green-100 text-green-800',
      'Part-time': isHovered 
        ? 'bg-blue-600 text-white' 
        : theme === 'dark' 
          ? 'bg-blue-900/50 text-blue-400' 
          : 'bg-blue-100 text-blue-800',
      'Contract': isHovered 
        ? 'bg-orange-600 text-white' 
        : theme === 'dark' 
          ? 'bg-orange-900/50 text-orange-400' 
          : 'bg-orange-100 text-orange-800',
      'Internship': isHovered 
        ? 'bg-purple-600 text-white' 
        : theme === 'dark' 
          ? 'bg-purple-900/50 text-purple-400' 
          : 'bg-purple-100 text-purple-800',
      'Remote': isHovered 
        ? 'bg-indigo-600 text-white' 
        : theme === 'dark' 
          ? 'bg-indigo-900/50 text-indigo-400' 
          : 'bg-indigo-100 text-indigo-800',
    };
    
    return colors[type] || (isHovered 
      ? 'bg-gray-600 text-white' 
      : theme === 'dark' 
        ? 'bg-gray-700 text-gray-300' 
        : 'bg-gray-200 text-gray-800');
  };

  return (
    <div 
      className={`${styles.jobCard} ${cardClass} rounded-xl border p-6 transition-all duration-300 cursor-pointer ${isHovered ? styles.jobCardHover : ''}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="flex items-center gap-3 mb-2">
                {job.featured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-400">
                    Featured
                  </span>
                )}
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(job.type)}`}>
                  {job.type}
                </span>
              </div>
              <h3 className={`text-xl font-bold ${textClass}`}>{job.title}</h3>
              <p className={`text-sm ${textSecondaryClass} mt-1`}>{job.company}</p>
            </div>
            <div className={`w-12 h-12 flex-shrink-0 rounded-md border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
              <img src={job.logo} alt={`${job.company} logo`} className="w-full h-full object-cover" />
            </div>
          </div>
          
          <div className={`mt-4 text-sm ${textSecondaryClass}`}>
            <div className="flex items-center mb-2">
              <ion-icon name="location-outline" class="mr-2"></ion-icon>
              <span>{job.location}</span>
            </div>
            <div className="flex items-center mb-2">
              <ion-icon name="briefcase-outline" class="mr-2"></ion-icon>
              <span>{job.experience}</span>
            </div>
            <div className="flex items-center">
              <ion-icon name="cash-outline" class="mr-2"></ion-icon>
              <span>{job.salary}</span>
            </div>
          </div>
          
          <p className={`mt-4 text-sm ${textClass} line-clamp-2`}>
            {job.description}
          </p>
        </div>
        
        <div className="flex items-center justify-between mt-6">
          <div className={`text-xs ${textSecondaryClass}`}>
            Posted {formatDate(job.postedDate)}
          </div>
          <div className={`group text-sm font-medium ${isHovered ? 'text-white' : theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'} transition-colors duration-300`}>
            View Details
            <span className={`ml-1 inline-block transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}>→</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;