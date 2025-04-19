import { useTheme } from '@/context/ThemeContext';
import FeaturedCourseCard from './FeaturedCourseCard';
import styles from '../styles/CoursesPage.module.css';

const FeaturedCourses = ({ courses, isLoading, onCourseSelect }) => {
  const { theme } = useTheme();
  
  const bgClass = theme === 'dark' ? 'bg-[rgb(16,23,42)]' : 'bg-white';
  const textClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  
  return (
    <section className={`${bgClass} py-20 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${textClass}`}>Featured Courses</h2>
          <p className={`text-lg max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Handpicked courses to help you master new skills and advance your career
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i} 
                className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} rounded-xl p-6 animate-pulse h-[400px]`}
              >
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-48 w-full mb-4 rounded-lg`}></div>
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-5 w-3/4 mb-4 rounded`}></div>
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-4 w-1/2 mb-4 rounded`}></div>
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-20 w-full mb-4 rounded`}></div>
                <div className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'} h-10 w-full rounded`}></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {courses.map(course => (
              <FeaturedCourseCard 
                key={course.id} 
                course={course} 
                onClick={() => onCourseSelect(course)} 
                theme={theme}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedCourses;