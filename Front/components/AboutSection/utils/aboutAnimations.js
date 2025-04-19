export const initializeAboutAnimations = () => {
    if (typeof window !== 'undefined' && window.ScrollReveal) {
      const sr = window.ScrollReveal({
        distance: '50px',
        duration: 1000,
        reset: true
      });
  
      sr.reveal('.section', { 
        delay: 300,
        origin: 'bottom',
        interval: 200
      });
  
      sr.reveal('.valueCard', { 
        delay: 500,
        origin: 'bottom',
        interval: 200
      });
  
      if (window.VanillaTilt) {
        window.VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
          max: 15,
          speed: 400,
          glare: true,
          'max-glare': 0.2
        });
      }
    }
  };