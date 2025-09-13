import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default class Animations {
	static selector = '[data-animation]';
	
	constructor(element) {
		this.element = element;
        this.type = element.dataset.animation;
		
        if (this.type === "fade") {
            this.fade();
        } else if (this.type === "staggered" || this.type === "stagger") {
            this.staggered();
        }
	}

    fade() {
        const heading = this.element.querySelector("h1, h2, h3, h4, h5, h6");
        const text = this.element.querySelector("p");

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: this.element,
                start: "top 60%",
                markers: true
            }
        });

        tl.from(this.element, {
            opacity: 0,
            y: "3rem",
            duration: 1.5,
            ease: "expo.out"
        })
        tl.from(heading, {  
            opacity: 0,
            y: "3rem",
            duration: 1.5,
            ease: "expo.out"
        }, 0)
        tl.from(text, {
            opacity: 0,
            y: "3rem",
            duration: 1.5,
            ease: "expo.out"
        }, 0.5)
        tl.from(this.element.querySelector("a"), {
            opacity: 0,
            y: "3rem",
            duration: 0,
            ease: "none"
        }, 2)
    }

    staggered() {
        console.log("twice");
        
        const targets = this.element.querySelectorAll("[data-target]");

        targets.forEach((target, index) => {
            if (target.children.length === 0) {
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: this.element,
                        start: "top 60%",
                        markers: true
                    }
                });
                tl.from(target, {
                    opacity: 0,
                    y: "3rem",
                    duration: 1.5,
                    ease: "expo.out"
                })
            } else {
                const items = target.children;
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: this.element,
                        start: "top 60%",
                        markers: true
                    }
                });
    
                const staggerTerms = target.dataset.swiper === "videos" ? (i, target, list) => { const pairIndex = Math.min(i, len - 1 - i); return pairIndex * 0.2; } : 0.1
    
                tl.from(items, {
                    opacity: 0,
                    duration: 1.5,
                    y: "3rem",
                    ease: "expo.out",
                    stagger: {
                        each: 0.1,
                        from: target.dataset.swiper === "videos" ? Math.round(items.length * 0.5) : (target.dataset.target === "center" ? "center" : "start")
                    }
                }, index * 0.2)
            }
        });
    }
}
