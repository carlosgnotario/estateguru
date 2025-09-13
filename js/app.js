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

    gsap.to(".loader", {
        opacity: 0,
        duration: 1,
        delay: 0.5,
        ease: "expo.out",
        onComplete: () => {
            document.querySelector(".loader").style.display = "none";
            document.querySelector(".loader").style.visibility = "hidden";
        }
    })

    initializeClasses();
}

document.addEventListener('DOMContentLoaded', () => {
    init();

    document.querySelectorAll('.w-tabs').forEach(tabs => {
        tabs.querySelectorAll('.w-tab-menu > *').forEach((tab, index) => {
            tab.style.order = index;            
        });

        tabs.querySelectorAll('.w-tab-content > *').forEach((tab, index) => {
            tab.style.order = index;
        });

    });
});