import { useState } from 'react';
import TopicBadge from './TopicBadge';
import styles from '../styles/CoursesPage.module.css';

const CourseCard = ({ course, onClick, theme }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const cardClass = theme === 'dark' 
    ? 'bg-gray-800 border-gray-700 text-gray-200' 
    : 'bg-white border-gray-200 text-gray-800';
  
  // Format ratings to display stars
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<ion-icon key={i} name="star" class="text-yellow-400"></ion-icon>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<ion-icon key={i} name="star-half" class="text-yellow-400"></ion-icon>);
      } else {
        stars.push(<ion-icon key={i} name="star-outline" class="text-gray-400"></ion-icon>);
      }
    }
    
    return stars;
  };
  
  // Format price display
  const formatPrice = (price, discountedPrice) => {
    if (price === 0) return 'Free';
    
    if (discountedPrice) {
      return (
        <div className="flex items-center">
          <span className="font-bold mr-2">${discountedPrice}</span>
          <span className={`line-through text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            ${price}
          </span>
        </div>
      );
    }
    
    return <span className="font-bold">${price}</span>;
  };
  
  // Format course duration
  const formatDuration = (durationHours) => {
    if (durationHours < 1) {
      return `${Math.round(durationHours * 60)} minutes`;
    } else if (durationHours === 1) {
      return '1 hour';
    } else {
      return `${durationHours} hours`;
    }
  };
  
  return (
    <div 
      className={`${styles.courseCard} ${cardClass} rounded-xl overflow-hidden border transition-all duration-300 h-full flex flex-col`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onClick(course)}
    >
      {/* Course Image */}
      <div className="relative overflow-hidden">
        <img 
          src={course.image} 
          alt={course.title}
          className="w-full h-48 object-cover transition-transform duration-500"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        {course.bestseller && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-black text-xs font-medium px-2 py-1 rounded">
            Bestseller
          </div>
        )}
        {course.new && (
          <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-medium px-2 py-1 rounded">
            New
          </div>
        )}
        {course.discountPercentage > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            {course.discountPercentage}% OFF
          </div>
        )}
      </div>
      
      {/* Course Content */}
      <div className="p-5 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div className="flex">
            {course.topics.slice(0, 2).map(topic => (
              <TopicBadge key={topic} topic={topic} theme={theme} />
            ))}
          </div>
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            {formatDuration(course.durationHours)}
          </div>
        </div>
        
        <h3 className={`text-lg font-bold mb-2 line-clamp-2 ${isHovered ? theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600' : ''}`}>
          {course.title}
        </h3>
        
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-3 line-clamp-2`}>
          {course.description}
        </p>
        
        <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} mb-3`}>
          By {course.instructor}
        </div>
        
        <div className="flex items-center mb-3">
          <span className="font-bold mr-2">{course.rating}</span>
          <div className="flex mr-2">
            {renderStars(course.rating)}
          </div>
          <span className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            ({course.reviews.toLocaleString()})
          </span>
        </div>
        
        <div className="mt-auto pt-3 flex justify-between items-center border-t border-gray-200 dark:border-gray-700">
          <div>
            {formatPrice(course.price, course.discountedPrice)}
          </div>
          <div className={`${styles.viewCourseBtn} flex items-center text-sm font-medium ${
            theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'
          }`}>
            <span>View Course</span>
            <ion-icon name="chevron-forward-outline" class="ml-1 transform transition-transform duration-300" style={{ 
              transform: isHovered ? 'translateX(4px)' : 'translateX(0)' 
            }}></ion-icon>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;