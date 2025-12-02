import gsap from "gsap";
export default class VideoBox {
	static selector = "#video-box";

	constructor(element, options = {}) {
		this.element = element;
		this.videoOpen = false;
		this.isMobile = window.innerWidth < 992;
		this.variant = this.element.dataset['wf-VideoPlayer--Single-Variant'] ? this.element.dataset['wf-VideoPlayer--Single-Variant'] : "base";
		
		this.elements();
		this.binds();	
		window.addEventListener("resize", () => {
			if (!this.isMobile && window.innerWidth < 992) {
				this.isMobile = true;
			} else if (this.isMobile && window.innerWidth >= 992) {
				this.isMobile = false;
			}
			this.sizing();
		});
	}

	elements() {
		this.wrap = this.element.querySelector(".video-lightbox-link");
		this.playButton = [this.element.querySelector(".video-lightbox-circle"), this.element.querySelector(".video-lightbox-icon")];
		this.thumbnail = this.element.querySelector(".video-lightbox-thumbnail");
		this.video = this.element.querySelector(".video-lightbox-wrap");
		this.textContent = this.element.querySelector(".video-player-content");
		this.getVideo = this.video.dataset.video;
	}

	binds() {
		this.thumbnail.addEventListener("click", () => {
			if (this.videoOpen) {
				this.closeVideo();
			} else {
				this.showVideo();
			}
		});

		this.mouseDownEvents = (e) => {
			if (this.videoOpen) {
				this.closeVideo();
			}
		}

		window.addEventListener("mousedown", this.mouseDownEvents);
		window.addEventListener("touchstart", this.mouseDownEvents);
	}

	sizing() {
		console.log("resizing");
		
	}

	showVideo() {
		this.appendVideo();
		gsap.to(this.thumbnail, {
			autoAlpha: 0,
			duration: 0.5,
			ease: "power2.inOut"
		});
		gsap.to(this.video, {
			autoAlpha: 1,
			duration: 0.5,
			ease: "power2.inOut"
		});
		gsap.to(this.playButton, {
			autoAlpha: 0,
			duration: 0.5,
			ease: "power2.inOut"
		});
		if (this.variant === "base") {
			gsap.to(this.wrap, {
				height: "auto",
				duration: 0.5,
				delay: 0.5,
				ease: "power2.inOut",
			})
		} else if (this.variant === "mediabox") {
			!this.isMobile && gsap.to(this.textContent, {
				autoAlpha: 0,
				duration: 0.5,
				ease: "power2.inOut"
			})
			gsap.set(this.thumbnail, {
				height: this.wrap.offsetHeight,
				width: this.wrap.offsetWidth,
			})
			gsap.set(this.wrap, {
				gridArea: "1 / 1 / 1 / 13",
				width: this.wrap.offsetWidth,
				height: this.wrap.offsetHeight,
			})
			gsap.to(this.wrap, {
				width: "auto",
				overflow: "hidden",
				duration: 0.5,
				ease: "power2.inOut",
				delay: 0.5
			})
			gsap.to(this.wrap, {
				height: "auto",
				duration: 2,
				ease: "expo.out",
				delay: 1
			})
		}
		this.videoOpen = true;
	}

	closeVideo() {
		gsap.to(this.thumbnail, {
			autoAlpha: 1,
			duration: 0.5,
			ease: "power2.inOut",
			delay: this.variant === "base" ? 0.5 : 1
		});
		gsap.to(this.video, {
			autoAlpha: 0,
			duration: 0.5,
			ease: "power2.inOut",
			delay: this.variant === "base" ? 0.5 : 1
		});
		gsap.to(this.playButton, {
			autoAlpha: 1,
			duration: 0.5,
			ease: "power2.inOut",
			delay: this.variant === "base" ? 0.5 : 1,
			onComplete: () => {
				this.video.innerHTML = "";
			}
		});
		if (this.variant === "base") {
			gsap.to(this.wrap, {
				height: "30rem",
				duration: 0.5,
				ease: "power2.inOut"
			});
		} else if (this.variant === "mediabox") {
			gsap.to(this.textContent, {
				autoAlpha: 1,
				duration: 0.5,
				ease: "power2.inOut",
				delay: 0.5
			})
			gsap.set(this.wrap, {
				overwrite: true,
				gridArea: this.isMobile ? "1 / 1 / 1 / 13" : "1 / 1 / 1 / 7",
				width: this.wrap.offsetWidth,
				height: this.wrap.offsetHeight,
			})
			gsap.to(this.wrap, {
				width: "auto",
				overflow: "hidden",
				duration: 0.5,
				ease: "power2.inOut",
			})
			gsap.to(this.wrap, {
				height: "auto",
				duration: 0.5,
				ease: "power2.inOut",
				delay: 0.5
			})
		}
		this.videoOpen = false;

	}

	appendVideo() {
		let embedUrl;
		if (this.getVideo.includes("vimeo.com")) {
			const videoId = this.getVideo.split("/").pop();
			embedUrl = `https://player.vimeo.com/video/${videoId}?autoplay=1&playsinline=1&muted=0`;
		} else if (this.getVideo.includes("youtube.com") || this.getVideo.includes("youtu.be")) {
			const videoId = this.getVideo.includes("youtu.be") 
				? this.getVideo.split("/").pop().split("?")[0]
				: this.getVideo.split("v=")[1]?.split("&")[0];
			embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&mute=0&enablejsapi=1`;
		}
		
		// Create iframe immediately during user interaction to enable autoplay on mobile
		const iframe = document.createElement("iframe");
		iframe.width = "100%";
		iframe.height = "100%";
		iframe.src = embedUrl;
		iframe.frameBorder = "0";
		iframe.setAttribute("allow", "autoplay; encrypted-media; fullscreen");
		iframe.setAttribute("allowfullscreen", "");
		iframe.setAttribute("playsinline", "");
		iframe.style.pointerEvents = "auto";
		iframe.style.touchAction = "auto";
		
		this.video.innerHTML = "";
		this.video.appendChild(iframe);
	}
}
