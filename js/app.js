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

    loader();
    initializeClasses();
}

function loader() {
    gsap.to(".loader", {
        opacity: 0,
        duration: 1.5,
        ease: "expo.out",
    })
    gsap.from(".header-nav > *", {
        opacity: 0,
        y: "1rem",
        stagger: 0.1,
        delay: 0.2
    })
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