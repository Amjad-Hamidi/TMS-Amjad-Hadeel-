import { useState } from 'react';
import styles from '../styles/JobsPage.module.css';

const FilterDropdown = ({ label, options, value, onChange, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const toggleDropdown = () => setIsOpen(!isOpen);
  
  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
  };
  
  const buttonClass = theme === 'dark'
    ? 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
    
  const dropdownClass = theme === 'dark'
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-300';
    
  const optionClass = theme === 'dark'
    ? 'hover:bg-gray-700 text-gray-300'
    : 'hover:bg-gray-100 text-gray-800';

  return (
    <div className="relative">
      <button
        type="button"
        className={`${buttonClass} inline-flex justify-between items-center w-full px-4 py-2 text-sm font-medium border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500`}
        onClick={toggleDropdown}
      >
        {value || label}
        <ion-icon name={isOpen ? "chevron-up-outline" : "chevron-down-outline"} class="ml-2"></ion-icon>
      </button>

      {isOpen && (
        <div className={`${styles.filterDropdown} absolute right-0 z-10 mt-2 w-full rounded-md shadow-lg ${dropdownClass} border overflow-hidden`}>
          <div className="py-1 max-h-60 overflow-auto">
            <button
              className={`${optionClass} w-full px-4 py-2 text-sm text-left ${!value ? 'font-bold' : ''}`}
              onClick={() => handleSelect('')}
            >
              All {label}s
            </button>
            {options.map((option) => (
              <button
                key={option}
                className={`${optionClass} w-full px-4 py-2 text-sm text-left ${value === option ? 'font-bold' : ''}`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const JobFilter = ({ 
  categories, 
  locations, 
  jobTypes, 
  experienceLevels, 
  filters, 
  onFilterChange,
  theme
}) => {
  return (
    <div className={`${styles.filterBar} flex flex-wrap gap-3`}>
      <FilterDropdown 
        label="Category"
        options={categories}
        value={filters.category}
        onChange={(value) => onFilterChange('category', value)}
        theme={theme}
      />
      
      <FilterDropdown 
        label="Location"
        options={locations}
        value={filters.location}
        onChange={(value) => onFilterChange('location', value)}
        theme={theme}
      />
      
      <FilterDropdown 
        label="Job Type"
        options={jobTypes}
        value={filters.type}
        onChange={(value) => onFilterChange('type', value)}
        theme={theme}
      />
      
      <FilterDropdown 
        label="Experience"
        options={experienceLevels}
        value={filters.experience}
        onChange={(value) => onFilterChange('experience', value)}
        theme={theme}
      />
      
      {(filters.category || filters.location || filters.type || filters.experience) && (
        <button
          className={`${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'} px-4 py-2 rounded-md text-sm flex items-center transition-colors duration-300`}
          onClick={() => {
            onFilterChange('category', '');
            onFilterChange('location', '');
            onFilterChange('type', '');
            onFilterChange('experience', '');
          }}
        >
          <ion-icon name="close-circle-outline" class="mr-1"></ion-icon>
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default JobFilter;