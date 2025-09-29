// Import the class manager
import initializeClasses from "./modules/ClassManager.js";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
gsap.registerPlugin(SplitText);

function init() {
  const g = {};
  window.g = g;

  gsap.defaults({
    ease: "expo.out",
    duration: 1.2,
  });

  initializeClasses();
}

function loader() {
  gsap.to(".loader", {
    opacity: 0,
    duration: 1.5,
    ease: "expo.out",
  });
  gsap.from(".header-nav > *", {
    opacity: 0,
    y: "1rem",
    stagger: 0.1,
    delay: 0.2,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  init();  

  document.querySelectorAll(".w-tabs").forEach((tabs) => {
    tabs.querySelectorAll(".w-tab-menu > *").forEach((tab, index) => {
      tab.style.order = index;
    });

    tabs.querySelectorAll(".w-tab-content > *").forEach((tab, index) => {
      tab.style.order = index;
    });
  });

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => {      
      const firstWrapLabel = document.querySelector(".wrap .label");
      const firstHeroImage = document.querySelector(".wrap .media-block-img");
      const firstWrapHeading = document.querySelector(
        ".wrap h1, .wrap h2, .wrap h3, .wrap h4, .wrap h5, .wrap h6"
      );
      const firstWrapText = document.querySelector(".wrap p");
      const firstWrapButton = document.querySelector(".wrap .button");

      let splitText = new SplitText(firstWrapHeading, {
        type: "words",
        mask: "words",
      });

      splitText.words.forEach((word) => {
        word.style.paddingBottom = "0.1em"; // extra room for descenders
      });

      gsap.set(splitText.words, {
        opacity: 0,
        yPercent: 100,
      });

      if (firstWrapLabel) {
        gsap.from(firstWrapLabel, {
          opacity: 0,
          yPercent: 100,
          delay: 0.2,
          clearProps: "transform, translate",
        });
      }

      if (firstHeroImage) {
        gsap.from(firstHeroImage, {
          opacity: 0,
          delay: 0.5,
          clearProps: "transform, translate",
        });
      }

      if (firstWrapButton) {
        gsap.from(firstWrapButton, {
          opacity: 0,
          yPercent: 100,
          delay: 0.5,
          clearProps: "transform, translate",
        });
      }

      gsap.to(splitText.words, {
        opacity: 1,
        yPercent: 0,
        stagger: 0.1,
        delay: 0.2,
        clearProps: "transform, translate",
      });
      loader();
      
      // if (firstwrap text exists and parentNode.classList.contains("w-richtext")) {
      if (firstWrapText && firstWrapText.parentNode.classList.contains("w-richtext")) {
        return;
      }

      gsap.from(firstWrapText, {
        opacity: 0,
        yPercent: 100,
        stagger: 0.1,
        delay: 0.5,
        clearProps: "transform, translate",
      });
    });
  }

  const year = document.querySelectorAll('[data="year"]');

  const currentYear = new Date().getFullYear();
  year.innerHTML = currentYear;
});

// Force close Webflow dropdowns on page show (back/forward navigation)
window.addEventListener('pageshow', function(event) {
  // Check if page was restored from bfcache
  if (event.persisted || (window.performance && window.performance.navigation.type === 2)) {
    // Remove w--open class from all dropdown elements
    const openDropdowns = document.querySelectorAll('.w--open');
    openDropdowns.forEach(function(element) {
      element.classList.remove('w--open');
    });
    
    // Close any open dropdown toggles
    const dropdownToggles = document.querySelectorAll('[data-w-id]');
    dropdownToggles.forEach(function(toggle) {
      if (toggle.classList.contains('w--open')) {
        toggle.classList.remove('w--open');
      }
    });
    
    // Reset any navigation overlays
    const navOverlays = document.querySelectorAll('.w-nav-overlay');
    navOverlays.forEach(function(overlay) {
      overlay.style.display = 'none';
      overlay.classList.remove('w--open');
    });
  }
});
