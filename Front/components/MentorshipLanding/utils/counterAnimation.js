
export const animateCounter = (startValue, endValue, setValueFunction, duration = 2000) => {
    if (startValue === endValue) return;
    
    const stepTime = Math.abs(Math.floor(duration / (endValue - startValue)));
    let current = startValue;
    
    const timer = setInterval(() => {
      current += 1;
      setValueFunction(current);
      
      if (current === endValue) {
        clearInterval(timer);
      }
    }, stepTime);
    
    return () => clearInterval(timer);
  };
 
  export const createScrollTrigger = (element, callback, options = { threshold: 0.2 }) => {
    if (!element) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          callback();
          observer.unobserve(element);
        }
      },
      options
    );
    
    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  };