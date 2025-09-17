import gsap from 'gsap';

export default class Carousel {
  static selector = '.carousel';
  
    constructor(element, options = {}) {
        this.element = element;
        this.options = options;
        this.children = Array.from(this.element.children);
        console.log(this.children);
        
        // Wait for all images to load before calculating
        this.waitForImagesToLoad().then(() => {
            this.initializeCarousel();
        });
        
        // Add resize listener
        this.resizeHandler = this.handleResize.bind(this);
        window.addEventListener('resize', this.resizeHandler);
    }

    initializeCarousel() {
        // Recalculate all children dimensions
        this.children.forEach(child => {
            this.calculations(child);
        });
        
        // Calculate total width of all children
        this.totalWidth = this.children.reduce((sum, child) => sum + child.width, 0);
        
        // Find the largest child width
        this.largestChildWidth = Math.max(...this.children.map(child => child.width));
        
        // Set carousel container width to total width minus largest child
        this.element.style.maxWidth = `${this.totalWidth - this.largestChildWidth}px`;
        this.element.style.overflow = 'hidden';
        
        console.log('Total width of all children:', this.totalWidth);
        console.log('Largest child width:', this.largestChildWidth);
        console.log('Carousel max width:', this.totalWidth - this.largestChildWidth);
        
        // Start the animation if not already running
        if (!this.animationStarted) {
            this.startAnimation();
            this.animationStarted = true;
        }
    }

    handleResize() {
        // Debounce resize events
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            console.log('Window resized - recalculating carousel dimensions');
            this.initializeCarousel();
        }, 250); // 250ms debounce
    }

    waitForImagesToLoad() {
        const images = this.element.querySelectorAll('img');
        const imagePromises = Array.from(images).map(img => {
            if (img.complete) {
                return Promise.resolve();
            } else {
                return new Promise(resolve => {
                    img.addEventListener('load', resolve, { once: true });
                    img.addEventListener('error', resolve, { once: true }); // Handle broken images too
                });
            }
        });
        
        return Promise.all(imagePromises);
    }

    calculations(child) {
        child.width = child.offsetWidth;
        child.height = child.offsetHeight;
        child.leftOffset = child.offsetLeft;
        console.log(`Child width: ${child.width}, height: ${child.height}, left offset: ${child.leftOffset}`);
    }

    startAnimation() {
        // Add ticker event listener
        gsap.ticker.add(this.update.bind(this));
    }

    update() {
        this.children.forEach(child => {
            // Get current x position
            const currentX = gsap.getProperty(child, "x") || 0;
            const newX = currentX - 1; // Move 1px left per tick
            
            // Check if child is completely off-screen to the left
            if (child.leftOffset + child.width + newX < 0) {
                // Reset position to the right side
                gsap.set(child, { x: newX + this.totalWidth });
            } else {
                // Continue moving left
                gsap.set(child, { x: newX });
            }
        });
    }
} 