import { useState } from 'react';
import styles from '../styles/JobsPage.module.css';

const JobSearch = ({ onSearch, theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };
  
  const inputClass = theme === 'dark'
    ? 'bg-gray-800 border-gray-700 text-gray-200 focus:border-indigo-500 placeholder-gray-500'
    : 'bg-white border-gray-300 text-gray-900 focus:border-indigo-500 placeholder-gray-500';

  return (
    <div className={styles.searchContainer}>
      <form onSubmit={handleSubmit} className="w-full">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <ion-icon name="search-outline" class={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}></ion-icon>
          </div>
          <input
            type="text"
            className={`${inputClass} w-full pl-10 pr-20 py-3 rounded-lg border shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300`}
            placeholder="Search jobs, keywords, companies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="submit"
              className={`${styles.searchButton} px-4 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md transition duration-300`}
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobSearch;