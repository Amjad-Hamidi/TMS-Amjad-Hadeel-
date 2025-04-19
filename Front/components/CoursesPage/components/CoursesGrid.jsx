import CourseCard from './CourseCard';
import styles from '../styles/CoursesPage.module.css';

const CoursesGrid = ({ courses, isLoading, onCourseSelect, theme }) => {
  // Show loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-lg p-5 animate-pulse h-96`}
          >
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-48 w-full mb-4 rounded-lg`}></div>
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-3/4 mb-4 rounded`}></div>
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-1/2 mb-4 rounded`}></div>
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-5/6 mb-6 rounded`}></div>
            <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-8 w-1/3 rounded`}></div>
          </div>
        ))}
      </div>
    );
  }
  
  // Show empty state
  if (courses.length === 0) {
    return (
      <div className={`${styles.emptyState} text-center py-12`}>
        <ion-icon name="school-outline" class={`text-6xl ${theme === 'dark' ? 'text-gray-700' : 'text-gray-300'}`}></ion-icon>
        <p className={`mt-4 text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          No courses match your search criteria
        </p>
        <p className={`mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Try adjusting your filters or search terms
        </p>
      </div>
    );
  }
  
  // Show courses grid
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map(course => (
        <CourseCard 
          key={course.id} 
          course={course} 
          onClick={onCourseSelect} 
          theme={theme}
        />
      ))}
    </div>
  );
};

export default CoursesGrid;