const codeToggle = document.getElementById('code-toggle');
const isVisible = codeToggle && codeToggle.offsetParent !== null;

const scriptUrl = isVisible 
  ? 'http://127.0.0.1:5500/dist/app.bundle.js'
  : 'https://carlosgnotario.github.io/estateguru/dist/app.bundle.js';

const cssUrl = isVisible
  ? 'enter-local-css-url-here'
  : 'enter-production-css-url-here';

// Output CSS link immediately (faster than createElement)
document.write(`<link rel="stylesheet" href="${cssUrl}">`);

// Load script as module
const script = document.createElement('script');
script.src = scriptUrl;
script.type = 'module';
document.head.appendChild(script);
