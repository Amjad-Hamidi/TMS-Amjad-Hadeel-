import { useState } from 'react';
import styles from '../styles/CoursesPage.module.css';

const FeaturedCourseCard = ({ course, onClick, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardClass = theme === 'dark' 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';
  
  const textClass = theme === 'dark' 
    ? 'text-gray-200' 
    : 'text-gray-800';
  
  // Format price display
  const formatPrice = (price, discountedPrice) => {
    if (price === 0) return 'Free';
    
    if (discountedPrice) {
      return (
        <div className="flex items-center">
          <span className="text-2xl font-bold mr-2">${discountedPrice}</span>
          <span className={`line-through text-lg ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            ${price}
          </span>
        </div>
      );
    }
    
    return <span className="text-2xl font-bold">${price}</span>;
  };
  
  return (
    <div 
      className={`${styles.featuredCard} ${cardClass} rounded-xl overflow-hidden border shadow-lg transition-all duration-300 transform ${isHovered ? 'scale-[1.02]' : 'scale-100'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(course)}
    >
      {/* Image */}
      <div className="relative overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-52 object-cover transition-transform duration-700"
          style={{ transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
        />
        <div className={`${styles.featuredBadge} absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full`}>
          Featured
        </div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex items-center mb-3">
          <div className={`${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-500'} flex mr-2`}>
            {[...Array(5)].map((_, i) => (
              <span key={i}>★</span>
            ))}
          </div>
          <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            ({course.reviews.toLocaleString()} reviews)
          </span>
        </div>
        
        <h3 className={`text-xl font-bold mb-3 ${textClass} line-clamp-2`}>{course.title}</h3>
        
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-4 line-clamp-3`}>
          {course.description}
        </p>
        
        <div className={`flex items-center mb-5 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          <span className="flex items-center mr-4">
            <ion-icon name="person-outline" class="mr-1"></ion-icon>
            {course.enrolled.toLocaleString()} students
          </span>
          <span className="flex items-center">
            <ion-icon name="time-outline" class="mr-1"></ion-icon>
            {course.durationHours} hours
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            {formatPrice(course.price, course.discountedPrice)}
          </div>
          <button className={`${styles.featuredButton} px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors duration-300 flex items-center`}>
            <span>View Course</span>
            <ion-icon name="arrow-forward-outline" class="ml-1 transform transition-transform duration-300" style={{ 
              transform: isHovered ? 'translateX(3px)' : 'translateX(0)' 
            }}></ion-icon>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturedCourseCard;