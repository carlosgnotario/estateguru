import gsap from "gsap"

export default class Swiper {
	static selector = '[data-swiper]';
	
	constructor(element) {
		this.element = element;
		//check if mobile with coarse method
		this.isMobile = window.matchMedia('(pointer: coarse)').matches;

		this.slides = [...this.element.querySelectorAll(':scope > .swiper-slide')].length 
			? [...this.element.querySelectorAll(':scope > .swiper-slide')] 
			: [...this.element.children];
		
		
		// Options depending on type
    	this.type = element.dataset.swiper;
		this.options = { loop: false, draggable: false, autoplay: false, controls: false, clickable: false, parallax: false, snap: false }

		// Configuration map for different swiper types
		const typeConfigs = {
			loop: { loop: true, swipable: true },
			resources: { loop: true, swipable: true, snap: true },
			videos: { loop: true, swipable: true, clickable: true, snap: true, controls: true },
			parallax: { loop: true, autoplay: true, parallax: true, snap: true },
			carousel: { loop: true, autoplay: true },
			timeline: { swipable: true, controls: true, snap: true }
		};

		// Apply configuration based on type
		if (typeConfigs[this.type]) {
			Object.assign(this.options, typeConfigs[this.type]);
		}
		
		this.setup();
		this.dimensions();
		if (this.options.swipable) {
			this.swiping();
		}
		if (this.options.controls) {
			this.controlling();
		}
		if (this.options.clickable) {
			this.clicking();
		}
		this.update();
		
		// Add resize event listener
		this.handleResize = () => {
			this.calculateDimensions();
		};
		window.addEventListener('resize', this.handleResize);
	}

	setup() {
		// Variables
		this.isSwiping = false;
		this.pos = { lerp: 0, slide: 0, current: 0, previous: 0, difference: 0, stored: 0, clickable: true }
		
		this.slides.forEach(slide => { slide.loop = 0; })

		if (this.options.parallax) {
			this.element.style.transformStyle = 'preserve-3d';
			this.element.style.perspective = '400px';

			this.slides.forEach(slide => {
				// slide.style.transformStyle = 'preserve-3d';
				gsap.to(slide.querySelector(".swiper-slide-content"), { opacity: 0, y: 40 })
			})
		}

		if (this.options.controls) {
			this.controls = this.element.closest(".wrap").querySelector(".controls");
		}
	}

	dimensions() {
		// Calculate dimensions first
		this.calculateDimensions();	

		// Handle image loading for carousel and parallax types
		if (this.element.querySelectorAll('img').length > 0) {
			let imagesLoaded = 0;
			const images = this.element.querySelectorAll('img');
			
			// If no images, skip the loading check
			if (images.length === 0) {
				return;
			}
			
			const checkImageLoaded = (image) => {
				imagesLoaded++;
				if (imagesLoaded === images.length) {
					// Recalculate dimensions after all images are loaded
					setTimeout(() => {
						this.calculateDimensions();
					}, this.type === "resources" ? 1000 : 0);
				}
			};
			
			images.forEach(image => {
				// Check if image is already loaded
				if (image.complete && image.naturalHeight !== 0) {
					checkImageLoaded(image);
				} else {
					// Set up event handlers for images that aren't loaded yet
					image.onload = () => checkImageLoaded(image);
					image.onerror = () => {
						console.warn('Image failed to load:', image.src);
						checkImageLoaded(image); // Still count it to prevent infinite waiting
					};
				}
			});
		}
	}

	calculateDimensions() {		
		this.slideWidth = this.slides[0].offsetWidth;
		
		this.swiperWidth = Math.min(this.slideWidth * this.slides.length, document.body.offsetWidth);
		this.centeringOffset = (this.options.loop || this.type === "carousel") ? this.swiperWidth / 2 - this.slideWidth / 2 : 0;
		
		this.totalWidth = 0;
		this.slides.forEach(el => {			
			this.totalWidth += el.offsetWidth;			
		});
		
		this.slides.forEach((slide) => {
			slide.left = slide.offsetLeft;			
			slide.width = slide.offsetWidth;
		})

		if (this.options.loop) {
			gsap.set(this.element, {
				width: Math.min(this.totalWidth - Math.max(...this.slides.map(slide => slide.width)), document.body.offsetWidth),
			})
			if (this.totalWidth - Math.max(...this.slides.map(slide => slide.width)) < document.body.offsetWidth) {
				this.element.classList.add("masked");
			} else {
				this.element.classList.remove("masked");
			}
		}
	}

