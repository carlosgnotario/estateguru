# Applause

A modern web application built with vanilla JavaScript, featuring modular architecture, smooth animations, and responsive design.

## 🚀 Features

- **Modular JavaScript Architecture**: Self-initializing classes with clean separation of concerns
- **Modern Build System**: ESBuild for fast bundling and development
- **SCSS Styling**: Organized stylesheets with variables and mixins
- **Smooth Animations**: GSAP integration for high-performance animations
- **Smooth Scrolling**: Custom smooth scrolling implementation
- **Responsive Design**: Mobile-first approach with flexible layouts
- **Component-Based**: Reusable components like Carousel, FAQ, VideoBlock, and more

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 16 or higher)
- **npm** or **yarn** package manager
- **Live Server** (VS Code/Cursor extension) for local development with live reload
- **Stylus** (VS Code extension) for SCSS compilation
- A local web server (MAMP, XAMPP, or similar) for development

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd applause
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up your local server**
   - If using MAMP: Place the project in your `htdocs` folder
   - If using XAMPP: Place the project in your `htdocs` folder
   - Or use any other local server setup

4. **Install VS Code/Cursor extensions** (recommended for development)
   - **Live Server**: For local development with live reload
   - **Stylus**: For SCSS compilation and syntax highlighting

## 🏃‍♂️ Getting Started

### Development Mode

#### Option 1: Using Live Server (Recommended for Local Development)

1. **Start the build process**:
   ```bash
   npm run start
   # or
   npm run dev:all
   ```

2. **Start Live Server**:
   - Click the "Go Live" button on the bottom status bar in VS Code/Cursor
   - Or right-click on `index.html` and select "Open with Live Server"
   - This will start a local server (usually at `http://127.0.0.1:5500`)

3. **For live CSS changes**, add this CSS injection code in the Stylus extension:
   ```css
   @-moz-document url-prefix("https://applause") {
   @import url("http://127.0.0.1:5500/css/style.css");
   }
   ```

4. **Configure Webflow CSS/JS Component**:
   - In your Webflow project, go to the CSS/JS component settings
   - **Disable remote scripts** to prevent conflicts with local development
   - **Enable local scripts** to allow local file overrides
   - This allows your local CSS and JS files to override the remote ones during development

This setup provides:
- Live reloading when files change
- Real-time SCSS compilation
- JavaScript bundling with watch mode
- Live CSS injection for real-time styling updates
- Local file overrides for development testing

#### Option 2: Traditional Development

Start the development server with live reloading for both JavaScript and SCSS:

```bash
npm run start
# or
npm run dev:all
```

This command will:
- Watch and compile SCSS files to CSS
- Bundle and watch JavaScript files
- Automatically reload when files change

### Individual Commands

**SCSS Compilation (with watch)**
```bash
npm run sass
```

**JavaScript Bundling (with watch)**
```bash
npm run dev
```

**Production Build**
```bash
npm run build
```

## 📁 Project Structure

```
applause/
├── css/                    # Compiled CSS files
│   ├── style.css
│   ├── forms.css
│   ├── accordion-tabs.css
│   └── variables.css
├── scss/                   # Source SCSS files
│   ├── style.scss
│   ├── forms.scss
│   ├── accordion-tabs.scss
│   └── variables.scss
├── js/                     # JavaScript source files
│   ├── app.js             # Main entry point
│   ├── classes/           # Modular class files
│   │   ├── Carousel.js
│   │   ├── FAQ.js
│   │   ├── VideoBlock.js
│   │   ├── Swiper.js
│   │   └── ...
│   └── modules/
│       └── ClassManager.js
├── dist/                   # Built JavaScript bundle
│   └── app.bundle.js
├── index.html             # Main HTML file
└── package.json           # Dependencies and scripts
```

## 🧩 Modular Architecture

This project uses a centralized ClassManager approach for component initialization:

### Adding New Components

