// Import the class manager
import initializeClasses from './modules/ClassManager.js';
import Lenis from 'lenis';
import gsap from 'gsap';

function init() {
    const g = {};
    console.log(g);
    
    window.g = g;
    
    // g.lenis = new Lenis({
    //     autoRaf: true,
    //     autoResize: true,
    // });

    gsap.defaults({
        ease: "expo.out",
        duration: 1.2
    })

    initializeClasses();
}

document.addEventListener('DOMContentLoaded', () => {
    init();
});