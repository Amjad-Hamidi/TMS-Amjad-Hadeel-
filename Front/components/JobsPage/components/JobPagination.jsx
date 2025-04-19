import { useTheme } from '@/context/ThemeContext';
import styles from '../styles/JobsPage.module.css';

const JobPagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  const { theme } = useTheme();
  
  // Generate page numbers array
  const getPageNumbers = () => {
    // For small number of pages, show all pages
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // For many pages, show first, last, and pages around current
    let pages = [1];
    
    // Always include current page and adjacent pages
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    // Add ellipsis if needed before current page group
    if (startPage > 2) {
      pages.push('...');
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    // Add ellipsis if needed after current page group
    if (endPage < totalPages - 1) {
      pages.push('...');
    }
    
    // Add last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
    
    return pages;
  };
  
  const pageNumbers = getPageNumbers();
  
  // Theme-based classes
  const baseButtonClass = `px-3 py-1 text-sm transition duration-300 flex items-center justify-center min-w-[32px]`;
  
  const getButtonClass = (isActive, isDisabled = false) => {
    if (isDisabled) {
      return `${baseButtonClass} ${theme === 'dark' 
        ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
        : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`;
    }
    
    if (isActive) {
      return `${baseButtonClass} bg-indigo-600 text-white`;
    }
    
    return `${baseButtonClass} ${theme === 'dark' 
      ? 'bg-gray-700 text-gray-300 hover:bg-indigo-600 hover:text-white' 
      : 'bg-gray-100 text-gray-700 hover:bg-indigo-600 hover:text-white'}`;
  };

  return (
    <div className={`${styles.pagination} flex justify-center mt-8`}>
      <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
        {/* Previous page button */}
        <button 
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`${getButtonClass(false, currentPage === 1)} rounded-l-md`}
          aria-label="Previous page"
        >
          <ion-icon name="chevron-back-outline"></ion-icon>
        </button>
        
        {/* Page numbers */}
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <span 
              key={`ellipsis-${index}`} 
              className={`${baseButtonClass} ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
            >
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={getButtonClass(currentPage === page)}
              aria-current={currentPage === page ? 'page' : undefined}
              aria-label={`Page ${page}`}
            >
              {page}
            </button>
          )
        ))}
        
        {/* Next page button */}
        <button 
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`${getButtonClass(false, currentPage === totalPages)} rounded-r-md`}
          aria-label="Next page"
        >
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
      </nav>
      
      {/* Page indicator for accessibility */}
      <div className="sr-only" aria-live="polite">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
};

export default JobPagination;