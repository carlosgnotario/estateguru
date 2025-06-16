const videoLink = document.querySelector(".video-lightbox-link");
console.log(videoLink);


videoLink.addEventListener("click", () => {
    if (!videoLink.classList.contains("active")) {
        videoLink.classList.add("active");
    }
});