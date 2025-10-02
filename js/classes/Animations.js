import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default class Animations {
	// Info: converted to fromto because sometimes 2 gsap animations are triggerd on the same element and it creates bugs.

	static selector = "[data-animation]";

	constructor(element) {
		this.element = element;
		this.type = element.dataset.animation;

		if (this.type === "fade") {
			this.fade();
		} else if (this.type === "staggered" || this.type === "stagger") {
			this.staggered();
		} else if (this.type === "stagger-move-reverse") {
			this.staggerMove(true);
		} else if (this.type === "stagger-move") {
			this.staggerMove(false);
		}
	}

	fade() {
		const heading = this.element.querySelector("h1, h2, h3, h4, h5, h6");
		const text = this.element.querySelector("p");

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: this.element,
				start: "top 85%",
			},
		});

		tl.fromTo(
			this.element,
			{
				opacity: 0,
				y: "3rem",
			},
			{
				opacity: 1,
				y: 0,
				duration: 1.5,
				ease: "expo.out",
				clearProps: "all",
			}
		);
		if (heading) {
			tl.fromTo(
				heading,
				{
					opacity: 0,
					y: "3rem",
				},
				{
					opacity: 1,
					y: 0,
					duration: 1.5,
					ease: "expo.out",
					clearProps: "all",
				},
				0
			);
		}
		if (text) {
			tl.fromTo(
				text,
				{
					opacity: 0,
					y: "3rem",
				},
				{
					opacity: 1,
					y: 0,
					duration: 1.5,
					ease: "expo.out",
					clearProps: "all",
				},
				0.5
			);
		}
		if (this.element.querySelector("a")) {
			tl.fromTo(
				this.element.querySelector("a"),
				{
					opacity: 0,
					y: "3rem",
				},
				{
					opacity: 1,
					y: 0,
					duration: 0,
					ease: "none",
					clearProps: "all",
				},
				2
			);
		}
	}

	staggered() {
		const targets = this.element.querySelectorAll("[data-target]");

		targets.forEach((target, index) => {
			if (target.children.length === 0) {
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: this.element,
						start: "top 85%",
					},
				});
				tl.fromTo(
					target,
					{
						opacity: 0,
						y: "3rem",
					},
					{
						opacity: 1,
						y: 0,
						duration: 1.5,
						ease: "expo.out",
					}
				);
			} else {
				const items = target.children;
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: this.element,
						start: "top 85%",
					},
				});

				const staggerTerms =
					target.dataset.swiper === "videos"
						? (i, target, list) => {
								const pairIndex = Math.min(i, len - 1 - i);
								return pairIndex * 0.2;
							}
						: 0.1;

				tl.fromTo(
					items,
					{
						opacity: 0,

						y: "3rem",
					},
					{
						opacity: 1,
						y: 0,
						duration: 1.5,
						ease: "expo.out",
						stagger: {
							each: 0.1,
							from:
								target.dataset.swiper === "videos"
									? Math.round(items.length * 0.5)
									: target.dataset.target === "center"
									? "center"
									: "start",
						},
					},
					index * 0.2
				);
			}
		});
	}

	staggerMove(reversed) {
		const els = this.element.children;

		const tl = gsap.timeline({
			scrollTrigger: {
				trigger: this.element,
				start: "top 85%",
			},
		});

		tl.fromTo(
			els,
			{
				y: reversed ? "75vh" : "-75vh",
			},
			{
				y: "0",
				duration: 1.5,
				ease: "expo.out",
				stagger: {
					each: 0.1,
					from: reversed ? "end" : "start",
				},
			}
		);
	}
}
