"use client";

import { useState, useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import styles from '../MentorshipLanding/styles/MentorshipLanding.module.css';

const testimonials = [
  {
    id: 1,
    content: "The mentorship program completely transformed my career trajectory. In just six months, I've gained skills that would have taken years to develop on my own.",
    author: "Sarah Johnson",
    position: "Software Engineer at Google",
    avatar: "https://randomuser.me/api/portraits/women/32.jpg",
    rating: 5
  },
  {
    id: 2,
    content: "Finding a mentor in my field was a game-changer. The personalized guidance helped me navigate complex industry challenges and opened doors I didn't know existed.",
    author: "Michael Chen",
    position: "Marketing Director",
    avatar: "https://randomuser.me/api/portraits/men/39.jpg",
    rating: 5
  },
  {
    id: 3,
    content: "I was skeptical at first, but the structured approach to mentorship made all the difference. My mentor provided actionable feedback that directly improved my work.",
    author: "Priya Patel",
    position: "UX Designer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    rating: 4
  },
  {
    id: 4,
    content: "As someone transitioning careers, having an experienced mentor guide me through the process was invaluable. I'm now working in my dream role thanks to this program.",
    author: "James Wilson",
    position: "Data Scientist",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 5
  },
  {
    id: 5,
    content: "The mentorship program exceeded my expectations. The matching process paired me with someone whose experience aligned perfectly with my goals.",
    author: "Emma Rodriguez",
    position: "Product Manager",
    avatar: "https://randomuser.me/api/portraits/women/63.jpg",
    rating: 5
  }
];

const TestimonialCard = ({ testimonial, isActive }) => {
  const { theme } = useTheme();
  
  const cardBgClass = theme === 'dark' 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';
  
  const textClass = theme === 'dark' 
    ? 'text-gray-200' 
    : 'text-gray-800';
  
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <ion-icon 
          key={i} 
          name={i < rating ? "star" : "star-outline"}
          class={i < rating ? "text-yellow-400" : "text-gray-400"}
        ></ion-icon>
      );
    }
    return stars;
  };

  return (
    <div 
      className={`${cardBgClass} rounded-xl p-6 md:p-8 shadow-lg border transition-all duration-500 ${styles.testimonialCard} ${isActive ? styles.activeTestimonial : 'opacity-40 scale-90'}`}
    >
      <div className="flex flex-col h-full">
        <div className="mb-6 flex justify-start">
          {renderStars(testimonial.rating)}
        </div>
        
        <p className={`${textClass} text-lg mb-6 flex-grow italic`}>"{testimonial.content}"</p>
        
        <div className="flex items-center">
          <img 
            src={testimonial.avatar} 
            alt={testimonial.author} 
            className="w-12 h-12 rounded-full object-cover mr-4"
          />
          <div>
            <h4 className={`${textClass} font-bold`}>{testimonial.author}</h4>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
              {testimonial.position}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useTheme();
  const intervalRef = useRef(null);
  
  const sectionBgClass = theme === 'dark' 
    ? 'bg-[rgb(25,33,52)]' 
    : 'bg-gray-50';
  
  const textClass = theme === 'dark' 
    ? 'text-gray-200' 
    : 'text-gray-800';
  
  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };


  useEffect(() => {
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 5000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeIndex]);

 
  const handleMouseEnter = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleMouseLeave = () => {
    intervalRef.current = setInterval(() => {
      handleNext();
    }, 5000);
  };

  return (
    <section 
      className={`${sectionBgClass} py-16 transition-colors duration-300`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${textClass}`}>
            What Our Members Say
          </h2>
          <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} text-lg max-w-3xl mx-auto`}>
            Success stories from professionals who've transformed their careers through our mentorship program
          </p>
        </div>

       
        <div className="hidden md:block relative max-w-5xl mx-auto">
          <div className="flex transition-all duration-500">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`w-full transition-all duration-500 ${
                  Math.abs(index - activeIndex) <= 1 ? 'block' : 'hidden'
                }`}
                style={{
                  transform: `translateX(${(index - activeIndex) * 100}%)`,
                  opacity: index === activeIndex ? 1 : 0.7,
                  scale: index === activeIndex ? 1 : 0.95,
                }}
              >
                <TestimonialCard testimonial={testimonial} isActive={index === activeIndex} />
              </div>
            ))}
          </div>

          <button
            className={`absolute top-1/2 left-0 -translate-y-1/2 -translate-x-6 md:-translate-x-12 flex items-center justify-center w-10 h-10 rounded-full ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
            } shadow-lg text-2xl z-10 transition-all duration-300`}
            onClick={handlePrev}
            aria-label="Previous testimonial"
          >
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>
          
          <button
            className={`absolute top-1/2 right-0 -translate-y-1/2 translate-x-6 md:translate-x-12 flex items-center justify-center w-10 h-10 rounded-full ${
              theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-white hover:bg-gray-100'
            } shadow-lg text-2xl z-10 transition-all duration-300`}
            onClick={handleNext}
            aria-label="Next testimonial"
          >
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </button>
        </div>

      
        <div className="md:hidden">
          <TestimonialCard testimonial={testimonials[activeIndex]} isActive={true} />
        </div>

        
        <div className="flex justify-center mt-8 gap-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? theme === 'dark' ? 'bg-indigo-400' : 'bg-indigo-600' 
                  : theme === 'dark' ? 'bg-gray-600' : 'bg-gray-300'
              }`}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;