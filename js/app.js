// Import the class manager
import initializeClasses from "./modules/ClassManager.js";
import Lenis from "lenis";
import gsap from "gsap";
import SplitText from "gsap/SplitText";
gsap.registerPlugin(SplitText);

function init() {
  const g = {};
  window.g = g;

  // g.lenis = new Lenis({
  //     autoRaf: true,
  //     autoResize: true,
  // });

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
      const firstWrapHeading = document.querySelector(
        ".wrap h1, .wrap h2, .wrap h3, .wrap h4, .wrap h5, .wrap h6"
      );
      const firstWrapText = document.querySelector(".wrap p");

      let splitText = new SplitText(firstWrapHeading, {
        type: "words",
        mask: "words",
      });

      splitText.words.forEach((word) => {
        word.style.paddingBottom = "0.1em"; // extra room for descenders
      });

      gsap.from(splitText.words, {
        opacity: 0,
        yPercent: 100,
        stagger: 0.1,
        delay: 0.2,
        clearProps: "transform, translate",
      });

      const skipAnimation =
        firstWrapText.parentNode.classList.contains("w-richtext");

      if (skipAnimation) return;

      gsap.from(firstWrapText, {
        opacity: 0,
        yPercent: 100,
        stagger: 0.1,
        delay: 0.5,
        clearProps: "transform, translate",
      });
    });
    loader();
  }

  const year = document.querySelectorAll('[data="year"]');

  const currentYear = new Date().getFullYear();
  year.innerHTML = currentYear;
});
