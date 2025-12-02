import gsap from "gsap";

export default class VideoCarousel {
	static selector = "#video-carousel";

	constructor(element, options = {}) {
		this.element = element;
		this.currentSlide = null;
		this.videoOpen = false;
		this.isMobile = window.innerWidth < 992;
		
		this.elements();
		this.binds();
		this.sizing();
		this.setupSlide();
		//
		this.changeSlide(this.currentSlide ?? 0);

		window.addEventListener("resize", () => {
			if (!this.isMobile && window.innerWidth < 992) {
				this.isMobile = true;
				this.sizing();
				this.changeSlide(this.currentSlide ?? 0);
			} else if (this.isMobile && window.innerWidth >= 992) {
				this.isMobile = false;
				this.sizing();
				this.changeSlide(this.currentSlide ?? 0);
			}
		});
	}

	elements() {
		this.items = this.element.querySelectorAll(".video-carousel-item");
		this.wrap = this.element.querySelector(".video-carousel-wrap");
		this.list = this.element.querySelector(".video-carousel-list");

	}

	sizing() {
		this.carouselWidth = this.wrap.offsetWidth;
		this.carouselHeight = this.wrap.offsetHeight;
		this.gap = 18;
		this.gapTotals = this.gap * 4;
		this.maxVisibleItems = Math.min(this.items.length % 2 === 0 ? this.items.length - 1 : this.items.length, 5);
		

		
		this.minItemWidth = 84;
		gsap.set(this.items, {
			width: this.isMobile ? this.carouselWidth : this.minItemWidth,
		})
		this.maxItemWidth = this.isMobile ? 410 : 913;
		this.offset = this.carouselWidth / 2 - this.maxItemWidth / 2;
		
		gsap.set(this.wrap, {
			height: this.isMobile ?
				this.convertToRem(this.isMobile ? this.minItemWidth * (this.maxVisibleItems - 1) + this.maxItemWidth + this.gap * (this.maxVisibleItems - 1) : this.carouselHeight) :
				"auto"
			,
		})
		this.items.forEach((item, index) => {
			gsap.set(item.text, {
				writingMode: this.isMobile ? "horizontal-tb" : "sideways-lr",
			})
		})
		this.wrap.nextElementSibling.style.maxWidth = this.isMobile ? this.carouselWidth : this.convertToRem(this.maxItemWidth);
	}

	binds() {
		this.items.forEach((item, index) => {
			item.addEventListener("click", () => {
				if (index != this.currentSlide) {
					!this.sliding && this.changeSlide(index);
				} else {
					this.openVideo(index);
				}
				
			});
		});

		const next = document.querySelector(".controls-next");
		const prev = document.querySelector(".controls-prev");
		prev.addEventListener("click", () => {
			!this.sliding && this.changeSlide(this.currentSlide - 1);
		});
		next.addEventListener("click", () => {
			!this.sliding && this.changeSlide(this.currentSlide + 1);
		});
	}

	setupSlide() {
		const half = Math.min(2, Math.floor(this.items.length / 2));

		this.items.forEach((item, i) => {
			item.previousIndex = ((i + half) % this.items.length + this.items.length) % this.items.length;
			item.text = item.querySelector(".video-carousel-item-text");
			item.img = item.querySelector(".video-carousel-item-img");
			item.button = [item.querySelector(".video-lightbox-circle"), item.querySelector(".video-lightbox-icon")];
			item.getVideo = item.dataset.video;			
		});
	}

	convertToRem(value) {
		const fontSize = getComputedStyle(this.wrap).fontSize;
		const fontSizePixels = parseFloat(fontSize);
		
		return value / 16 + "em";
	}

