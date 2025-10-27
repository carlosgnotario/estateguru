// Import the class manager
import initializeClasses from "./modules/ClassManager.js";
import gsap from "gsap";

function init() {
  initializeClasses();
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("huh");
  
  init();  
});