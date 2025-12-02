import VideoBox from "./VideoBox";
import gsap from "gsap";

export default class VideoFAQ {
	static selector = ".video-faq";

	constructor(element, options = {}) {
		this.element = element;
        
        this.elements();
        this.setup();
        this.binds();
	}

    elements() {
        this.questions = this.element.querySelectorAll(".video-faq-q");
        this.answers = this.element.querySelectorAll(".video-faq-a");
    }

    setup() {
        this.answers.forEach((answer, index) => {
            answer.remove();
        });
        // create a new div then remove it until the answer is visible
        this.answerBlock = document.createElement("div");
        this.answerBlock.classList.add("video-faq-answer-block");
        this.answerBlock.style.opacity = "0";
        // Create a close button
        this.closeButton = document.createElement("a");
        this.closeButton.classList.add("video-faq-close-button");
        // circle in sand color with x in charcoal color
        this.closeButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 6L6 18" stroke="black" stroke-width="2" stroke-linecap="round"/>
                <path d="M6 6L18 18" stroke="black" stroke-width="2" stroke-linecap="round"/>
            </svg>
        `;
    }

    binds() {
        this.questions.forEach((question, index) => {
            question.addEventListener("click", () => {
                // Add answerblock and the answer inside
                this.openAnswer(index);
                document.body.append(this.answerBlock);
                this.answerBlock.innerHTML = this.answers[index].cloneNode(true).outerHTML;
                this.answerBlock.append(this.closeButton);
                // Find the video box element from the cloned content and initialize VideoBox
                const videoBoxElement = this.answerBlock.querySelector("#video-box");
                if (videoBoxElement) {
                    new VideoBox(videoBoxElement);
                }

                this.closeButton.addEventListener("click", () => {
                    this.closeAnswer();
                });
            });
        });
    }

    openAnswer(index) {
        gsap.to(this.answerBlock, {
            autoAlpha: 1,
            duration: 0.5,
            ease: "power2.inOut",
        });
    }

    closeAnswer() {
        gsap.to(this.answerBlock, {
            autoAlpha: 0,
            duration: 0.5,
            ease: "power2.inOut",
            onComplete: () => {
                this.answerBlock.remove();
            }
        });
    }
}