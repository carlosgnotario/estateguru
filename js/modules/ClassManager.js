// Import classes
import VideoBlock from '../classes/VideoBlock.js';

// Make classes available globally
window.AppClasses = { VideoBlock };

// Initialize classes on DOM elements
export default function initializeClasses() {
  // VideoBlock on .carousel-video elements
  document.querySelectorAll(VideoBlock.selector).forEach((element, index) => {
    new VideoBlock(element, { index });
  });
}