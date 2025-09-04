import gsap from 'gsap';

export default class Cards {
	static selector = '[data-cards]';
	
	constructor(element) {
		this.element = element;
        
		this.elements();
        this.setup();
        this.interactions();
	}
	
	elements() {
        this.cards = this.element.querySelectorAll('.card');
        
        this.cards.forEach(card => {
            card.titleElement = card.querySelector('h3');    
            card.content = card.querySelector('p');
        })
    }

    setup() {
        // Cards height match
        this.maxHeight = 0;
        this.cards.forEach(card => {
            if (card.offsetHeight > this.maxHeight) {
                this.maxHeight = card.offsetHeight;
            }
            gsap.set(card.content, {
                gridArea: "1 / 1"
            })
        })
        
        this.cards.forEach(card => {
            gsap.set(card, {
                height: this.maxHeight,
                overflow: "hidden"
            })
            gsap.set(card.content, {
                opacity: 0,
                y: card.content.offsetHeight * 1.4,
            })
        })
    }

    interactions() {
        this.cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                gsap.to(card.titleElement, {
                    y: -card.content.offsetHeight - 10,
                    duration: 1.2
                })
                gsap.to(card.content, {
                    opacity: 1,
                    duration: 1.2,
                    y: 0
                })
            })
            card.addEventListener('mouseleave', () => {
                gsap.killTweensOf(card.titleElement);
                gsap.killTweensOf(card.content);
                gsap.to(card.titleElement, {
                    y: 0,
                })
                gsap.to(card.content, {
                    opacity: 0,
                    y: card.content.offsetHeight * 1.4,
                })
            })
        })
    }
}
