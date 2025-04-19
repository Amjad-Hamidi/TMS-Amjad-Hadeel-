import { useState, useEffect } from 'react';
import styles from '../styles/CoursesPage.module.css';

const SearchBar = ({ onSearch, value, theme }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');
  
  // Update searchTerm if value prop changes (e.g. when filters are cleared)
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  const inputClass = theme === 'dark'
    ? 'bg-gray-800 border-gray-700 text-gray-200 focus:border-indigo-500'
    : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500';
  
  return (
    <div className={styles.searchBar}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          className={`${inputClass} w-full pl-10 pr-16 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors duration-300`}
          placeholder="Search for courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <ion-icon name="search-outline" class={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}></ion-icon>
        </div>
        <button
          type="submit"
          className="absolute inset-y-0 right-0 flex items-center px-4 text-sm font-medium text-white bg-indigo-600 rounded-r-lg hover:bg-indigo-700 focus:outline-none"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;