export default class HeaderScroll {
	static selector = '.header';
	
	constructor(element) {
		this.element = element;
		
		this.elements();
		this.setup();
		this.interactions();
	}
	
	elements() {
		this.header = this.element;
		this.darkWraps = document.querySelectorAll('.wrap[data-header="dark"]');
	}
	
	setup() {
		// Set initial state
		this.header.style.position = 'fixed';
		this.header.style.top = '0';
		this.header.style.left = '0';
		this.header.style.right = '0';
		this.header.style.zIndex = '1000';
	}
	
	interactions() {
		// Listen for scroll events
		window.addEventListener('scroll', () => {
			this.handleScroll();
		});
		
		// Initial check
		this.handleScroll();
	}
	
	handleScroll() {
		// Check if header is over any dark wrap
		this.checkDarkBackground();
	}
	
	checkDarkBackground() {
		if (this.darkWraps.length === 0) return;
		
		const headerBottom = this.header.offsetHeight;
		const scrollY = window.scrollY;
		
		// Check if header is currently over any dark wrap
		let isOverDark = false;
		
		this.darkWraps.forEach(wrap => {
			const wrapTop = wrap.offsetTop;
			const wrapBottom = wrapTop + wrap.offsetHeight;
			
			// Check if header (at scroll position 0 to header height) overlaps with this wrap
			if (scrollY < wrapBottom && (scrollY + headerBottom) > wrapTop) {
				isOverDark = true;
			}
		});
		
		// Add or remove dark class based on whether header is over dark background
		if (isOverDark) {
			this.header.classList.add('dark');
		} else {
			this.header.classList.remove('dark');
		}
	}
}
