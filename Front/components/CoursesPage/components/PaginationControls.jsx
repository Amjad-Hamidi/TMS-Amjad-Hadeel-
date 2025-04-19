import styles from '../styles/CoursesPage.module.css';

const PaginationControls = ({ currentPage, totalPages, onPageChange, theme }) => {
  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    
    // For fewer pages, show all
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }
    
    // For many pages, show first, last, and pages around current
    pageNumbers.push(1);
    
    if (currentPage > 3) {
      pageNumbers.push('...');
    }
    
    // Pages around current
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    if (currentPage < totalPages - 2) {
      pageNumbers.push('...');
    }
    
    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
    
    return pageNumbers;
  };
  
  const pageNumbers = getPageNumbers();
  
  // Button classes based on theme
  const getButtonClass = (isActive) => {
    const baseClass = "w-10 h-10 flex items-center justify-center rounded transition-colors duration-300";
    
    if (isActive) {
      return `${baseClass} ${theme === 'dark' ? 'bg-indigo-600 text-white' : 'bg-indigo-600 text-white'}`;
    }
    
    return `${baseClass} ${
      theme === 'dark' 
        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  };
  
  const getArrowClass = (disabled) => {
    const baseClass = "w-10 h-10 flex items-center justify-center rounded transition-colors duration-300";
    
    if (disabled) {
      return `${baseClass} ${
        theme === 'dark' 
          ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
      }`;
    }
    
    return `${baseClass} ${
      theme === 'dark' 
        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`;
  };
  
  return (
    <div className={`${styles.pagination} flex justify-center mt-12`}>
      <div className="flex items-center space-x-2">
        {/* Previous page button */}
        <button
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={getArrowClass(currentPage === 1)}
          aria-label="Previous page"
        >
          <ion-icon name="chevron-back-outline"></ion-icon>
        </button>
        
        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={getButtonClass(currentPage === page)}
              aria-label={`Page ${page}`}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )
        ))}
        
        {/* Next page button */}
        <button
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={getArrowClass(currentPage === totalPages)}
          aria-label="Next page"
        >
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;