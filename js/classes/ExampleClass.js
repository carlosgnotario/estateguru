export default class ExampleClass {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    console.log("ExampleClass initialized on:", element);
    this.init();
  }
  
  init() {
    // Initialize your carousel video functionality here
    console.log(`Carousel video ${this.options.index} ready`);
  }
  
  greet() {
    return `Hello from carousel video ${this.options.index}!`;
  }
} 