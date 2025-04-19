"use client";

import { useTheme } from '@/context/ThemeContext';
import { useEffect, useRef } from 'react';
import styles from '../MentorshipLanding/styles/MentorshipLanding.module.css';

const CTASection = () => {
  const { theme } = useTheme();
  const sectionRef = useRef(null);
  
  useEffect(() => {
    
    if (sectionRef.current) {
      const setParallaxTransform = () => {
        const scrollPosition = window.scrollY;
        const elements = sectionRef.current.querySelectorAll('.parallax-element');
        
        elements.forEach((el) => {
          const speed = el.getAttribute('data-speed') || 0.05;
          const yPos = -(scrollPosition * speed);
          el.style.transform = `translateY(${yPos}px)`;
        });
      };
      
      window.addEventListener('scroll', setParallaxTransform);
      return () => window.removeEventListener('scroll', setParallaxTransform);
    }
  }, []);
  
  const isDark = theme === 'dark';
  
  return (
    <section 
      ref={sectionRef}
      className={`${styles.ctaSection} relative overflow-hidden py-24 transition-all duration-500`}
    >
     
      <div className={`absolute inset-0 ${isDark 
        ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-[#2d1b69]' 
        : 'bg-gradient-to-br from-indigo-600 via-purple-700 to-pink-600'}`}>
        
        
        <div className="absolute top-10 left-10 w-64 h-64 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 opacity-10 blur-3xl parallax-element" data-speed="0.03"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 rounded-full bg-gradient-to-r from-purple-400 to-pink-500 opacity-10 blur-3xl parallax-element" data-speed="0.05"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 rounded-full bg-gradient-to-r from-teal-400 to-green-500 opacity-10 blur-3xl parallax-element" data-speed="0.07"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-6 md:px-8 text-center">
       
        <div className={`${styles.highlight} mx-auto mb-6 py-2 px-4 rounded-full inline-block ${
          isDark ? 'bg-indigo-800/50' : 'bg-indigo-500/30'
        }`}>
          <span className="text-white font-medium text-sm md:text-base">
            Limited Chances to connect with TOP Companies 
          </span>
        </div>
        
       
        <h2 className={`${styles.ctaHeading} text-3xl md:text-5xl font-bold text-white mb-6 leading-tight`}>
          Accelerate Your <span className={styles.ctaGradientText}>Professional Growth</span> Today
        </h2>
        
        <p className="text-white/90 text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
          Join thousands of Juniors and Students  who have transformed their careers through personalized mentorship. 
          Our platform connects you with industry experts who guide you toward success.
        </p>
        
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <button className={`${styles.primaryBtn} w-full sm:w-auto px-8 py-4 text-lg font-medium rounded-lg ${
            isDark ? 'bg-white text-indigo-800' : 'bg-white text-indigo-600'
          } shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group`}>
            <span>Find a Program or Course </span>
            <ion-icon name="arrow-forward-outline" class={`${styles.btnIcon}`}></ion-icon>
          </button>
          
          <button className={`${styles.secondaryBtn} w-full sm:w-auto px-8 py-4 text-lg font-medium rounded-lg bg-transparent text-white border-2 border-white hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 group`}>
            <span>Provide a Program </span>
            <ion-icon name="person-add-outline" class={`${styles.btnIcon}`}></ion-icon>
          </button>
        </div>
        
       
        <div className={`${styles.trustIndicators} mt-16 flex flex-wrap justify-center gap-8 text-sm text-white`}>
          <div className={`${styles.trustItem} flex items-center`}>
            <div className={`${styles.iconCircle} flex items-center justify-center w-10 h-10 rounded-full ${
              isDark ? 'bg-indigo-800/50' : 'bg-indigo-500/30'
            } mr-3`}>
              <ion-icon name="checkmark-outline" class="text-xl"></ion-icon>
            </div>
            <span>7-day free trial</span>
          </div>
          
          <div className={`${styles.trustItem} flex items-center`}>
            <div className={`${styles.iconCircle} flex items-center justify-center w-10 h-10 rounded-full ${
              isDark ? 'bg-indigo-800/50' : 'bg-indigo-500/30'
            } mr-3`}>
              <ion-icon name="card-outline" class="text-xl"></ion-icon>
            </div>
            <span>No credit card required</span>
          </div>
          
          <div className={`${styles.trustItem} flex items-center`}>
            <div className={`${styles.iconCircle} flex items-center justify-center w-10 h-10 rounded-full ${
              isDark ? 'bg-indigo-800/50' : 'bg-indigo-500/30'
            } mr-3`}>
              <ion-icon name="shield-checkmark-outline" class="text-xl"></ion-icon>
            </div>
            <span>Cancel anytime</span>
          </div>
        </div>
        
      
        <div className={`${styles.scrollIndicator} text-white/50 absolute bottom-6 left-1/2 transform -translate-x-1/2`}>
          <ion-icon name="chevron-down-outline" class="text-2xl"></ion-icon>
        </div>
      </div>
    </section>
  );
};

export default CTASection;