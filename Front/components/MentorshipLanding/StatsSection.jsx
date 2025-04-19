"use client";

import { useState, useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import styles from '../MentorshipLanding/styles/MentorshipLanding.module.css';
import { animateValue } from '../MentorshipLanding/utils/animationUtils';

const CounterCard = ({ icon, endValue, title, duration = 9000 }) => { // Increased duration to 5000ms
  const [count, setCount] = useState(0);
  const { theme } = useTheme();
  
  const cardBgClass = theme === 'dark' 
    ? 'bg-gray-800 border-gray-700' 
    : 'bg-white border-gray-200';
  
  const textColorClass = theme === 'dark' 
    ? 'text-gray-200' 
    : 'text-gray-800';
    
  const iconColorClass = theme === 'dark' 
    ? 'text-indigo-400' 
    : 'text-indigo-600';

  useEffect(() => {
    let startTimestamp;
    let animationFrameId;
    
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1); // Slower progress calculation
      
      setCount(Math.floor(progress * endValue));
      
      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };
    
    animationFrameId = requestAnimationFrame(step);
    
    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [endValue, duration]);

  return (
    <div className={`${styles.statsCard} ${cardBgClass} rounded-xl p-6 shadow-lg flex flex-col items-center justify-center border transition-all duration-300`}>
      <div className={`text-4xl mb-3 ${iconColorClass}`}>
        <ion-icon name={icon}></ion-icon>
      </div>
      <h2 className={`text-4xl md:text-5xl font-bold mb-2 ${textColorClass}`}>
        {count}+
      </h2>
      <p className={`text-lg font-medium ${textColorClass}`}>{title}</p>
    </div>
  );
};

const StatsSection = () => {
  const { theme } = useTheme();
  
  const sectionBgClass = theme === 'dark' 
    ? 'bg-[rgb(22,30,50)]' 
    : 'bg-gray-100';
  
  const textColorClass = theme === 'dark' 
    ? 'text-gray-200' 
    : 'text-gray-800';

  return (
    <section className={`${sectionBgClass} py-16 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl md:text-4xl font-bold text-center mb-4 ${textColorClass}`}>Our Impact in Numbers</h2>
        <p className={`text-lg text-center max-w-3xl mx-auto mb-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
          Join thousands of professionals who have advanced their careers through our mentorship programs
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <CounterCard 
            icon="school-outline" 
            endValue={1250} 
            title="Educators" 
          />
          <CounterCard 
            icon="business-outline" 
            endValue={780} 
            title="Companies" 
          />
          <CounterCard 
            icon="calendar-outline" 
            endValue={320} 
            title="Programs" 
          />
          <CounterCard 
            icon="people-outline" 
            endValue={2500} 
            title="Mentors" 
          />
        </div>
      </div>
    </section>
  );
};

export default StatsSection;