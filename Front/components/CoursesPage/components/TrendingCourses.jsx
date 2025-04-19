import { useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import CourseCard from './CourseCard';
import styles from '../styles/CoursesPage.module.css';

const TrendingCourses = ({ courses, isLoading, onCourseSelect }) => {
  const { theme } = useTheme();
  const sliderRef = useRef(null);
  
  const bgClass = theme === 'dark' ? 'bg-[rgb(22,30,50)]' : 'bg-gray-50';
  const textClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  
  const scroll = (direction) => {
    if (!sliderRef.current) return;
    
    const { scrollLeft, clientWidth } = sliderRef.current;
    const scrollTo = direction === 'left' 
      ? scrollLeft - clientWidth * 0.75 
      : scrollLeft + clientWidth * 0.75;
    
    sliderRef.current.scrollTo({
      left: scrollTo,
      behavior: 'smooth'
    });
  };
  
  return (
    <section className={`${bgClass} py-20 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className={`text-3xl font-bold ${textClass}`}>Trending Now</h2>
            <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Most popular courses among our students
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button 
              onClick={() => scroll('left')}
              className={`${styles.scrollButton} w-10 h-10 flex items-center justify-center rounded-full ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-white hover:bg-gray-100 text-gray-700'
              } border ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } shadow-sm transition-colors duration-300`}
              aria-label="Scroll left"
            >
              <ion-icon name="chevron-back-outline"></ion-icon>
            </button>
            <button 
              onClick={() => scroll('right')}
              className={`${styles.scrollButton} w-10 h-10 flex items-center justify-center rounded-full ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                  : 'bg-white hover:bg-gray-100 text-gray-700'
              } border ${
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              } shadow-sm transition-colors duration-300`}
              aria-label="Scroll right"
            >
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </button>
          </div>
        </div>
        
        <div 
          ref={sliderRef}
          className={`${styles.horizontalScroll} flex overflow-x-auto space-x-6 pb-4 scrollbar-hide`}
        >
          {isLoading ? (
            // Loading skeletons
            [...Array(5)].map((_, i) => (
              <div 
                key={i} 
                className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-5 animate-pulse h-96 min-w-[320px] flex-shrink-0`}
              >
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-40 w-full mb-4 rounded-lg`}></div>
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-3/4 mb-4 rounded`}></div>
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-1/2 mb-4 rounded`}></div>
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-5/6 mb-6 rounded`}></div>
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-8 w-1/3 rounded`}></div>
              </div>
            ))
          ) : (
            // Actual courses
            courses.map(course => (
              <div key={course.id} className="min-w-[320px] flex-shrink-0">
                <CourseCard course={course} onClick={onCourseSelect} theme={theme} />
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-10">
          <a 
            href="#courses-section"
            className={`inline-flex items-center ${
              theme === 'dark' ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-700'
            } font-medium`}
          >
            <span>View All Courses</span>
            <ion-icon name="arrow-forward-outline" class="ml-1"></ion-icon>
          </a>
        </div>
      </div>
    </section>
  );
};

export default TrendingCourses;