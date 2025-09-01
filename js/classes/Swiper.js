import gsap from "gsap"

export default class Swiper {
	static selector = '[data-swiper]';
	
	constructor(element) {
		this.element = element;
		this.slides = [...element.querySelectorAll(':scope > *, :scope > .swiper-slide')];
		this.images = element.querySelectorAll('img');		
		// get sibling previous element .controls 
		if (element.parentElement.querySelector(".controls")) {
			this.controls = element.parentElement.querySelector(".controls")
		}
		
		
    	this.type = element.dataset.swiper;

		this.setup();
		// trigger this only once when all images are loaded unless it has no images
		if (this.type === "carousel") {
			// check if all images are loaded only once
			let imagesLoaded = 0;
			this.images.forEach(image => {
				image.onload = () => {
					imagesLoaded++;
					if (imagesLoaded === this.images.length) {
						this.dimensions();
					}
				}
			})
		} else {
			this.dimensions();
		}

		if (this.type !== "carousel") {
			this.interaction();
			this.animation();
			
		} else {
			this.carouselAnim();
		}
	}

	setup() {
		// Variables
		this.isDragging = false;
		this.pos = {
			lerp: 0,
			slide: 0,
			current: 0,
			previous: 0,
			difference: 0,
			stored: 0
		}

		this.slides.forEach((slide) => {
			slide.loop = 0;
		})

		if (this.type === "parallax") {
			this.element.style.transformStyle = 'preserve-3d';
			this.element.style.perspective = '400px';

			this.slides.forEach((slide) => {
				slide.style.transformStyle = 'preserve-3d';
				gsap.to(slide.querySelector(".swiper-slide-content"), {
					opacity: 0,
					y: 40
				})
			})

			// Initialize
			this.focusSlide(this.slides[0], true)
		}
	}

	dimensions() {
		this.width = this.element.offsetWidth;
		this.slideWidth = this.slides[0].offsetWidth;
		this.totalWidth = 0;
		this.slides.forEach((el, i) => {
			this.totalWidth += el.offsetWidth;			
		});
		
		this.centeringOffset = this.type === "timeline" ? 0 : this.width / 2 - this.slideWidth / 2;
		this.slides.forEach((slide, index) => {
			slide.left = index * this.slideWidth;			
		})
		
	}

	interaction() {
		if (this.controls) {
			this.changeSlide();

			this.controls.querySelector(".next").addEventListener("click", () => {
				if (this.pos.slide < this.slides.length - 1) {
					this.pos.slide += 1;
					this.changeSlide()
					
				}				
			})
			this.controls.querySelector(".prev").addEventListener("click", () => {
				if (this.pos.slide > 0) {
					this.pos.slide -= 1;
					this.changeSlide()
				}
			})
			
		}
		this.element.addEventListener("mousedown", (e) => {
			this.pos.previous = e.clientX
			this.pos.current = e.clientX
			this.isDragging = true;			
		})

		window.addEventListener("mousemove", (e) => {
			if (!this.isDragging) return;
			
			this.pos.current = e.clientX + this.pos.stored;
			this.pos.difference = this.pos.current - this.pos.previous;
			
		})

		window.addEventListener("mouseup", () => {
			if (!this.isDragging) return;
			
			this.pos.previous = this.pos.current;
			this.isDragging = false;

			if (this.type === "parallax") {
				this.slides.forEach((slide, index) => {
					if (index === this.pos.slide && Math.abs(Math.round(this.pos.difference / this.slideWidth) % this.slides.length) !== index) {
						this.focusSlide(slide, false)
					} else if (Math.abs(Math.round(this.pos.difference / this.slideWidth) % this.slides.length) === index) {
						this.focusSlide(slide, true)
					}
				})

				this.pos.slide = Math.abs(Math.round(this.pos.difference / this.slideWidth) % this.slides.length);
			} else {
				this.pos.slide = Math.min(Math.max(Math.round(this.pos.difference / this.slideWidth) * -1, 0), this.slides.length - 1);				
			}
			
			this.pos.difference = -this.pos.slide * this.slideWidth;
			this.pos.stored = this.pos.difference;

			
		})
	}

	changeSlide() {
		if (this.controls) {
			if (this.pos.slide === 0) {
				gsap.to(this.controls.querySelector(".prev"), {
					opacity: 0.2,
					duration: 1.2
				})
			} else if (this.pos.slide === this.slides.length - 1) {
				gsap.to(this.controls.querySelector(".next"), {
					opacity: 0.2,
					duration: 1.2
				})
			} else {
				gsap.to(this.controls.querySelector(".prev"), {
					opacity: 1,
					duration: 1.2
				})
				gsap.to(this.controls.querySelector(".next"), {
					opacity: 1,
					duration: 1.2
				})
			}
		}
		this.pos.difference = -this.pos.slide * this.slideWidth;
	}

	animation() {
		gsap.ticker.add(() => {
			if (this.type === "carousel") {
				this.pos.lerp -= 1;
			} else {
				this.pos.lerp += (this.pos.difference - this.pos.lerp) * 0.05;
			}

			this.slides.forEach((slide, index) => {
				if (this.type !== "timeline") {

					if (this.pos.difference + slide.left + this.centeringOffset + this.slideWidth + (slide.loop * this.totalWidth) < -this.totalWidth / 4) {
						slide.loop += 1
					}
	
					if (this.pos.difference + slide.left + this.centeringOffset + this.slideWidth + (slide.loop - 1) * this.totalWidth > -this.totalWidth / 4) {
						slide.loop -= 1
					}
				}
				
				slide.positionX = this.centeringOffset + this.pos.difference + (slide.loop * this.totalWidth);
				slide.scale = Math.abs(slide.positionX + slide.left - this.centeringOffset) / (this.width / 2);

				if (this.type === "parallax") {
					gsap.to(slide, {
						x: slide.positionX - ((slide.positionX + slide.left - this.centeringOffset) / (this.width / 2)) * 400,
						z: 1 - slide.scale * 200,
						ease: "power1.out",
						duration: 0.5
					})
				} else {
					gsap.set(slide, {
						x: this.centeringOffset + this.pos.lerp + (slide.loop * this.totalWidth)
					})
				}
			})
		})
	}

	carouselAnim() {
		// return
		gsap.ticker.add(() => {
			this.pos.lerp -= 1;
			this.slides.forEach((slide, index) => {
				
				if (slide.left + slide.offsetWidth + this.pos.lerp + slide.loop * this.totalWidth < 0) {
					slide.loop += 1;					
				}

				gsap.set(slide, {
					x: this.pos.lerp + (slide.loop * this.totalWidth)
				})
			})

		})
		
	}

	focusSlide(slide, entering = false) {
		if (entering) {
			gsap.to(slide.querySelector(".swiper-slide-content"), {
				opacity: 1,
				y: 0
			})
		} else {
			gsap.to(slide.querySelector(".swiper-slide-content"), {
				opacity: 0,
				y: 40
			})
		}
	}
}
