// Import the class manager
import initializeClasses from "./modules/ClassManager.js";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";

// Filter out console logs from GTM and VM contexts
(function() {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;
  
  const filterGTM = (...args) => {
    const stack = new Error().stack;
    const message = args.join(' ');
    gsap.registerPlugin(CustomEase) 

    gsap.defaults({
      ease: CustomEase.create("custom", "M0,0 C0.128,0.022 -0.188,1 1,1 "),
      duration: 1
    })
    
    if (!stack) return true;
    
    // Check stack trace for GTM, VM, Cloudflare, or normal?lang=auto
    if (stack.includes('gtm.js') || 
        stack.includes('VM') || 
        stack.includes('normal?lang=auto') ||
        stack.includes('challenges.cloudflare.com') ||
        stack.includes('cdn-cgi') ||
        stack.includes('turnstile')) {
      return; // Skip these logs
    }
    
    // Also check message content for Cloudflare URLs
    if (message.includes('challenges.cloudflare.com') || 
        message.includes('normal?lang=auto') ||
        message.includes('cdn-cgi')) {
      return; // Skip these logs
    }
    
    return true;
  };
  
  console.log = function(...args) {
    if (filterGTM(...args)) {
      originalLog.apply(console, args);
    }
  };
  
  console.warn = function(...args) {
    if (filterGTM(...args)) {
      originalWarn.apply(console, args);
    }
  };
  
  console.error = function(...args) {
    if (filterGTM(...args)) {
      originalError.apply(console, args);
    }
  };

  // Create a css variable to detect 100vw minus scrollbar and make it responsive
  window.addEventListener('resize', () => {
    calcVw();
  });
  calcVw();

  function calcVw() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty('--vw', `calc(100vw - ${scrollbarWidth}px)`);
  }

})();

function init() {
  initializeClasses();
}

document.addEventListener("DOMContentLoaded", () => {
  init();  
});