import gsap from 'gsap';

export default class FAQ {
	static selector = '.faq';
	
	constructor(element) {
		this.element = element;
		
		this.elements();
		this.setup();
		this.interactions();
	}
	
	elements() {
		this.item = this.element.querySelectorAll('.faq-item');
        this.item.forEach(item => {
            item.question = item.querySelector('.faq-item-question');
            item.answer = item.querySelector('.faq-item-answer');
            item.link = item.querySelector('.faq-item-toggle');
        })
	}
	
	setup() {
        
        this.item.forEach(item => {
            gsap.set(item.answer, {
                height: 0,
                overflow: "hidden"
            })
            gsap.set(item.question, {
                marginBottom: 0
            })
            gsap.set(item.link, {
                textContent: "+",
            })
            
        })

        this.currentItem = null;
        this.openItem(0);
    }
	
	interactions() {
        this.item.forEach((item, index) => {
            item.question.addEventListener('click', () => {
                if (this.currentItem === index) return;
                this.openItem(index);
            })
        })
	}

    openItem(item) {
        console.log("once?");
        // Old one
        if (this.currentItem !== null) {
            gsap.to(this.item[this.currentItem].question, {
                marginBottom: 0,
                duration: 0.5
            })
            gsap.to(this.item[this.currentItem].answer, {
                height: 0,
                overflow: "hidden",
                duration: 0.5
            })
            gsap.set(this.item[this.currentItem].link, {
                textContent: "+",
            })
        }

        this.currentItem = item;

        gsap.to(this.item[item].question, {
            marginBottom: "0.8em",
            duration: 0.5
        })
        gsap.to(this.item[item].answer, {
            height: "auto",
            duration: 0.5
        })
        gsap.set(this.item[item].link, {
            textContent: "-",
        })
    }
}
