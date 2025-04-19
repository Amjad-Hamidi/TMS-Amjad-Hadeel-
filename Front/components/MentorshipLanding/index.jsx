"use client";
import 'ionicons';

import { useEffect, useState, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import Head from 'next/head';
import { initializeTiltEffect } from './utils/tiltEffects';
import { startTypingAnimation, initializeScrollRevealAnimations } from './utils/animationUtils';
import styles from './styles/MentorshipLanding.module.css';
import StatsSection from '../MentorshipLanding/StatsSection';
import TestimonialsSection from '../MentorshipLanding/TestimonialsSection';
import CTASection from '../MentorshipLanding/CTASection';
const MentorshipLanding = () => {
  const { theme } = useTheme();
  const [subscribed, setSubscribed] = useState(false);
  const sliderRef = useRef(null);
  const cardsRef = useRef([]);
  const currentIndexRef = useRef(0);
  const emailRef = useRef(null);

  useEffect(() => {
    const loadScripts = async () => {
      const scrollRevealScript = document.createElement('script');
      scrollRevealScript.src = 'https://unpkg.com/scrollreveal@4.0.9/dist/scrollreveal.min.js';
      scrollRevealScript.async = true;
      document.body.appendChild(scrollRevealScript);

      const vanillaTiltScript = document.createElement('script');
      vanillaTiltScript.src = 'https://unpkg.com/vanilla-tilt@1.8.0/dist/vanilla-tilt.min.js';
      vanillaTiltScript.async = true;
      document.body.appendChild(vanillaTiltScript);

      const ioniconsScript = document.createElement('script');
      ioniconsScript.src = 'https://cdn.jsdelivr.net/npm/ionicons@7.1.0/dist/ionicons/ionicons.esm.js';
      ioniconsScript.type = 'module';
      document.body.appendChild(ioniconsScript);

      const ioniconsNomoduleScript = document.createElement('script');
      ioniconsNomoduleScript.src = 'https://cdn.jsdelivr.net/npm/ionicons@7.1.0/dist/ionicons/ionicons.js';
      ioniconsNomoduleScript.noModule = true;
      document.body.appendChild(ioniconsNomoduleScript);

      return new Promise((resolve) => {
        vanillaTiltScript.onload = () => {
          resolve();
        };
      });
    };

    loadScripts().then(() => {
      initializeTiltEffect();
      initializeScrollRevealAnimations();
      startTypingAnimation(emailRef.current);

      if (sliderRef.current) {
        const cards = document.querySelectorAll('.card');
        cardsRef.current = Array.from(cards);
      }
    });

    return () => {
      document.querySelectorAll('script[src*="unpkg.com"]').forEach((script) => {
        document.body.removeChild(script);
      });
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailValue = emailRef.current.value;
    const mailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (mailRegex.test(emailValue)) {
      setSubscribed(true);

      setTimeout(() => {
        const cardContainer = document.getElementById("card-container");
        if (cardContainer) {
          cardContainer.scrollIntoView({ behavior: 'smooth' });
        }
      }, 1700);
    } else {
      alert("Oops! Please check your email");
    }
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    const mailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

    if (emailValue === "") {
      e.target.style.outline = "none";
    } else if (!mailRegex.test(emailValue)) {
      e.target.style.outline = "2px dotted rgb(117, 152, 242)";
    } else {
      e.target.style.outline = "2px dotted rgb(118, 167, 63)";
    }
  };

  const scrollToCard = (index) => {
    if (!sliderRef.current || cardsRef.current.length === 0) return;

    if (index < 0) index = 0;
    if (index > cardsRef.current.length - 1) index = cardsRef.current.length - 1;

    currentIndexRef.current = index;

    const card = cardsRef.current[index];
    const cardWidth = card.offsetWidth + 40; 
    const scrollPosition = cardWidth * index;

    sliderRef.current.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  };

  const handlePrevClick = () => {
    scrollToCard(currentIndexRef.current - 1);
  };

  const handleNextClick = () => {
    scrollToCard(currentIndexRef.current + 1);
  };

  const handleTouchStart = (e) => {
    if (!sliderRef.current) return;

    window.startX = e.touches[0].pageX - sliderRef.current.offsetLeft;
    window.scrollLeft = sliderRef.current.scrollLeft;
  };

  const handleTouchMove = (e) => {
    if (!sliderRef.current || !window.startX) return;

    const x = e.touches[0].pageX - sliderRef.current.offsetLeft;
    const walk = (x - window.startX) * 2; 
    sliderRef.current.scrollLeft = window.scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    if (!sliderRef.current || !cardsRef.current.length) return;

    window.startX = null;

    const scrollPosition = sliderRef.current.scrollLeft;
    const cardWidth = cardsRef.current[0].offsetWidth + 40; 
    const cardIndex = Math.round(scrollPosition / cardWidth);
    scrollToCard(cardIndex);
  };

  const homeBackground = theme === 'dark' 
    ? 'bg-[rgb(16,23,42)]' 
    : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500';
  
  const cardContainerBackground = theme === 'dark'
    ? 'bg-[rgb(16,23,42)]'
    : 'bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500';

  const textColor = theme === 'dark' ? 'text-gray-200' : 'text-white';
  const cardTextColor = theme === 'dark' ? 'text-gray-200' : 'text-white';

  return (
    <>
      <Head>
        <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;500;600;700;800&family=Tilt+Neon&display=swap" rel="stylesheet" />
      </Head>

      <section className={`grid grid-cols-1 md:grid-cols-2 place-items-center gap-5 md:gap-12 ${homeBackground} overflow-hidden pt-10 pb-16 md:pb-32 px-8 md:px-20`}>
        <div className={`description order-2 md:order-1 text-center md:text-left ${textColor} px-0 md:px-12`}>
          <h1 className="font-tilt-neon text-4xl md:text-5xl lg:text-6xl leading-tight mb-8">
            <span className={styles.gradientText}>Grow Professionally</span> with ChanceBridge 
          </h1>
          <p className="font-nunito text-base md:text-lg leading-relaxed mb-8">
            In a world filled with opportunities, having an Internship or Training  can make all the
            difference. Explore why people turn to this invaluable resource to
            unlock their potential.
          </p>
          {!subscribed ? (
            <form 
              id="form" 
              className="flex flex-col sm:flex-row items-center sm:items-start justify-center md:justify-start gap-6 sm:gap-2"
              onSubmit={handleSubmit}
              autoComplete="off"
            >
              <input
                type="email"
                id="email-id"
                name="email_address"
                aria-label="email address"
                placeholder=""
                ref={emailRef}
                required
                onChange={handleEmailChange}
                className="bg-transparent border-0 border-b-2 border-white/30 text-white/70 text-base font-medium px-2 py-1 focus:outline-2 focus:outline-dotted focus:outline-blue-400 focus:border-transparent"
              />
              <button 
                type="submit" 
                className="flex items-center justify-center gap-1 bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 bg-[length:200%_auto] bg-left hover:bg-right text-white font-medium rounded px-4 py-3 shadow-lg transition-all duration-300"
                aria-label="submit"
              >
                <span>Subscribe</span>
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </button>
            </form>
          ) : (
            <p className="text-3xl font-medium text-green-500">Subscribed! 🎉</p>
          )}
        </div>

        <div className="users-color-container order-1 md:order-2 grid grid-cols-4 grid-rows-3 gap-5">
          <span className={`${styles.item} ${theme === 'light' ? styles.lightBlue : ''} max-w-[200px] aspect-square rounded-tl-full rounded-tr-full rounded-br-none rounded-bl-full shadow-lg`} style={{"--i": 1}}></span>
          <div className={`${styles.item} max-w-[200px] aspect-square rounded-tl-full rounded-tr-full rounded-br-none rounded-bl-none shadow-lg`} style={{"--i": 2}}>
            <div className="w-full h-full rounded-tl-full rounded-tr-full rounded-br-none rounded-bl-none overflow-hidden">
              <img 
                src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/274f29ce-0d3f-4ac2-a2aa-f9b7bd188b2a"
                alt=""
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            </div>
          </div>
          <span className={`${styles.item} ${theme === 'light' ? styles.lightGreen : ''} max-w-[200px] aspect-square rounded-full shadow-lg`} style={{"--i": 3}}></span>
          <div className={`${styles.item} max-w-[200px] aspect-square rounded-bl-full shadow-lg`} style={{"--i": 4}}>
            <div className="w-full h-full rounded-bl-full overflow-hidden">
              <img 
                src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/b8a14493-3d9f-4b9b-b93a-56d0bc7243e9"
                alt=""
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            </div>
          </div>
          <div className={`${styles.item} max-w-[200px] aspect-square rounded-full shadow-lg`} style={{"--i": 10}}>
            <div className="w-full h-full rounded-full overflow-hidden">
              <img 
                src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/03e51e1e-9750-45a5-b75e-a1e341d4562a"
                alt=""
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            </div>
          </div>
          <span className={`${styles.item} ${theme === 'light' ? styles.lightYellow : ''} max-w-[200px] aspect-square rounded-tr-full rounded-br-full rounded-bl-full shadow-lg`} style={{"--i": 11}}></span>
          <div className={`${styles.item} max-w-[200px] aspect-square rounded-tl-full shadow-lg`} style={{"--i": 12}}>
            <div className="w-full h-full rounded-tl-full overflow-hidden">
              <img 
                src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/5eb50f89-3e5a-480e-860c-8d40d3ba9ffe"
                alt=""
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            </div>
          </div>
          <span className={`${styles.item} ${theme === 'light' ? styles.lightIndigo : ''} max-w-[200px] aspect-square rounded-tl-full rounded-tr-full rounded-bl-full shadow-lg`} style={{"--i": 5}}></span>
          <span className={`${styles.item} ${theme === 'light' ? styles.lightPink : ''} max-w-[200px] aspect-square rounded-tr-full rounded-br-full shadow-lg`} style={{"--i": 9}}></span>
          <div className={`${styles.item} max-w-[200px] aspect-square rounded-tl-full rounded-bl-full bg-[#fe7519] shadow-lg`} style={{"--i": 8}}>
            <div className="w-full h-full rounded-tl-full rounded-bl-full overflow-hidden">
              <img 
                src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/86c71a79-2efe-4567-8665-b1e5a1fd9735"
                alt=""
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            </div>
          </div>
          <span className={`${styles.item} ${theme === 'light' ? styles.lightPurple : ''} max-w-[200px] aspect-square rounded-tl-full rounded-tr-full rounded-bl-full shadow-lg`} style={{"--i": 7}}></span>
          <div className={`${styles.item} max-w-[200px] aspect-square rounded-tr-full rounded-br-full rounded-bl-full bg-[#8071a8] shadow-lg`} style={{"--i": 6}}>
            <div className="w-full h-full rounded-tr-full rounded-br-full rounded-bl-full overflow-hidden">
              <img 
                src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/97ef9643-5202-41aa-80f0-ceeabccdd099"
                alt=""
                className="w-full h-full object-cover pointer-events-none select-none"
              />
            </div>
          </div>
        </div>
      </section>
      <StatsSection />
      <section id="card-container" className={`flex flex-col items-center justify-center gap-5 w-full min-h-screen ${cardContainerBackground} overflow-hidden py-16 px-4 md:px-12`}>
        <div 
          ref={sliderRef}
          className="slider flex overflow-x-auto snap-x snap-mandatory scroll-smooth w-full py-5 no-scrollbar touch-pan-x"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="card max-w-[300px] aspect-[3/5] rounded-xl mx-5 overflow-hidden border-t border-l border-white/70 shadow-lg cursor-grab snap-start flex-shrink-0" data-tilt>
            <div className={`${styles.content} relative h-full grid grid-cols-1 grid-rows-9 p-5 bg-gray-600/50 select-none`}>
              <div className="aspect-[3/2] rounded-lg row-span-4 mb-5 overflow-hidden">
                <img 
                  src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/10088b1a-c0aa-42a9-8dff-1a692eb597d6"
                  alt=""
                  className="w-full h-full object-cover shadow-md"
                />
              </div>
              <h1 className={`text-xl ${cardTextColor} text-center row-span-1`}>Personalized Opportunities </h1>
              <p className={`text-base font-normal ${cardTextColor} row-span-3`}>
                Whether you are pursuing a career change, entrepreneurship, or
                personal development, guiding you to a training that will  offers substantial advice and
                support to navigate your unique path.
              </p>
              <button className="btn btn-grad bg-gradient-to-r from-gray-100 to-white text-black shadow-sm p-2 rounded text-sm font-normal row-span-1 mx-auto mt-1 mb-2 flex items-center gap-1">
                <span>Learn More</span>
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </button>
            </div>
          </div>

          <div className="card max-w-[300px] aspect-[3/5] rounded-xl mx-5 overflow-hidden border-t border-l border-white/70 shadow-lg cursor-grab snap-start flex-shrink-0" data-tilt>
            <div className={`${styles.content} relative h-full grid grid-cols-1 grid-rows-9 p-5 bg-gray-600/50 select-none`}>
              <div className="aspect-[3/2] rounded-lg row-span-4 mb-5 overflow-hidden">
                <img 
                  src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/69fb8584-66a0-4ecd-bae5-dd00015a1ad5"
                  alt=""
                  className="w-full h-full object-cover shadow-md"
                />
              </div>
              <h1 className={`text-xl ${cardTextColor} text-center row-span-1`}>Accelerated Growth</h1>
              <p className={`text-base font-normal ${cardTextColor} row-span-3`}>
                With a mentor, you can fast-track your journey to success. Benefit
                from their experience and tap into their knowledge, helping you
                avoid common pitfalls.
              </p>
              <button className="btn btn-grad bg-gradient-to-r from-gray-100 to-white text-black shadow-sm p-2 rounded text-sm font-normal row-span-1 mx-auto mt-1 mb-2 flex items-center gap-1">
                <span>Learn More</span>
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </button>
            </div>
          </div>

          <div className="card max-w-[300px] aspect-[3/5] rounded-xl mx-5 overflow-hidden border-t border-l border-white/70 shadow-lg cursor-grab snap-start flex-shrink-0" data-tilt>
            <div className={`${styles.content} relative h-full grid grid-cols-1 grid-rows-9 p-5 bg-gray-600/50 select-none`}>
              <div className="aspect-[3/2] rounded-lg row-span-4 mb-5 overflow-hidden">
                <img 
                  src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/d49bdb0f-c717-4063-abe4-869cb3bc8b4e"
                  alt=""
                  className="w-full h-full object-cover shadow-md"
                />
              </div>
              <h1 className={`text-xl ${cardTextColor} text-center row-span-1`}>Inspiration & Motivation</h1>
              <p className={`text-base font-normal ${cardTextColor} row-span-3`}>
               Real stories of success can be a powerful source of inspiration. A place where you and others who seres the same goal can 
               share your experiences and motivate each other.

              </p>
              <button className="btn btn-grad bg-gradient-to-r from-gray-100 to-white text-black shadow-sm p-2 rounded text-sm font-normal row-span-1 mx-auto mt-1 mb-2 flex items-center gap-1">
                <span>Learn More</span>
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </button>
            </div>
          </div>

          <div className="card max-w-[300px] aspect-[3/5] rounded-xl mx-5 overflow-hidden border-t border-l border-white/70 shadow-lg cursor-grab snap-start flex-shrink-0" data-tilt>
            <div className={`${styles.content} relative h-full grid grid-cols-1 grid-rows-9 p-5 bg-gray-600/50 select-none`}>
              <div className="aspect-[3/2] rounded-lg row-span-4 mb-5 overflow-hidden">
                <img 
                  src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/fd1d57e3-de8a-438a-9e9a-952ae65a776e"
                  alt=""
                  className="w-full h-full object-cover shadow-md"
                />
              </div>
              <h1 className={`text-xl ${cardTextColor} text-center row-span-1`}>Networking & Connections</h1>
              <p className={`text-base font-normal ${cardTextColor} row-span-3`}>
                ChanceBridge can open doors to valuable connections and
                opportunities. They can introduce you to their network and help
                you build meaningful relationships.
              </p>
              <button className="btn btn-grad bg-gradient-to-r from-gray-100 to-white text-black shadow-sm p-2 rounded text-sm font-normal row-span-1 mx-auto mt-1 mb-2 flex items-center gap-1">
                <span>Learn More</span>
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </button>
            </div>
          </div>

          <div className="card max-w-[300px] aspect-[3/5] rounded-xl mx-5 overflow-hidden border-t border-l border-white/70 shadow-lg cursor-grab snap-start flex-shrink-0" data-tilt>
            <div className={`${styles.content} relative h-full grid grid-cols-1 grid-rows-9 p-5 bg-gray-600/50 select-none`}>
              <div className="aspect-[3/2] rounded-lg row-span-4 mb-5 overflow-hidden">
                <img 
                  src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/331836c0-0d28-48d1-a1c2-b5f5db87fe17"
                  alt=""
                  className="w-full h-full object-cover shadow-md"
                />
              </div>
              <h1 className={`text-xl ${cardTextColor} text-center row-span-1`}>Expert Insights</h1>
              <p className={`text-base font-normal ${cardTextColor} row-span-3`}>
                Gain access to industry insights and expert knowledge that you
                won't find in textbooks. Your journy  can provide practical wisdom
                that textbooks can't teach.
              </p>
              <button className="btn btn-grad bg-gradient-to-r from-gray-100 to-white text-black shadow-sm p-2 rounded text-sm font-normal row-span-1 mx-auto mt-1 mb-2 flex items-center gap-1">
                <span>Learn More</span>
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </button>
            </div>
          </div>

          <div className="card max-w-[300px] aspect-[3/5] rounded-xl mx-5 overflow-hidden border-t border-l border-white/70 shadow-lg cursor-grab snap-start flex-shrink-0" data-tilt>
            <div className={`${styles.content} relative h-full grid grid-cols-1 grid-rows-9 p-5 bg-gray-600/50 select-none`}>
              <div className="aspect-[3/2] rounded-lg row-span-4 mb-5 overflow-hidden">
                <img 
                  src="https://github.com/ecemgo/mini-samples-great-tricks/assets/13468728/2d022825-47f9-4e6a-bc97-14b47dc3242f"
                  alt=""
                  className="w-full h-full object-cover shadow-md"
                />
              </div>
              <h1 className={`text-xl ${cardTextColor} text-center row-span-1`}>Confidence & Self-Esteem</h1>
              <p className={`text-base font-normal ${cardTextColor} row-span-3`}>
                you can meet a mentor  who can help you build confidence in your abilities and
                decisions. Their support can boost your self-esteem and help you
                believe in yourself.
              </p>
              <button className="btn btn-grad bg-gradient-to-r from-gray-100 to-white text-black shadow-sm p-2 rounded text-sm font-normal row-span-1 mx-auto mt-1 mb-2 flex items-center gap-1">
                <span>Learn More</span>
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </button>
            </div>
          </div>
        </div>

        <ul className="flex items-center justify-center list-none gap-4">
          <li 
            id="prev-btn"
            className="flex items-center justify-center bg-gradient-to-b from-green-400 to-blue-500 p-3 rounded-full text-2xl text-white cursor-pointer shadow-lg relative hover:before:opacity-100"
            onClick={handlePrevClick}
          >
            <ion-icon name="caret-back-outline"></ion-icon>
          </li>
          <li 
            id="next-btn"
            className="flex items-center justify-center bg-gradient-to-b from-green-400 to-blue-500 p-3 rounded-full text-2xl text-white cursor-pointer shadow-lg relative hover:before:opacity-100"
            onClick={handleNextClick}
          >
            <ion-icon name="caret-forward-outline"></ion-icon>
          </li>
        </ul>
      </section>
      <TestimonialsSection />
      <CTASection />
    </>
  );
};

export default MentorshipLanding;