import gsap from "gsap";

export default class VideoBlock {
  static selector = ".carousel-video";

  constructor(element, options = {}) {
    this.element = element;
    this.options = options;

    this.elements();
    this.setup();
    this.interactions();
  }

  elements() {
    this.button = this.element.querySelector(".liquid-button");
    this.testimonial = this.element.querySelector(
      ".carousel-video-testimonial"
    );
    this.bg = this.element.querySelector(".carousel-background");
    this.img = this.element.querySelector(".carousel-thumbnail");
  }

  setup() {
    gsap.set(this.button, {
      opacity: 0,
    });
    gsap.set(this.img, {
      scale: 1.2,
    });
  }

  interactions() {
    this.element.addEventListener("mouseenter", () => {
      this.animateIn();
    });
    this.element.addEventListener("mouseleave", () => {
      this.animateOut();
    });
  }

  animateIn() {
    gsap.to(this.button, {
      opacity: 1,
      duration: 0.5,
      ease: "expo.in",
    });
    gsap.to(this.img, {
      scale: 1,
      duration: 3,
      delay: 0.2,
      ease: "expo.out",
    });
  }

  animateOut() {
    gsap.to(this.button, {
      opacity: 0,
      duration: 0.5,
      delay: 0.2,
      ease: "expo.out",
      overwrite: "auto",
    });
    gsap.killTweensOf(this.img);
    gsap.to(this.img, {
      scale: 1.2,
      duration: 3,
      ease: "expo.out",
      overwrite: "auto",
    });
  }
}
