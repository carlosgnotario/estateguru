// Import classes
import VideoBox from '../classes/VideoBox.js';
import VideoCarousel from '../classes/VideoCarousel.js';
import VideoFAQ from '../classes/VideoFAQ.js';

// Make classes available globally
window.AppClasses = { VideoBox, VideoCarousel, VideoFAQ };

// Initialize classes on DOM elements
export default function initializeClasses() {
  // VideoBlock on .carousel-video elements
  document.querySelectorAll(VideoBox.selector).forEach((element, index) => {
    new VideoBox(element, { index });
  });
  
  // VideoCarousel on elements matching selector
  document.querySelectorAll(VideoCarousel.selector).forEach((element, index) => {
    new VideoCarousel(element, { index });
  });

  document.querySelectorAll(VideoFAQ.selector).forEach((element, index) => {
    new VideoFAQ(element, { index });
  });
}