	swiping() {
		this.element.addEventListener(this.isMobile ? "touchstart" : "mousedown", (e) => {			
			this.isSwiping = true;
			this.pos.previous = this.isMobile ? e.touches[0].clientX : e.clientX;
			this.pos.current = this.isMobile ? e.touches[0].clientX : e.clientX;			
		})

		window.addEventListener(this.isMobile ? "touchmove" : "mousemove", (e) => {
			if (!this.isSwiping) return;
			this.pos.current = this.isMobile ? e.touches[0].clientX + this.pos.stored : e.clientX + this.pos.stored;
			this.pos.difference = this.pos.current - this.pos.previous;
			if (Math.abs(this.pos.difference) > 5) {
				this.element.style.pointerEvents = "none";
			}
		})

		window.addEventListener(this.isMobile ? "touchend" : "mouseup", () => {
			if (!this.isSwiping) return;
			this.isSwiping = false;
			this.pos.previous = this.pos.current;

			if (this.options.snap) {
				if (this.options.loop) {
					this.changeSlide(Math.round(-this.pos.difference / this.slideWidth));
				} else {
					this.changeSlide(Math.min(Math.max(Math.round(-this.pos.difference / this.slideWidth), 0), this.slides.length - 1));
				}
			}

			setTimeout(() => {
				this.element.style.pointerEvents = "auto";
			}, 1);

			this.pos.stored = this.pos.difference;
		})
	}

	controlling() {
		this.controls.querySelector(".next").addEventListener("click", () => {
			if (this.pos.slide < this.slides.length - 1 || this.options.loop) {
				this.pos.slide += 1;
				this.changeSlide(this.pos.slide)
			}				
		})
		this.controls.querySelector(".prev").addEventListener("click", () => {
			if (this.pos.slide > 0 || this.options.loop) {
				this.pos.slide -= 1;
				this.changeSlide(this.pos.slide)
			}
		})
	}

	autoSlide() {
		this.changeSlide(this.pos.slide + 1);

		setTimeout(() => {
			this.autoSlide();
		}, 3000);
	}

	update() {
		if (this.options.autoplay) {
			this.autoSlide();
		}
		gsap.ticker.add(() => {
			if (this.type === "carousel") {
				this.pos.lerp -= 1;
			} else if (this.type === "parallax") {
				this.pos.lerp = this.pos.difference;
			} else {
				this.pos.lerp += (this.pos.difference - this.pos.lerp) * (this.isMobile ? 0.2 : 0.05);
			}

			const edge = this.options.parallax ? -((this.totalWidth - this.swiperWidth) / 2 - this.slideWidth / 2) : 0;

			this.slides.forEach((slide, index) => {
				if (this.options.loop) {
					if (slide.left + slide.width + this.centeringOffset + this.pos.lerp + (slide.loop * this.totalWidth) < edge) {
						slide.loop += 1;
					}
	
					if (slide.left + slide.width + this.centeringOffset + this.pos.lerp + ((slide.loop - 1) * this.totalWidth) >= edge) {
						slide.loop -= 1;
					}
				}

				if (this.options.parallax) {
					slide.positionX = this.pos.lerp + this.centeringOffset + (slide.loop * this.totalWidth);
					slide.scale = Math.abs(slide.positionX + slide.left - this.centeringOffset) / (this.swiperWidth / 2);

					gsap.to(slide, {
						x: slide.positionX - ((slide.positionX + slide.left - this.centeringOffset) / (this.swiperWidth / 2)) * 400,
						z: 1 - slide.scale * 200,
						duration: 0.5,
						ease: "power1.out"
					})
					// gsap.set(slide, {
					// 	x: this.pos.lerp + this.centeringOffset + (slide.loop * this.totalWidth),
					// })
				} else {
					gsap.set(slide, {
						x: this.pos.lerp + this.centeringOffset + (slide.loop * this.totalWidth)
					})
				}


				
			})
		})
	}