1. **Create a new class file** in `js/classes/`:
   ```javascript
   // js/classes/MyComponent.js
   export default class MyComponent {
       static selector = '.my-component'; // Define the CSS selector
       
       constructor(element, options = {}) {
           this.element = element;
           this.options = options;
           this.init();
       }

       init() {
           // Initialize your component
       }
   }
   ```

2. **Add to ClassManager** (`js/modules/ClassManager.js`):
   ```javascript
   // Import the new class at the top
   import MyComponent from '../classes/MyComponent.js';

   // Add to the global classes object
   window.AppClasses = { VideoBlock, Swiper, Cards, FAQ, HeaderScroll, Animations, MyComponent };

   // Add initialization in the initializeClasses function
   document.querySelectorAll(MyComponent.selector).forEach((element, index) => {
       new MyComponent(element, { index });
   });
   ```

### Available Components

- **VideoBlock**: Video player component (`.carousel-video`)
- **Swiper**: Touch-enabled slider (`.swiper`)
- **Cards**: Interactive card component (`.card`)
- **FAQ**: Accordion-style FAQ component (`.faq`)
- **HeaderScroll**: Header scroll behavior (`[data-header-scroll]`)
- **Animations**: Animation triggers (`[data-animation]`)

## 🎨 Styling

The project uses SCSS with a modular approach:

- **Variables**: Global variables in `scss/variables.scss`
- **Forms**: Form-specific styles in `scss/forms.scss`
- **Accordion Tabs**: Tab component styles in `scss/accordion-tabs.scss`
- **Main Styles**: Core styles in `scss/style.scss`

### SCSS Compilation

SCSS files are automatically compiled to CSS when you run the development server. The compiled CSS files are placed in the `css/` directory.

## 📦 Dependencies

### Production Dependencies
- **GSAP**: High-performance animation library
- **Smooothy**: Smooth scrolling utilities

### Development Dependencies
- **ESBuild**: Fast JavaScript bundler
- **Sass**: CSS preprocessor
- **Concurrently**: Run multiple npm scripts simultaneously

## 🔧 Configuration

### Build Configuration

The project uses ESBuild for bundling. Configuration is in `package.json`:

- **Development**: `--watch` mode with source maps
- **Production**: Minified output with optimized bundle
- **Format**: IIFE (Immediately Invoked Function Expression) for browser compatibility

### Browser Support

- Modern browsers with ES6+ support
- Mobile and desktop responsive design
- Touch support for mobile devices

## 🚀 Deployment

1. **Build for production**:
   ```bash
   npm run build
   ```

2. **Upload files** to your web server:
   - `index.html`
   - `css/` directory
   - `dist/app.bundle.js`
   - Any additional assets

## 🐛 Troubleshooting

### Common Issues

1. **SCSS not compiling**: Ensure you're running `npm run sass` or `npm run start`
2. **JavaScript not updating**: Check that the build process is running with `npm run dev`
3. **Local server issues**: Ensure your local server (MAMP/XAMPP) is running and pointing to the correct directory

### Development Tips

- Use browser developer tools to debug JavaScript modules
- Access registered modules via `window.modules` in the console
- Check the console for any build errors
- Ensure all file paths are correct in your HTML
- **Live Server URL**: Make sure your Live Server is running on `http://127.0.0.1:5500` for the local development setup
- **CSS Injection**: The `@-moz-document` rule in Stylus allows you to inject local CSS for live styling updates
- **Stylus Extension**: Use the Stylus extension to inject CSS rules for real-time styling changes
- **Webflow Settings**: Configure the CSS/JS component to disable remote scripts and enable local scripts for development overrides

## 📝 Scripts Reference

| Command | Description |
|---------|-------------|
| `npm run start` | Start development server with live reloading |
| `npm run dev:all` | Same as start - runs both SCSS and JS watchers |
| `npm run sass` | Compile SCSS to CSS with watch mode |
| `npm run dev` | Bundle JavaScript with watch mode |
| `npm run build` | Create production build |
| `npm run build-esm` | Create ES module build |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

---

For more detailed information about the modular JavaScript structure, see [js/README.md](js/README.md).
