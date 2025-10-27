export default class VideoBlock {
  static selector = ".carousel-video";

  constructor(element, options = {}) {
    this.element = element;
    console.log(this.element);
  }
}