	changeSlide(index) {
		this.sliding = true;
		const normalIndex = ((index % this.items.length) + this.items.length) % this.items.length;		
		const maxVisibleItems = Math.min(this.items.length % 2 === 0 ? this.items.length - 1 : this.items.length, 5);
		const half = Math.min(2, Math.floor(maxVisibleItems / 2));		
		const previousIndex = this.items[normalIndex].previousIndex;
		const distance = previousIndex - half;
		const left = distance < 0;

		this.items.forEach((item, i) => {
			let itemIndex = ((i - normalIndex + half) % this.items.length + this.items.length) % this.items.length; 
			let animateFrom = item.previousIndex;	

			// Check for previous index overflow
			if (animateFrom > maxVisibleItems - 1 && itemIndex >= 0 && left) {
				animateFrom = itemIndex + distance;	
			}

			// Responsive
			if (this.isMobile) {
				gsap.set(item, {
					overwrite: true,
					y: this.convertToRem(animateFrom * (this.minItemWidth + this.gap) + (animateFrom > half ? this.maxItemWidth - this.minItemWidth : 0)),
					x: 0,
					width: "100%",
					autoAlpha: (animateFrom > maxVisibleItems - 1 || animateFrom < 0) ? 0 : 1,
					overwrite: true,
				})
				gsap.to(item, {
					y: this.convertToRem((animateFrom - distance) * (this.minItemWidth + this.gap) + (animateFrom - distance > half ? this.maxItemWidth - this.minItemWidth : 0)),
					height: this.convertToRem(itemIndex === half ? this.maxItemWidth : this.minItemWidth),
					width: "100%",
					autoAlpha: (animateFrom - distance > maxVisibleItems - 1 || animateFrom - distance < 0) ? 0 : 1,
					backgroundColor: getComputedStyle(item).getPropertyValue(itemIndex === half ? "--bgMain" : Math.abs(itemIndex - half) === 1 ? "--bgSecondary" : "--bgTertiary"),
					onComplete: () => {
						gsap.set(item, {
							y: this.convertToRem(itemIndex * (this.minItemWidth + this.gap) + (itemIndex > half ? this.maxItemWidth - this.minItemWidth : 0)),
						})
						gsap.to(item, {
							autoAlpha: (itemIndex > maxVisibleItems - 1 || itemIndex < 0) ? 0 : 1,
						})
					}
				})
			} else {
				gsap.set(item, {
					overwrite: true,
					x: this.convertToRem(animateFrom * (this.minItemWidth + this.gap) + (animateFrom > half ? this.maxItemWidth - this.minItemWidth : 0)),
					autoAlpha: (animateFrom > maxVisibleItems - 1 || animateFrom < 0) ? 0 : 1,
					overwrite: true,
					y: 0,
				})
				gsap.to(item, {
					x: this.convertToRem((animateFrom - distance) * (this.minItemWidth + this.gap) + (animateFrom - distance > half ? this.maxItemWidth - this.minItemWidth : 0)),
					width: this.convertToRem(itemIndex === half ? this.maxItemWidth : this.minItemWidth),
					height: 36.25 - Math.abs(half - itemIndex) * this.carouselHeight / 160 + "rem",
					autoAlpha: (animateFrom - distance > maxVisibleItems - 1 || animateFrom - distance < 0) ? 0 : 1,
					backgroundColor: getComputedStyle(item).getPropertyValue(itemIndex === half ? "--bgMain" : Math.abs(itemIndex - half) === 1 ? "--bgSecondary" : "--bgTertiary"),
					onComplete: () => {
						gsap.set(item, {
							x: this.convertToRem(itemIndex * (this.minItemWidth + this.gap) + (itemIndex > half ? this.maxItemWidth - this.minItemWidth : 0)),
						})
						gsap.to(item, {
							autoAlpha: (itemIndex > maxVisibleItems - 1 || itemIndex < 0) ? 0 : 1,
						})
					}
				})
			}

			// Store position
			item.previousIndex = itemIndex;
		});

		// Animation
		// Previous Slide
		if (this.currentSlide !== null) {
			const prevTL = gsap.timeline();			
			const prevSlide = this.items[this.currentSlide];
			
			this.closeVideo();
			prevTL.to(prevSlide.text, {
				overwrite: true,
				autoAlpha: 0,
				duration: 0.2,
				onComplete: () => {
					prevSlide.classList.remove("active");
				}
			})
			gsap.set(prevSlide.img, {
				autoAlpha: 0,
			})
			prevTL.to(prevSlide.text, {
				writingMode: this.isMobile ? "horizontal-tb" : "sideways-lr",
				autoAlpha: 1,
			}, 1)			
			prevTL.to(prevSlide.button, {
				autoAlpha: 0,
				overwrite: true,
				duration: 0.2,
			}, 0)
		}

		// Current Slide
		const currentTL = gsap.timeline();
		const currentSlide = this.items[normalIndex];
		gsap.set(currentSlide.img, {
			autoAlpha: 1,
			scale: 1.4,
			clipPath: 
			this.isMobile ? 
				left ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)" :
				left ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)",
		})
		currentTL.to(currentSlide.text, {
			autoAlpha: 0,
			duration: 0.2,
			onComplete: () => {
				currentSlide.classList.add("active");
			}
		})
		setTimeout(() => {
			this.sliding = false;
		}, 1000);
		
		currentTL.to(currentSlide.text, {
			writingMode: "horizontal-tb",
			autoAlpha: 1,
		}, 1)
		currentTL.to(currentSlide.img, {
			scale: 1,
			clipPath: "inset(0% 0% 0% 0%)",
			duration: 0.5,
		}, 0)
		currentTL.to(currentSlide.button, {
			autoAlpha: 1,
		},1)

		// Equalize
		this.currentSlide = normalIndex;
	}

	openVideo(index) {
		if (this.videoOpen) return;
		this.videoOpen = true;
		this.video?.remove();
		const currentSlide = this.items[index];
		// Create div and append it to the currentSlide
		this.video = document.createElement("div");
		this.video.classList.add("video-carousel-item-video");
		currentSlide.append(this.video);

		// Add video to the videoDiv
		if (currentSlide.getVideo.includes("youtube")) {
			this.video.innerHTML = `
				<iframe src="https://www.youtube.com/embed/${currentSlide.getVideo.split("v=")[1]}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
			`;
		} else if (currentSlide.getVideo.includes("vimeo")) {
			this.video.innerHTML = `
				<iframe src="https://player.vimeo.com/video/${currentSlide.getVideo.split("vimeo.com/")[1]}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
			`;
		}
	}

	closeVideo() {
		if (!this.videoOpen) return;
		this.videoOpen = false;
		this.video?.remove();
		this.video = null;
	}
}

