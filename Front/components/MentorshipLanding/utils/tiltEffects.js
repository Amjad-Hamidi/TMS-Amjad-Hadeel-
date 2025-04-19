/**
 * Initializes the tilt effect on elements with the data-tilt attribute
 */
export const initializeTiltEffect = () => {
  if (window.VanillaTilt && document.querySelectorAll("[data-tilt]").length > 0) {
    window.VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
      maxTilt: 20,
      perspective: 1000,
      easing: "cubic-bezier(.03,.98,.52,.99)",
      scale: 1.05,
      speed: 300,
      transition: true,
      glare: true,
      maxGlare: 0.3
    });
  }
};

/**
 * Reset the tilt effect on a specific element
 * @param {HTMLElement} element - The element to reset tilt on
 */
export const resetTilt = (element) => {
  if (window.VanillaTilt && element) {
    window.VanillaTilt.reset.call(element);
  }
};

/**
 * Destroy the tilt effect on a specific element
 * @param {HTMLElement} element - The element to destroy tilt on
 */
export const destroyTilt = (element) => {
  if (window.VanillaTilt && element) {
    window.VanillaTilt.destroy.call(element);
  }
};