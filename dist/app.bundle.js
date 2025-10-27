var AppModule = (() => {
  // js/classes/VideoBlock.js
  var VideoBlock = class {
    static selector = ".carousel-video";
    constructor(element, options = {}) {
      this.element = element;
      console.log(this.element);
    }
  };

  // js/modules/ClassManager.js
  window.AppClasses = { VideoBlock };
  function initializeClasses() {
    document.querySelectorAll(VideoBlock.selector).forEach((element, index) => {
      new VideoBlock(element, { index });
    });
  }

  // js/app.js
  function init() {
    initializeClasses();
  }
  document.addEventListener("DOMContentLoaded", () => {
    console.log("huh");
    init();
  });
})();
