"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import BannerSection from './components/BannerSection';
import FeaturedCourses from './components/FeaturedCourses';
import CategorySection from './components/CategorySection';
import TrendingCourses from './components/TrendingCourses';
import SearchBar from './components/SearchBar';
import FilterSidebar from './components/FilterSidebar';
import CoursesGrid from './components/CoursesGrid';
import PaginationControls from './components/PaginationControls';
import TestimonialsSection from './components/TestimonialsSection';
import CourseDetailModal from './components/CourseDetailModal';
import { courses, categories, instructors } from './utils/mockCourses';
import { filterCourses } from './utils/courseFilters';
import styles from './styles/CoursesPage.module.css';

const CoursesPage = () => {
  const { theme } = useTheme();
  const [allCourses, setAllCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [trendingCourses, setTrendingCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    level: '',
    duration: '',
    price: '',
    rating: '',
    format: '',
  });
  
  const coursesPerPage = 9;
  
  // Load courses data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        // Simulate API fetch delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Use mock data
        setAllCourses(courses);
        setFilteredCourses(courses);
        
        // Set featured courses
        setFeaturedCourses(courses.filter(course => course.featured).slice(0, 3));
        
        // Set trending courses
        setTrendingCourses(
          [...courses].sort((a, b) => b.enrolled - a.enrolled).slice(0, 6)
        );
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading courses:", error);
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Apply filters when they change
  useEffect(() => {
    const result = filterCourses(allCourses, filters);
    setFilteredCourses(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [allCourses, filters]);
  
  // Handle search input
  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
  };
  
  // Handle filter changes
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  // Clear all filters
  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      level: '',
      duration: '',
      price: '',
      rating: '',
      format: '',
    });
  };
  
  // Handle pagination
  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to courses section
    document.getElementById('courses-section').scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  
  // Handle course selection
  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };
  
  // Handle category selection
  const handleCategorySelect = (category) => {
    setFilters(prev => ({ ...prev, category }));
    // Scroll to courses section
    document.getElementById('courses-section').scrollIntoView({ behavior: 'smooth' });
  };
  
  // Calculate current courses for pagination
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = filteredCourses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(filteredCourses.length / coursesPerPage);
  
  // Background classes based on theme
  const bgClass = theme === 'dark' ? 'bg-[rgb(16,23,42)]' : 'bg-gray-50';
  const mainBgClass = theme === 'dark' ? 'bg-[rgb(16,23,42)]' : 'bg-white';
  
  return (
    <div className={`${bgClass} min-h-screen transition-colors duration-300`}>
      {/* Banner Section */}
      <BannerSection />
      
      {/* Featured Courses Section */}
      <FeaturedCourses 
        courses={featuredCourses} 
        isLoading={isLoading} 
        onCourseSelect={handleCourseSelect}
      />
      
      {/* Categories Section */}
      <CategorySection 
        categories={categories} 
        onCategorySelect={handleCategorySelect}
      />
      
      {/* Trending Courses Section */}
      <TrendingCourses 
        courses={trendingCourses} 
        isLoading={isLoading} 
        onCourseSelect={handleCourseSelect}
      />
      
      {/* Main Courses Section */}
      <section id="courses-section" className={`${mainBgClass} py-12 transition-colors duration-300`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar with filters */}
            <div className="lg:w-1/4">
              <SearchBar onSearch={handleSearch} value={filters.search} theme={theme} />
              <FilterSidebar 
                filters={filters}
                categories={categories}
                onFilterChange={handleFilterChange}
                onClearFilters={clearFilters}
                theme={theme}
              />
            </div>
            
            {/* Courses Grid */}
            <div className="lg:w-3/4">
              <h2 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                {isLoading 
                  ? 'Loading courses...' 
                  : filteredCourses.length === 0 
                    ? 'No courses found' 
                    : `All Courses (${filteredCourses.length})`}
              </h2>
              
              <CoursesGrid 
                courses={currentCourses} 
                isLoading={isLoading} 
                onCourseSelect={handleCourseSelect} 
                theme={theme}
              />
              
              {/* Pagination */}
              {!isLoading && filteredCourses.length > 0 && (
                <PaginationControls 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  theme={theme}
                />
              )}
            </div>
          </div>
        </div>
      </section>
      
      
      {/* Testimonials Section */}
      <TestimonialsSection />
      

      {/* Course Detail Modal */}
      {selectedCourse && (
        <CourseDetailModal 
          course={selectedCourse}
          instructors={instructors}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          theme={theme}
        />
      )}
    </div>
  );
};

export default CoursesPage;