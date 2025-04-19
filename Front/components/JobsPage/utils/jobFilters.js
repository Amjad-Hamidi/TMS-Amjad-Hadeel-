/**
 * Filter jobs based on search term and filters
 * @param {Array} jobs - Array of job objects
 * @param {Object} filters - Filter criteria
 * @returns {Array} - Filtered jobs
 */
export const filterJobs = (jobs, filters) => {
    return jobs.filter(job => {
      // Search filter (search in title, company, description, and location)
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchFields = [
          job.title,
          job.company,
          job.description,
          job.location,
          job.category
        ].map(field => field?.toLowerCase() || '');
        
        if (!searchFields.some(field => field.includes(searchTerm))) {
          return false;
        }
      }
      
      // Category filter
      if (filters.category && job.category !== filters.category) {
        return false;
      }
      
      // Location filter
      if (filters.location && job.location !== filters.location) {
        return false;
      }
      
      // Job type filter
      if (filters.type && job.type !== filters.type) {
        return false;
      }
      
      // Experience level filter
      if (filters.experience && job.experience !== filters.experience) {
        return false;
      }
      
      return true;
    });
  };
  
  /**
   * Sort jobs by specified criteria
   * @param {Array} jobs - Array of job objects
   * @param {string} sortBy - Sort criteria (e.g., 'date', 'salary')
   * @param {string} order - Sort order ('asc' or 'desc')
   * @returns {Array} - Sorted jobs
   */
  export const sortJobs = (jobs, sortBy = 'date', order = 'desc') => {
    return [...jobs].sort((a, b) => {
      switch (sortBy) {
        case 'date':
          const dateA = new Date(a.postedDate);
          const dateB = new Date(b.postedDate);
          return order === 'asc' ? dateA - dateB : dateB - dateA;
          
        case 'salary':
          // Extract numeric salary for comparison
          const getSalaryValue = (salary) => {
            const matches = salary.match(/(\d+)/g);
            return matches ? parseInt(matches[0]) : 0;
          };
          
          const salaryA = getSalaryValue(a.salary);
          const salaryB = getSalaryValue(b.salary);
          return order === 'asc' ? salaryA - salaryB : salaryB - salaryA;
          
        default:
          return 0;
      }
    });
  };