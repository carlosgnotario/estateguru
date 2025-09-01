# Modular JavaScript Structure

This project uses a modular approach where each class has its own file and self-initializes when imported.

## File Structure

```
js/
├── app.js                 # Main entry point - imports classes and handles other functionality
├── classes/
│   ├── Carousel.js        # Carousel class (self-initializes)
│   ├── Videoblocks.js     # VideoBlocks class (self-initializes)
│   └── ExampleClass.js    # Template for new classes
└── README.md             # This file
```

## How to Add a New Class

1. **Create a new class file** in `js/classes/`:
   ```javascript
   // js/classes/MyNewClass.js
   export default class MyNewClass {
       constructor(element, options = {}) {
           this.element = element;
           this.options = options;
           this.init();
       }

       init() {
           // Initialize your class
       }

       // Add your class methods here
       someMethod() {
           // Your method implementation
       }
   }

   // Self-initialization
   function initMyNewClasses() {
       const elements = document.querySelectorAll('.my-new-class'); // Change selector as needed
       elements.forEach((element, index) => {
           const instance = new MyNewClass(element);
           window.registerModule(`my-new-class-${index}`, instance);
       });
   }

   // Initialize when DOM is ready
   if (document.readyState === 'loading') {
       document.addEventListener('DOMContentLoaded', initMyNewClasses);
   } else {
       initMyNewClasses();
   }
   ```

2. **Import in app.js**:
   ```javascript
   // In app.js, add the import:
   import './classes/MyNewClass.js';
   ```

3. **That's it!** The class will self-initialize when imported.

## How It Works

- **Self-Initialization**: Each class file handles its own initialization
- **DOM Ready Check**: Classes check if DOM is ready and initialize accordingly
- **Global Registration**: `window.registerModule(moduleName, instance)` stores modules globally
- **Simple Storage**: All modules stored in `window.modules` Map
- **Clean app.js**: Main file just imports classes and handles other functionality

## Usage

- All classes are automatically initialized when imported
- Access any module instance via `window.modules.get('module-name')`
- All modules are stored in `window.modules`
- Get all registered module names: `Array.from(window.modules.keys())`

## Benefits

- **Self-Contained**: Each class handles its own initialization
- **Clean app.js**: Main file stays simple and focused
- **Modularity**: Each class is completely independent
- **Maintainability**: Easy to find and modify specific functionality  
- **Scalability**: Easy to add new classes
- **Debugging**: Each module can be accessed individually via `window.modules`
- **Flexibility**: Classes can register with custom names and options 