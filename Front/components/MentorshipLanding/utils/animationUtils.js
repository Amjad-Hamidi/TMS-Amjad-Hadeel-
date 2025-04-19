/**
 * Starts a typing animation for placeholders
 * @param {HTMLElement} element - The input element to animate placeholder for
 */
export const startTypingAnimation = (element) => {
  if (!element) return;
    
  let i = 0;
  let placeholder = "";
  const txt = "example@domain.com";
  const speed = 150;
  
  const type = () => {
    if (i < txt.length) {
      placeholder += txt.charAt(i);
      element.setAttribute("placeholder", placeholder);
      i++;
      setTimeout(type, speed);
    }
  };
  
  setTimeout(type, 1600);
};

/**
 * Creates ScrollReveal animations
 */
export const initializeScrollRevealAnimations = () => {
  if (window.ScrollReveal) {
    const sr = window.ScrollReveal({ distance: "30px", easing: "ease-in" });
    
    sr.reveal(".title", {
      delay: 300,
      origin: "top",
    });
    
    sr.reveal(".paragraph", {
      delay: 800,
      origin: "top",
    });
    
    sr.reveal("#form", {
      delay: 1200,
      origin: "bottom",
    });
  }
};

/**
 * Handles email validation with visual feedback
 * @param {HTMLInputElement} element - Email input element
 * @returns {boolean} - Whether the email is valid
 */
export const validateEmail = (element) => {
  if (!element) return false;
  
  const emailValue = element.value;
  const mailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  
  if (emailValue === "") {
    element.style.outline = "none";
    return false;
  } else if (!mailRegex.test(emailValue)) {
    element.style.outline = "2px dotted rgb(117, 152, 242)";
    return false;
  } else {
    element.style.outline = "2px dotted rgb(118, 167, 63)";
    return true;
  }
};