/**
 * Filter courses based on search term and filters
 * @param {Array} courses - Array of course objects
 * @param {Object} filters - Filter criteria 
 * @returns {Array} - Filtered courses
 */
export const filterCourses = (courses, filters) => {
    return courses.filter(course => {
      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        const searchFields = [
          course.title,
          course.description,
          course.instructor,
          ...course.topics,
        ].map(field => field?.toLowerCase() || '');
        
        if (!searchFields.some(field => field.includes(searchTerm))) {
          return false;
        }
      }
      
      // Category filter
      if (filters.category && !course.category.includes(filters.category)) {
        return false;
      }
      
      // Level filter
      if (filters.level && course.level !== filters.level) {
        return false;
      }
      
      // Duration filter
      if (filters.duration) {
        switch (filters.duration) {
          case 'short':
            if (course.durationHours >= 2) return false;
            break;
          case 'medium':
            if (course.durationHours < 2 || course.durationHours > 5) return false;
            break;
          case 'long':
            if (course.durationHours <= 5) return false;
            break;
        }
      }
      
      // Price filter
      if (filters.price) {
        const coursePrice = course.discountedPrice || course.price;
        
        switch (filters.price) {
          case 'free':
            if (coursePrice > 0) return false;
            break;
          case 'paid':
            if (coursePrice === 0) return false;
            break;
          case 'under50':
            if (coursePrice >= 50) return false;
            break;
          case '50to100':
            if (coursePrice < 50 || coursePrice > 100) return false;
            break;
          case 'over100':
            if (coursePrice <= 100) return false;
            break;
        }
      }
      
      // Rating filter
      if (filters.rating) {
        const minRating = parseFloat(filters.rating);
        if (course.rating < minRating) return false;
      }
      
      // Format filter
      if (filters.format && course.format !== filters.format) {
        return false;
      }
      
      return true;
    });
  };
  
  /**
   * Sort courses based on specified criteria
   * @param {Array} courses - Array of course objects
   * @param {string} sortBy - Sort criteria
   * @param {string} order - Sort order ('asc' or 'desc')
   * @returns {Array} - Sorted courses
   */
  export const sortCourses = (courses, sortBy = 'popularity', order = 'desc') => {
    return [...courses].sort((a, b) => {
      let valueA, valueB;
      
      switch (sortBy) {
        case 'popularity':
          valueA = a.enrolled;
          valueB = b.enrolled;
          break;
        case 'rating':
          valueA = a.rating;
          valueB = b.rating;
          break;
        case 'newest':
          valueA = new Date(a.lastUpdated);
          valueB = new Date(b.lastUpdated);
          break;
        case 'price':
          valueA = a.discountedPrice || a.price;
          valueB = b.discountedPrice || b.price;
          break;
        case 'duration':
          valueA = a.durationHours;
          valueB = b.durationHours;
          break;
        default:
          valueA = a.enrolled;
          valueB = b.enrolled;
      }
      
      if (order === 'asc') {
        return valueA - valueB;
      } else {
        return valueB - valueA;
      }
    });
  };