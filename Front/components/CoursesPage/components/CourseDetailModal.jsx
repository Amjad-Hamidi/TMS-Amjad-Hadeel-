import { useRef, useEffect } from 'react';
import InstructorCard from './InstructorCard';
import TopicBadge from './TopicBadge';
import styles from '../styles/CoursesPage.module.css';

const CourseDetailModal = ({ course, instructors, isOpen, onClose, theme }) => {
  const modalRef = useRef(null);
  
  useEffect(() => {
    // Handle escape key to close modal
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    // Handle click outside modal to close
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent scrolling when modal is open
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);
  
  if (!isOpen || !course) return null;
  
  // Find instructor details
  const instructorData = instructors.find(i => i.name === course.instructor) || {
    name: course.instructor,
    title: 'Instructor',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
    bio: 'Experienced instructor with expertise in this subject area.'
  };
  
  // Format course duration
  const formatDuration = (hours) => {
    if (hours < 1) return `${Math.round(hours * 60)} minutes`;
    if (hours === 1) return '1 hour';
    return `${hours} hours`;
  };
  
  // Format price display
  const formatPrice = (price, discountedPrice) => {
    if (price === 0) return 'Free';
    if (discountedPrice) {
      return (
        <div className="flex items-center">
          <span className="text-2xl font-bold mr-3">${discountedPrice}</span>
          <span className={`line-through text-lg ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`}>
            ${price}
          </span>
          <span className="ml-3 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded">
            {course.discountPercentage}% OFF
          </span>
        </div>
      );
    }
    return <span className="text-2xl font-bold">${price}</span>;
  };
  
  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  // Background colors
  const bgClass = theme === 'dark' ? 'bg-black/70' : 'bg-black/50';
  const modalBgClass = theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800';
  const sectionBgClass = theme === 'dark' ? 'bg-gray-900/50' : 'bg-gray-50';
  
  return (
    <div className={`${styles.modalBackdrop} fixed inset-0 z-50 overflow-y-auto flex items-center justify-center ${bgClass}`}>
      <div 
        ref={modalRef}
        className={`${styles.modalContent} ${modalBgClass} w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl`}
      >
        {/* Header */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <ion-icon name="close" class="text-2xl"></ion-icon>
          </button>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-2">{course.title}</h2>
              <p className="text-lg mb-4">{course.subtitle}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {course.bestseller && (
                  <span className="bg-yellow-500 text-black text-xs font-medium px-2 py-1 rounded">
                    Bestseller
                  </span>
                )}
                {course.topics.map(topic => (
                  <TopicBadge key={topic} topic={topic} theme={theme} />
                ))}
                <span className={`text-xs px-2 py-1 rounded ${
                  theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                }`}>
                  {course.level}
                </span>
              </div>
              
              <div className="flex items-center mb-4">
                <span className="text-yellow-400 mr-1">★</span>
                <span className="font-bold mr-1">{course.rating}</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  ({course.reviews.toLocaleString()} reviews)
                </span>
                <span className="mx-2">•</span>
                <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                  {course.enrolled.toLocaleString()} students
                </span>
              </div>
              
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Created by <span className="font-medium text-indigo-600 dark:text-indigo-400">{course.instructor}</span>
                <span className="mx-2">•</span>
                Last updated {formatDate(course.lastUpdated)}
              </div>
            </div>
            
            <div className={`${sectionBgClass} p-4 rounded-lg flex flex-col`}>
              <img 
                src={course.image} 
                alt={course.title}
                className="w-full h-40 object-cover rounded-lg mb-4"
              />
              
              <div className="mb-4">
                {formatPrice(course.price, course.discountedPrice)}
              </div>
              
              <button className={`${styles.enrollButton} mb-3 w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all duration-300`}>
                Enroll Now
              </button>
              
              <button className={`${styles.saveButton} mb-6 w-full py-3 px-6 border ${
                theme === 'dark' 
                  ? 'border-gray-600 hover:bg-gray-700 text-gray-300' 
                  : 'border-gray-300 hover:bg-gray-100 text-gray-700'
              } font-medium rounded-lg transition-colors duration-300`}>
                <ion-icon name="heart-outline" class="mr-2"></ion-icon>
                Add to Wishlist
              </button>
              
              <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                <div className="flex items-center mb-2">
                  <ion-icon name="time-outline" class="mr-2"></ion-icon>
                  <span>{formatDuration(course.durationHours)} total</span>
                </div>
                <div className="flex items-center mb-2">
                  <ion-icon name="document-outline" class="mr-2"></ion-icon>
                  <span>{course.modules.length} modules</span>
                </div>
                <div className="flex items-center mb-2">
                  <ion-icon name="infinite-outline" class="mr-2"></ion-icon>
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center">
                  <ion-icon name="medal-outline" class="mr-2"></ion-icon>
                  <span>Certificate of completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Course Description & Curriculum */}
        <div className="p-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              {/* Course Description */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">About This Course</h3>
                <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} space-y-4`}>
                  <p>{course.fullDescription}</p>
                </div>
              </div>
              
              {/* What You'll Learn */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">What You'll Learn</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {course.learningOutcomes.map((outcome, index) => (
                    <div 
                      key={index} 
                      className="flex items-start"
                    >
                      <div className={`mt-1 mr-3 ${theme === 'dark' ? 'text-green-400' : 'text-green-600'}`}>
                        <ion-icon name="checkmark-outline"></ion-icon>
                      </div>
                      <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {outcome}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Course Content */}
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4">Course Content</h3>
                <div className={`${sectionBgClass} rounded-lg overflow-hidden divide-y ${
                  theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
                }`}>
                  {course.modules.map((module, index) => (
                    <div key={index} className="p-4">
                      <div className="flex justify-between items-center cursor-pointer">
                        <h4 className="font-medium">{module.title}</h4>
                        <div className="flex items-center">
                          <span className={`text-sm mr-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {module.lessons.length} lessons
                          </span>
                          <ion-icon name="chevron-down-outline"></ion-icon>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Prerequisites */}
              {course.prerequisites.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold mb-4">Prerequisites</h3>
                  <ul className="list-disc pl-5 space-y-2">
                    {course.prerequisites.map((prerequisite, index) => (
                      <li key={index} className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {prerequisite}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            {/* Instructor */}
            <div>
              <h3 className="text-xl font-bold mb-4">Your Instructor</h3>
              <InstructorCard instructor={instructorData} theme={theme} />
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex items-center">
              <ion-icon name="shield-checkmark-outline" class="mr-2"></ion-icon>
              <span>30-Day Money-Back Guarantee</span>
            </div>
          </div>
          
          <button className={`px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors duration-300`}>
            Enroll Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailModal;