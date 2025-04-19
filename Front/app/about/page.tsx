"use client";
import 'ionicons';

import { useEffect, useRef, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import { CaretBack, CaretForward } from 'react-ionicons';
import styles from '@/components/AboutSection/styles/About.module.css';
import { initializeAboutAnimations } from '@/components/AboutSection/utils/aboutAnimations';
import TeamCard from '@/components/AboutSection/TeamCard';

type CardRef = HTMLDivElement | null;

const AboutPage = () => {
  const { theme } = useTheme();
  const sliderRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<CardRef[]>([]);
  const currentIndexRef = useRef(0);

  const setCardRef = useCallback((index: number) => (el: HTMLDivElement | null) => {
    cardsRef.current[index] = el;
  }, []);

  useEffect(() => {
    initializeAboutAnimations();
  }, []);

  const missionRef = useRef(null);
  const isMissionInView = useInView(missionRef, { once: true, margin: "-100px" });

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  
  const teamData = [
    { 
      title: 'Lead Trainers',
      imageSrc:"https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/2d022825-47f9-4e6a-bc97-14b47dc3242f"
      ,
      description: 'Full-stack developer with 8+ years experience in mentoring'
    },
    { 
      title: 'UX Specialists',
      imageSrc: 'https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/331836c0-0d28-48d1-a1c2-b5f5db87fe17',
      description: 'Creating intuitive interfaces since 2016'
    },
    { 
      title: 'Cloud Architects',
      imageSrc: 'https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/fd1d57e3-de8a-438a-9e9a-952ae65a776e',
      description: 'AWS certified solutions architect'
    },
    { 
      title: 'Career Coaches',
      imageSrc: 'https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/d49bdb0f-c717-4063-abe4-869cb3bc8b4e',
      description: 'Helped 200+ students land tech jobs'
    },
    { 
      title: 'AI Experts',
      imageSrc: 'https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/69fb8584-66a0-4ecd-bae5-dd00015a1ad5',
      description: 'Machine learning specialist & researcher'
    },
    { 
      title: 'Mobile Developers',
      imageSrc: 'https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/2d022825-47f9-4e6a-bc97-14b47dc3242f',
      description: 'Flutter & React Native guru'
    }
  ];

 
  const scrollToCard = (index: number) => {
    if (!sliderRef.current || !cardsRef.current[index]) return;
    
    const cardWidth = cardsRef.current[index]!.offsetWidth + 40;
    const scrollPosition = cardWidth * index;
    
    sliderRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  const handlePrevClick = () => {
    currentIndexRef.current = Math.max(currentIndexRef.current - 1, 0);
    scrollToCard(currentIndexRef.current);
  };

  const handleNextClick = () => {
    currentIndexRef.current = Math.min(currentIndexRef.current + 1, cardsRef.current.length - 1);
    scrollToCard(currentIndexRef.current);
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gray-50'}`}>
      <main className="container mx-auto px-4 py-12">
      
      <motion.section 
          ref={missionRef}
          initial="hidden"
          animate={isMissionInView ? "visible" : "hidden"}
          transition={{ staggerChildren: 0.2 }}
          className={`${styles.heroSection} mb-20 relative`}
        >
          <div className="relative z-10 overflow-hidden">
            <motion.h1 
              variants={textVariants}
              className={`${styles.heading} text-gray-100`}
            >
              <span className={styles.gradientText}>Our Mission</span> at ChanceBridge
            </motion.h1>
            
            <motion.p 
              variants={textVariants}
              className={`${styles.paragraph} text-gray-200`}
            >
              We strive to empower individuals through cutting-edge training programs that bridge the gap between education and industry needs.
            </motion.p>
          </div>
        </motion.section>

        <section className={`${styles.section} mb-20`}>
          <div className="grid md:grid-cols-3 gap-8">
            {['Excellence', 'Creativity', 'Collaboration'].map((value, index) => (
              <div 
                key={index}
                className={`${styles.valueCard} px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-6 rounded-xl shadow-lg transition-all hover:transform hover:-translate-y-2`}
              >
                <h3 className={`text-2xl font-bold mb-4 ${theme === 'dark' ? 
                  'text-white' : 'text-purple-600'}`}>
                  {value}
                </h3>
                <p className="text-base leading-relaxed">
                  {index === 0 && 'We strive for excellence in all the training content we provide.'}
                  {index === 1 && 'We encourage creative thinking and innovative problem-solving.'}
                  {index === 2 && 'We believe in the power of teamwork and the sharing of experiences.'}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* قسم الفريق مع السلايدر */}
        <section className={`${styles.section} py-16`}>
          <h2 className={`text-3xl md:text-4xl font-bold text-center mb-12 ${theme === 'dark' ? 
            'text-gray-100' : 'text-gray-800'}`}>
            Our Great Team
          </h2>
          
          <div 
            ref={sliderRef}
            className="slider flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full py-5 no-scrollbar touch-pan-x"
          >
            {teamData.map((member, index) => (
              <TeamCard 
                key={index}
                ref={setCardRef(index)}       
                         {...member}
                
                // theme={theme}
              />
            ))}
          </div>

      
          <div className="flex justify-center gap-4 mt-8">
            <button 
              onClick={handlePrevClick}
              className="bg-gradient-to-b from-purple-500 to-pink-500 p-3 rounded-full text-white shadow-lg hover:scale-110 transition-all"
            >
              <CaretBack
                color={'#fff'}
                height="24px"
                width="24px"
              />
            </button>
            <button 
              onClick={handleNextClick}
              className="bg-gradient-to-b from-purple-500 to-pink-500 p-3 rounded-full text-white shadow-lg hover:scale-110 transition-all"
            >
              <CaretForward
                color={'#fff'}
                height="24px"
                width="24px"
              />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;