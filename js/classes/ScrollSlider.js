import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default class ScrollSlider {
    constructor(element) {
        this.element = element;
        this.init();
        gsap.registerPlugin(ScrollTrigger);
    }

    init() {
        this.elements();
        this.convertLottie();
        this.sizing();

        this.slides.forEach(slide => {
            gsap.set(slide, {
                autoAlpha: 0,
            });
        });
        this.currentSlide = null;   
    }

    convertLottie() {

    }

    sizing() {
        this.top = this.element.getBoundingClientRect().top + window.scrollY;
        this.height = this.element.getBoundingClientRect().height;
        console.log(this.top, this.height);
    }

    elements() {
        this.slides = this.element.querySelectorAll(".hiw-slide");
        this.slideBar = this.element.querySelector(".hiw-pagination-bar-nudge");
        this.numbers = this.element.querySelectorAll(".hiw-pagination-page");
        this.lotties = [];
        this.slides.forEach((el, i) => {
            el.lottie = el.querySelector("[data-animation-type='lottie'")
            el.lottieSrc = el.lottie.dataset.src;
            el.newElement = document.createElement('div');
            el.newElement.classList.add('lottie-container');
            el.lottie.parentElement.appendChild(el.newElement);
            

            el.lottie.remove();
        });

        this.lottiesLoaded = 0;

        this.slides.forEach((el, i) => {
            el.animation = lottie.loadAnimation({
                container: el.newElement,
                renderer: 'svg',
                loop: true,
                autoplay: false,
                path: el.lottieSrc
            });

            el.animation.addEventListener('DOMLoaded', () => {
                console.log("lotties loaded", this.lottiesLoaded);
                this.lottiesLoaded++;
                if (this.lottiesLoaded === this.slides.length) {
                    this.update();
                    this.changeSlide(0);
                }
            });
        });
    }

    update() {
        const sliderBarW = gsap.quickTo(this.slideBar, "widthPercent")
        
        ScrollTrigger.create({
            trigger: this.element,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            // markers: true,
            onUpdate: (self) => {
                if (this.currentSlide !== Math.min(Math.floor(self.progress * this.slides.length), this.slides.length - 1)) {
                    this.changeSlide(Math.min(Math.floor(self.progress * this.slides.length), this.slides.length - 1));
                }
                gsap.to(this.slideBar, {
                    width: Math.min(self.progress * this.slides.length * 25, 100) + "%",
                })
            }
        });

    }

    changeSlide(slide) {
        console.log("new slide", slide);
        if (this.currentSlide !== null) {
            // Old slide
            const oldSlide = this.slides[this.currentSlide];
            //
            const oldTL = gsap.timeline();
            oldTL.to(oldSlide, {
                autoAlpha: 0,
            });
    
            oldSlide.animation.pause();
        }
        const newSlide = this.slides[slide];
        
        // New slide
        const newTL = gsap.timeline();
        newTL.to(newSlide, {
            autoAlpha: 1,
        });
        newSlide.animation.play();
        
        this.currentSlide = slide;
        
        // Numbers
        this.numbers.forEach((el, i) => {
            if (i <= slide) {
                gsap.to(el, {
                    backgroundColor: "var(--_colors---brand-colors--brand-green)",
                    scale: 1.2
                })
                
            } else {
                gsap.to(el, {
                    backgroundColor: "var(--_colors---accent-colors--cosmos-blue)",
                    scale: 1
                })
            }
        });
    }
}