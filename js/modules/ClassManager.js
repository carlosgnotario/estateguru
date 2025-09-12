// Import classes
import VideoBlock from '../classes/VideoBlock.js';
import Swiper from '../classes/Swiper.js';
import Cards from '../classes/Card.js';
import FAQ from '../classes/FAQ.js';
import HeaderScroll from '../classes/HeaderScroll.js';

// Make classes available globally
window.AppClasses = { VideoBlock, Swiper, Cards, FAQ, HeaderScroll };

// Initialize classes on DOM elements
export default function initializeClasses() {
  // VideoBlock on .carousel-video elements
  document.querySelectorAll(VideoBlock.selector).forEach((element, index) => {
    new VideoBlock(element, { index });
  });

  // Swiper on .swiper elements
  document.querySelectorAll(Swiper.selector).forEach((element, index) => {
    // timeout if swiper selector dataset type is resources
    if (element.dataset.swiper === "resources") {
      setTimeout(() => {
        new Swiper(element, { index });
      }, 1000);
    } else {
      new Swiper(element, { index });
    }
  });

  // Card on .card elements
  document.querySelectorAll(Cards.selector).forEach((element, index) => {
    new Cards(element, { index });
  });

  // FAQ on .faq elements
  document.querySelectorAll(FAQ.selector).forEach((element, index) => {
    new FAQ(element, { index });
  });

  // HeaderScroll on [data-header-scroll] elements
  document.querySelectorAll(HeaderScroll.selector).forEach((element, index) => {
    new HeaderScroll(element, { index });
  });
}