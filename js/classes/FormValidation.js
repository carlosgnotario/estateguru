export default class FormValidation {
    static selector = 'form[data-validate]';
    
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            errorClass: 'error',
            submitSelector: 'input[type="submit"], button[type="submit"]',
            validateOnInput: true,
            validateOnBlur: true,
            ...options
        };
        
        this.submitButton = this.element.querySelector(this.options.submitSelector);
        this.inputs = this.element.querySelectorAll('input, textarea, select');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateSubmitButton();
    }
    
    setupEventListeners() {
        // Listen for input changes
        if (this.options.validateOnInput) {
            this.inputs.forEach(input => {
                input.addEventListener('input', () => this.updateSubmitButton());
            });
        }
        
        // Listen for blur events
        if (this.options.validateOnBlur) {
            this.inputs.forEach(input => {
                input.addEventListener('blur', () => this.updateSubmitButton());
            });
        }
        
        // Listen for class changes on inputs (in case error classes are added/removed programmatically)
        this.observeInputChanges();
    }
    
    observeInputChanges() {
        const observer = new MutationObserver(() => {
            this.updateSubmitButton();
        });
        
        this.inputs.forEach(input => {
            observer.observe(input, {
                attributes: true,
                attributeFilter: ['class']
            });
        });
    }
    
    hasErrors() {
        return Array.from(this.inputs).some(input => 
            input.classList.contains(this.options.errorClass)
        );
    }
    
    updateSubmitButton() {
        if (!this.submitButton) return;
        
        const hasErrors = this.hasErrors();
        
        if (hasErrors) {
            this.submitButton.disabled = true;
            this.submitButton.classList.add('disabled');
        } else {
            this.submitButton.disabled = false;
            this.submitButton.classList.remove('disabled');
        }
    }
    
    // Public method to manually trigger validation
    validate() {
        this.updateSubmitButton();
    }
}

// Self-initialization
function initFormValidation() {
    const forms = document.querySelectorAll(FormValidation.selector);
    forms.forEach((form, index) => {
        new FormValidation(form);
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFormValidation);
} else {
    initFormValidation();
}
