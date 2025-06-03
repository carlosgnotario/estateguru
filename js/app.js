const accordion = document.querySelectorAll(".accordion");

accordion.forEach((el, i) => {
    const accordionItem = el.querySelectorAll(".accordion-item");

    accordionItem.forEach((item, i) => {
        item.addEventListener("click", () => {
            accordionItem.forEach((item, i) => {
                item.classList.remove("active");
            });
            item.classList.add("active");
        });
    });
});