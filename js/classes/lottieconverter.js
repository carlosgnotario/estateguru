export default class LottieConverter {
    constructor(element) {
        this.element = element;
        
        this.elements();
        this.interactions();
    }

    elements() {
        this.lottieSrc = this.element.dataset.src;
        this.newElement = document.createElement('div');
        this.newElement.classList.add('lottie-container');
        this.element.parentElement.appendChild(this.newElement);
        this.element.remove();
    }

    interactions() {
        this.animation = lottie.loadAnimation({
            container: this.newElement, // The div you created
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: this.lottieSrc
        });

        // Callback when animation data is loaded and ready
        this.animation.addEventListener('DOMLoaded', () => {
            console.log('Lottie animation loaded and ready!', this.animation);
        });


        this.playing = false;

        // document.getElementById('playButton').addEventListener('click', () => {
        //     if (!this.playing) {
        //         this.animation.play();
        //         this.playing = true;
        //     } else {
        //         this.animation.pause();
        //         this.playing = false;
        //     }
        // });
    }
}