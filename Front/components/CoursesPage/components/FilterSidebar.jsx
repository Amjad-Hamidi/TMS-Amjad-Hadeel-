import { useState } from 'react';
import styles from '../styles/CoursesPage.module.css';

const FilterOption = ({ label, options, value, onChange, theme }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center cursor-pointer mb-2" onClick={toggleExpand}>
        <h3 className="font-medium">{label}</h3>
        <ion-icon name={isExpanded ? "chevron-up-outline" : "chevron-down-outline"}></ion-icon>
      </div>
      
      {isExpanded && (
        <div className={`${styles.filterOptions} space-y-2`}>
          {options.map(option => (
            <div key={option.value} className="flex items-center">
              <input
                type="radio"
                id={`${label}-${option.value}`}
                name={label}
                value={option.value}
                checked={value === option.value}
                onChange={() => onChange(option.value)}
                className="mr-2"
              />
              <label 
                htmlFor={`${label}-${option.value}`}
                className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} cursor-pointer flex justify-between w-full`}
              >
                <span>{option.label}</span>
                {option.count && (
                  <span className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
                    ({option.count})
                  </span>
                )}
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterSidebar = ({ filters, categories, onFilterChange, onClearFilters, theme }) => {
  const sidebarClass = theme === 'dark'
    ? 'bg-gray-800 border-gray-700 text-gray-200'
    : 'bg-white border-gray-200 text-gray-800';
  
  // Category filter options
  const categoryOptions = [
    { label: 'All Categories', value: '' },
    ...categories.map(cat => ({ 
      label: cat.name, 
      value: cat.name,
      count: cat.courseCount
    }))
  ];
  
  // Level filter options
  const levelOptions = [
    { label: 'All Levels', value: '' },
    { label: 'Beginner', value: 'Beginner' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' }
  ];
  
  // Duration filter options
  const durationOptions = [
    { label: 'Any Duration', value: '' },
    { label: 'Under 2 Hours', value: 'short' },
    { label: '2-5 Hours', value: 'medium' },
    { label: '5+ Hours', value: 'long' }
  ];
  
  // Price filter options
  const priceOptions = [
    { label: 'Any Price', value: '' },
    { label: 'Free', value: 'free' },
    { label: 'Paid', value: 'paid' },
    { label: 'Under $50', value: 'under50' },
    { label: '$50-$100', value: '50to100' },
    { label: '$100+', value: 'over100' }
  ];
  
  // Rating filter options
  const ratingOptions = [
    { label: 'Any Rating', value: '' },
    { label: '4.5 & Up', value: '4.5' },
    { label: '4.0 & Up', value: '4.0' },
    { label: '3.5 & Up', value: '3.5' },
    { label: '3.0 & Up', value: '3.0' }
  ];
  
  // Format filter options
  const formatOptions = [
    { label: 'Any Format', value: '' },
    { label: 'Video', value: 'Video' },
    { label: 'Interactive', value: 'Interactive' },
    { label: 'Text', value: 'Text' }
  ];
  
  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some(val => val !== '');
  
  return (
    <div className={`${styles.filterSidebar} ${sidebarClass} rounded-xl border p-6 mt-6 sticky top-6`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-bold">Filters</h2>
        {hasActiveFilters && (
          <button 
            onClick={onClearFilters}
            className={`text-sm ${theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'} font-medium`}
          >
            Clear All
          </button>
        )}
      </div>
      
      <FilterOption 
        label="Category"
        options={categoryOptions}
        value={filters.category}
        onChange={value => onFilterChange('category', value)}
        theme={theme}
      />
      
      <FilterOption 
        label="Level"
        options={levelOptions}
        value={filters.level}
        onChange={value => onFilterChange('level', value)}
        theme={theme}
      />
      
      <FilterOption 
        label="Duration"
        options={durationOptions}
        value={filters.duration}
        onChange={value => onFilterChange('duration', value)}
        theme={theme}
      />
      
      <FilterOption 
        label="Price"
        options={priceOptions}
        value={filters.price}
        onChange={value => onFilterChange('price', value)}
        theme={theme}
      />
      
      <FilterOption 
        label="Rating"
        options={ratingOptions}
        value={filters.rating}
        onChange={value => onFilterChange('rating', value)}
        theme={theme}
      />
      
      <FilterOption 
        label="Format"
        options={formatOptions}
        value={filters.format}
        onChange={value => onFilterChange('format', value)}
        theme={theme}
      />
    </div>
  );
};

export default FilterSidebar;