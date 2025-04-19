import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import styles from '../styles/CoursesPage.module.css';

const BannerSection = () => {
  const { theme } = useTheme();
  const bannerRef = useRef(null);
  const typingTextRef = useRef(null);
  
  useEffect(() => {
    if (!bannerRef.current) return;
    
    
    const handleMouseMove = (e) => {
      const moveX = (e.clientX) / 100;
      const moveY = (e.clientY) / 100;
      
      document.querySelectorAll(`.${styles.floatingIcon}`).forEach((icon, index) => {
        const speed = index % 3 === 0 ? 2 : index % 3 === 1 ? 1.5 : 1;
        icon.style.transform = `translate(${moveX * speed}px, ${moveY * speed}px)`;
      });
      
    
      const heroImage = document.querySelector(`.${styles.heroImage}`);
      if (heroImage) {
        heroImage.style.transform = `translate(${moveX * -1.5}px, ${moveY * -1.5}px)`;
      }
    };
    
   
    const startTypingAnimation = () => {
      if (!typingTextRef.current) return;
      
      const textElement = typingTextRef.current;
      const textToType = "Your Learning Journey Starts Here";
      let i = 0;
      textElement.textContent = "";
      
      const typeNextCharacter = () => {
        if (i < textToType.length) {
          if (textToType.substring(0, i + 1).endsWith("Journey")) {
          
            textElement.innerHTML = textToType.substring(0, i + 1) + "<br>";
          } else {
            textElement.innerHTML += textToType.charAt(i);
          }
          i++;
          setTimeout(typeNextCharacter, i === textToType.length ? 1000 : Math.random() * 100 + 50);
        } else {
         
          setTimeout(() => {
            textElement.classList.add(styles.highlightText);
          }, 500);
        }
      };
      
      typeNextCharacter();
    };
    
   
    const createParticles = () => {
      const particleContainer = document.querySelector(`.${styles.particlesContainer}`);
      if (!particleContainer) return;
      
     
      particleContainer.innerHTML = '';
      
      
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = styles.particle;
        
       
        const size = Math.random() * 8 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
     
        particle.style.animationDuration = `${Math.random() * 20 + 10}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particleContainer.appendChild(particle);
      }
    };
    
    bannerRef.current.addEventListener('mousemove', handleMouseMove);
    createParticles();
    startTypingAnimation();
    
    return () => {
      if (bannerRef.current) {
        bannerRef.current.removeEventListener('mousemove', handleMouseMove);
      }
    };
  }, []);
  
  return (
    <div 
      ref={bannerRef}
      className={`${styles.banner} relative overflow-hidden py-20 md:py-32 transition-colors duration-500`}
    >
     
      <div className={`absolute inset-0 ${
        theme === 'dark' 
          ? 'bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900' 
          : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-800'
      } ${styles.gradientAnimation}`}></div>
      
      <div className={`${styles.particlesContainer} absolute inset-0 pointer-events-none`}></div>
      
      
      <div className={`${styles.floatingElements} absolute inset-0 overflow-hidden pointer-events-none`}>
        <div className={`${styles.floatingIcon} ${styles.icon1} absolute top-[15%] left-[10%] w-16 h-16 text-indigo-300 opacity-60`}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,3L1,9L12,15L21,10.09V17H23V9M5,13.18V17.18L12,21L19,17.18V13.18L12,17L5,13.18Z" /></svg>
        </div>
        <div className={`${styles.floatingIcon} ${styles.icon2} absolute top-[25%] right-[15%] w-20 h-20 text-purple-300 opacity-50`}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,8L18,14H6M12,3A9,9 0 0,0 3,12A9,9 0 0,0 12,21A9,9 0 0,0 21,12A9,9 0 0,0 12,3Z" /></svg>
        </div>
        <div className={`${styles.floatingIcon} ${styles.icon3} absolute bottom-[30%] left-[20%] w-12 h-12 text-blue-300 opacity-60`}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6,2A4,4 0 0,1 10,6V8H14V6A4,4 0 0,1 18,2A4,4 0 0,1 22,6A4,4 0 0,1 18,10H16V14H18A4,4 0 0,1 22,18A4,4 0 0,1 18,22A4,4 0 0,1 14,18V16H10V18A4,4 0 0,1 6,22A4,4 0 0,1 2,18A4,4 0 0,1 6,14H8V10H6A4,4 0 0,1 2,6A4,4 0 0,1 6,2M16,18A2,2 0 0,0 18,20A2,2 0 0,0 20,18A2,2 0 0,0 18,16H16V18M14,10H10V14H14V10M6,16A2,2 0 0,0 4,18A2,2 0 0,0 6,20A2,2 0 0,0 8,18V16H6M8,6A2,2 0 0,0 6,4A2,2 0 0,0 4,6A2,2 0 0,0 6,8H8V6M18,8A2,2 0 0,0 20,6A2,2 0 0,0 18,4A2,2 0 0,0 16,6V8H18Z" /></svg>
        </div>
        <div className={`${styles.floatingIcon} ${styles.icon4} absolute bottom-[20%] right-[10%] w-14 h-14 text-pink-300 opacity-50`}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12,15C7.58,15 4,16.79 4,19V21H20V19C20,16.79 16.42,15 12,15M8,9A4,4 0 0,0 12,13A4,4 0 0,0 16,9M11.5,2C11.2,2 11,2.21 11,2.5V5.5H10V3C10,3 7.75,3.86 7.75,6.75C7.75,7.37 8.25,8.25 8.88,9.13C9.5,10 9.5,10.5 9.5,10.5C9.5,10.5 9,10.5 9,11H11.5V13C11.5,14.18 10.73,15 9.75,15H11.5V18.5C11.5,18.78 11.22,19 11,19H13C14.5,19 15.64,17.21 15.64,15.36V13.5C15.64,13.5 17.14,12.5 17.77,10.5H15.36V8.86C16.93,8.29 17.36,7.25 17.36,6.25C17.36,3.25 15,2 15,2H11.5Z" /></svg>
        </div>
        <div className={`${styles.floatingIcon} ${styles.icon5} absolute top-[40%] left-[30%] w-10 h-10 text-yellow-300 opacity-60`}>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.37,8.91L19.37,10.64L7.24,3.64L8.24,1.91L11.28,3.66L12.64,3.29L16.97,5.79L17.34,7.16L20.37,8.91M6,19V7H11.07L18,11V19A2,2 0 0,1 16,21H8A2,2 0 0,1 6,19Z" /></svg>
        </div>
      </div>
      
     
      <div className="container relative z-10 mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className={`${styles.mainHeading} mb-4`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2">
                <span className="block mb-4">Elevate Your Skills</span>
                <span ref={typingTextRef} className={`${styles.typingText} inline-block`}></span>
              </h1>
            </div>
            
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto lg:mx-0">
              Discover a comprehensive library of professional and technical courses designed to 
              help you reach your full potential and advance your career.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#courses-section" className={`${styles.primaryBtn} px-8 py-4 text-lg font-medium rounded-lg bg-white text-indigo-700 hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl`}>
                Explore Courses
              </a>
              <button className={`${styles.secondaryBtn} px-8 py-4 text-lg font-medium rounded-lg bg-transparent text-white border-2 border-white/80 hover:bg-white/10 transition-all shadow-lg group`}>
                <span>Watch Demo</span>
                <span className={`${styles.playIcon} ml-2 inline-flex items-center justify-center w-6 h-6 rounded-full bg-white text-indigo-700 group-hover:scale-110 transition-transform`}>
                  <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8,5.14V19.14L19,12.14L8,5.14Z" />
                  </svg>
                </span>
              </button>
            </div>
            
            <div className={`${styles.statsContainer} mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8 text-white max-w-2xl mx-auto lg:mx-0`}>
              <div className={`${styles.statItem} text-center`}>
                <div className="text-4xl font-bold">200+</div>
                <div className="text-sm mt-1 text-white/80">Expert Courses</div>
              </div>
              <div className={`${styles.statItem} text-center`}>
                <div className="text-4xl font-bold">50+</div>
                <div className="text-sm mt-1 text-white/80">Expert Instructors</div>
              </div>
              <div className={`${styles.statItem} text-center`}>
                <div className="text-4xl font-bold">15k+</div>
                <div className="text-sm mt-1 text-white/80">Active Learners</div>
              </div>
              <div className={`${styles.statItem} text-center`}>
                <div className="text-4xl font-bold">97%</div>
                <div className="text-sm mt-1 text-white/80">Success Rate</div>
              </div>
            </div>
          </div>
          
        
          <div className={`${styles.heroImageContainer} hidden lg:block relative`}>
            <div className={`${styles.heroImage} relative z-10`}>
              <img 
                src="https://images.unsplash.com/photo-1508830524289-0adcbe822b40?q=80&w=2025&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Students learning together" 
                className="rounded-lg shadow-2xl"
              />
              
              
              <div className={`${styles.floatingCard} ${styles.card1} absolute -top-10 -left-16 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl max-w-[200px]`}>
                <div className="flex items-center">
                  <div className="bg-green-500 p-2 rounded-full text-white mr-3">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                    </svg>
                  </div>
                  <p className="font-medium text-gray-800 dark:text-white">Certification Included</p>
                </div>
              </div>
              
              <div className={`${styles.floatingCard} ${styles.card2} absolute -bottom-8 -right-12 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl max-w-[220px]`}>
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-3">
                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/62.jpg" alt="" />
                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/men/32.jpg" alt="" />
                    <img className="w-8 h-8 rounded-full border-2 border-white" src="https://randomuser.me/api/portraits/women/44.jpg" alt="" />
                  </div>
                  <p className="font-medium text-gray-800 dark:text-white">Join 15,000+ students</p>
                </div>
              </div>
              
              <div className={`${styles.floatingCard} ${styles.card3} absolute top-1/2 -translate-y-1/2 -left-20 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-xl`}>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
                    </svg>
                  ))}
                  <span className="text-gray-800 dark:text-white font-medium ml-1">4.9</span>
                </div>
              </div>
            </div>
            
            
            <div className={`${styles.heroBgDecoration} absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-400 rounded-lg transform rotate-3 scale-105 -z-10`}></div>
          </div>
        </div>
      </div>
      
      
      <div className={`${styles.waveDivider} absolute bottom-0 left-0 w-full overflow-hidden leading-[0] ${theme === 'dark' ? 'text-[rgb(16,23,42)]' : 'text-gray-50'}`}>
        <svg className="relative block w-full h-[40px] md:h-[70px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" fill="currentColor"></path>
        </svg>
      </div>
    </div>
  );
};

export default BannerSection;