	changeSlide(slide) {		
		this.pos.difference = (slide * this.slideWidth) * -1;
		this.pos.stored = this.pos.difference;
		if (this.pos.slide === slide) return;

		if (this.options.controls && !this.options.loop) {
			if (slide >= this.slides.length - 1) {
				gsap.to(this.controls.querySelector(".next"), {
					opacity: .2,
					duration: 0.5
				})
			} else if (slide <= 0) {
				gsap.to(this.controls.querySelector(".prev"), {
					opacity: .2,
					duration: 0.5
				})
			} else {
				gsap.to(this.controls.querySelector(".prev"), {
					opacity: 1,
					duration: 0.5
				})
				gsap.to(this.controls.querySelector(".next"), {
					opacity: 1,
					duration: 0.5
				})
			}
		} else if (this.options.parallax && this.slides[((slide % this.slides.length) + this.slides.length) % this.slides.length].querySelector(".swiper-slide-content")) {
			const prevSlide = ((this.pos.slide % this.slides.length) + this.slides.length) % this.slides.length;
			const newSlide = ((slide % this.slides.length) + this.slides.length) % this.slides.length;
			
			
			gsap.to(this.slides[newSlide].querySelector(".swiper-slide-content"), {
				opacity: 1,
				y: 0
			})
			gsap.to(this.slides[prevSlide].querySelector(".swiper-slide-content"), {
				opacity: 0,
				y: 40
			})
		}

		if (this.options.parallax) {
			this.slides.forEach((el, i) => {
				const normalizedSlide = ((slide % this.slides.length) + this.slides.length) % this.slides.length;
				const distance = Math.min(
					Math.abs(i - normalizedSlide),
					Math.abs(i - normalizedSlide + this.slides.length),
					Math.abs(i - normalizedSlide - this.slides.length)
				);
				
				if (distance > 2) {
					gsap.to(el, {
						opacity: 0,
					})
				} else {
					gsap.to(el, {
						opacity: 1,
					})
				}
			});
		}

		this.pos.slide = slide;
	}

	animation() {
		
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

	clicking() {
		const videoOverlay = document.querySelector('.video-overlay') || document.querySelector('[data-video-overlay]');
		const videoContainer = videoOverlay.querySelector('.video-container');
		const closeButton = videoOverlay.querySelector('.close-button');
		let videoOpen = false;

		this.slides.forEach(slide => {
			slide.addEventListener("click", () => {
				if (!this.pos.clickable) return;
				const videoUrl = slide.dataset.video;
				let embedHtml = '';
				
				videoOpen = true;

				if (!videoOverlay) {
					console.warn('Video overlay not found');
					return;
				}

				// Clear gsap props on parent
				gsap.set(videoOverlay.parentNode, { clearProps: "transform" });
			
				// Detect YouTube or Vimeo and create appropriate embed
				if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
					// YouTube video
					const videoId = this.extractYouTubeId(videoUrl);
					embedHtml = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="max-width:100%;max-height:100%;aspect-ratio:16/9;"></iframe>`;
				} else if (videoUrl.includes('vimeo.com')) {
					// Vimeo video
					const videoId = videoUrl.match(/vimeo\.com\/(\d+)/)?.[1];
					embedHtml = `<iframe src="https://player.vimeo.com/video/${videoId}?badge=0&amp;autopause=0&amp;player_id=0&amp;app_id=58479&amp;autoplay=1" frameborder="0" allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share" referrerpolicy="strict-origin-when-cross-origin" style="max-width:100%;max-height:100%;aspect-ratio:16/9;" title="Video"></iframe>`;
				}
				
				if (embedHtml) {
					gsap.to(videoOverlay, {
						autoAlpha: 1,
					});
					
					videoContainer.innerHTML = embedHtml;
				}
			});
		});

		closeButton.addEventListener("click", () => {
			if (videoOpen) {
				gsap.to(videoOverlay, {
					autoAlpha: 0,
					duration: 0.25
				});
				videoContainer.innerHTML = '';
			}
		})
	}

	extractYouTubeId(url) {
		// Handle different YouTube URL formats
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);
		return (match && match[2].length === 11) ? match[2] : null;
	}
}
