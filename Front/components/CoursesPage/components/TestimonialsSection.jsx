import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import styles from '../styles/CoursesPage.module.css';

const testimonials = [
  {
    id: 1,
    content: "The courses on this platform have been instrumental in my career growth. I've learned practical skills that I use daily in my work, and the instructors are true experts in their fields.",
    name: "Sarah Johnson",
    position: "Software Engineer",
    company: "Google",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg"
  },
  {
    id: 2,
    content: "I've tried many online learning platforms, but this one stands out for the quality of content and instructor engagement. The hands-on projects helped me build a portfolio that landed me my dream job.",
    name: "Michael Chen",
    position: "UX Designer",
    company: "Adobe",
    avatar: "https://randomuser.me/api/portraits/men/39.jpg"
  },
  {
    id: 3,
    content: "As someone transitioning careers, these courses gave me the confidence and skills to make the switch. The community support and mentorship opportunities were invaluable during my learning journey.",
    name: "Priya Patel",
    position: "Data Scientist",
    company: "Netflix",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  }
];

const TestimonialsSection = () => {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const intervalRef = useRef(null);
  
  const bgClass = theme === 'dark' ? 'bg-[rgb(22,30,50)]' : 'bg-gray-50';
  const cardClass = theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200';
  const textClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  
  // Auto-rotate testimonials
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, 8000);
    
    return () => clearInterval(intervalRef.current);
  }, []);
  
  // Pause rotation on hover
  const handleMouseEnter = () => {
    clearInterval(intervalRef.current);
  };
  
  const handleMouseLeave = () => {
    intervalRef.current = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % testimonials.length);
    }, 8000);
  };
  
  const handleDotClick = (index) => {
    setActiveIndex(index);
  };
  
  return (
    <section 
      className={`${bgClass} py-20 transition-colors duration-300`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className={`text-3xl font-bold mb-4 ${textClass}`}>What Our Students Say</h2>
          <p className={`text-lg max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Read success stories from students who have transformed their careers with our courses
          </p>
        </div>
        
        <div className="relative max-w-4xl mx-auto">
          {/* Quote icon */}
          <div className={`absolute top-0 left-0 transform -translate-x-6 -translate-y-6 text-6xl ${theme === 'dark' ? 'text-indigo-800' : 'text-indigo-200'}`}>
            "
          </div>
          
          {/* Testimonials */}
          <div className={`${styles.testimonialContainer} relative h-[300px] md:h-[240px]`}>
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`${styles.testimonial} absolute w-full transition-all duration-1000 ${
                  index === activeIndex ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-20'
                }`}
              >
                <div className={`${cardClass} rounded-xl p-8 shadow-lg`}>
                  <p className={`text-lg italic mb-6 ${textClass}`}>
                    {testimonial.content}
                  </p>
                  <div className="flex items-center">
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <div className={`font-bold ${textClass}`}>{testimonial.name}</div>
                      <div className={`text-sm ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}`}>
                        {testimonial.position} at {testimonial.company}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Indicators */}
          <div className={`${styles.indicators} flex justify-center mt-8 space-x-2`}>
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                  index === activeIndex
                    ? theme === 'dark' ? 'bg-indigo-500' : 'bg-indigo-600'
                    : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                }`}
                onClick={() => handleDotClick(index)}
                aria-label={`Testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        <div className="text-center mt-16">
          <button className={`${styles.enrollButton} px-8 py-4 ${
            theme === 'dark' 
              ? 'bg-indigo-600 hover:bg-indigo-700' 
              : 'bg-indigo-600 hover:bg-indigo-700'
          } text-white font-medium rounded-lg transition-colors duration-300`}>
            Start Learning Today
          </button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;