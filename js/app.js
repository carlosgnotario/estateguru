const tabsSystem = document.querySelectorAll("#tabify");
console.log(tabsSystem);

tabsSystem.forEach((el, i) => {
    const tabsLinks = el.querySelectorAll(".w-tab-link");
    const tabsContentItems = el.querySelectorAll(".w-tab-pane");

    tabsLinks.forEach((link, i) => { 
        link.style.order = i;

        link.addEventListener("click", () => {
            // scroll to link
            setTimeout(() => {
                link.scrollIntoView({ alignToTop: true, behavior: "smooth" });
                console.log("clicked");
            }, 1000);
        });
    });    
    tabsContentItems.forEach((item, i) => { item.style.order = i; });
});