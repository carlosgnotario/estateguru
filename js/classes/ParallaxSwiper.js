import gsap from "gsap";
import Core from "smooothy";

export default class Swiper {
  static selector = ".swiper";

  constructor(element) {
    this.element = element;
    this.slides = [...element.querySelectorAll("[data-swiper]")];

    this.setup();
    this.dimensions();
    this.interaction();
    this.animation();
  }

  setup() {
    this.element.style.transformStyle = "preserve-3d";
    this.element.style.maxWidth = "95vw";
    this.handlePerspective();

    this.slides.forEach((slide) => {
      slide.loop = 0;
      slide.style.transformStyle = "preserve-3d";
      gsap.to(slide.querySelector(".swiper-slide-content"), {
        opacity: 0,
        y: 40,
      });
    });

    this.handleResize = () => {
      this.handlePerspective();
    };
    window.addEventListener("resize", this.handleResize);
  }

  handlePerspective() {
    this.element.style.perspective = "400px";
    if (window.innerWidth < 1300) {
      this.element.style.perspective = "700px";
    }

    if (window.innerWidth < 1100) {
      this.element.style.perspective = "1100px";
    }

    if (window.innerWidth < 900) {
      this.element.style.perspective = "2500px";
    }
  }

  dimensions() {
    this.width = this.element.offsetWidth;
    this.slideWidth = this.slides[0].offsetWidth;
    this.totalWidth = this.slideWidth * this.slides.length;
    this.centeringOffset = this.width / 2 - this.slideWidth / 2;
    this.slides.forEach((slide, index) => {
      slide.left = index * this.slideWidth;
    });
  }

  interaction() {
    this.isDragging = false;
    this.pos = {
      slide: 0,
      current: 0,
      previous: 0,
      difference: 0,
      stored: 0,
    };

    this.focusSlide(this.slides[0], true);

    this.element.addEventListener("mousedown", (e) => {
      this.pos.previous = e.clientX;
      this.pos.current = e.clientX;
      this.isDragging = true;
    });

    window.addEventListener("mousemove", (e) => {
      if (!this.isDragging) return;

      this.pos.current = e.clientX + this.pos.stored;
      this.pos.difference = this.pos.current - this.pos.previous;
    });

    window.addEventListener("mouseup", () => {
      if (!this.isDragging) return;

      this.pos.previous = this.pos.current;
      this.isDragging = false;
      this.slides.forEach((slide, index) => {
        if (
          index === this.pos.slide &&
          Math.abs(
            Math.round(this.pos.difference / this.slideWidth) %
              this.slides.length
          ) !== index
        ) {
          this.focusSlide(slide, false);
        } else if (
          Math.abs(
            Math.round(this.pos.difference / this.slideWidth) %
              this.slides.length
          ) === index
        ) {
          this.focusSlide(slide, true);
        }
      });

      this.pos.slide = Math.abs(
        Math.round(this.pos.difference / this.slideWidth) % this.slides.length
      );
      console.log(this.pos.slide);

      this.pos.difference = -this.pos.slide * this.slideWidth;
      this.pos.stored = this.pos.difference;
    });
  }

  animation() {
    gsap.ticker.add(() => {
      this.slides.forEach((slide, index) => {
        if (
          this.pos.difference +
            slide.left +
            this.centeringOffset +
            this.slideWidth +
            slide.loop * this.totalWidth <
          -this.totalWidth / 4
        ) {
          slide.loop += 1;
        }

        if (
          this.pos.difference +
            slide.left +
            this.centeringOffset +
            this.slideWidth +
            (slide.loop - 1) * this.totalWidth >
          -this.totalWidth / 4
        ) {
          console.log("return to view");
          slide.loop -= 1;
        }

        slide.positionX =
          this.centeringOffset +
          this.pos.difference +
          slide.loop * this.totalWidth;
        slide.scale =
          Math.abs(slide.positionX + slide.left - this.centeringOffset) /
          (this.width / 2);

        gsap.to(slide, {
          x:
            slide.positionX -
            ((slide.positionX + slide.left - this.centeringOffset) /
              (this.width / 2)) *
              400,
          z: 1 - slide.scale * 200,
        });
      });
    });
  }

  focusSlide(slide, entering = false) {
    if (entering) {
      gsap.to(slide.querySelector(".swiper-slide-content"), {
        opacity: 1,
        y: 0,
      });
    } else {
      gsap.to(slide.querySelector(".swiper-slide-content"), {
        opacity: 0,
        y: 40,
      });
    }
  }
}
