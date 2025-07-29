const tabsSystem = document.querySelectorAll("#tabify");

tabsSystem.forEach((el, i) => {
    const tabsLinks = el.querySelectorAll(".w-tab-link");
    const tabsContentItems = el.querySelectorAll(".w-tab-pane");

    tabsLinks.forEach((link, i) => { 
        link.style.order = i;
        const linkparent = link.closest('.tabs').offsetTop;
    });    
    tabsContentItems.forEach((item, i) => { item.style.order = i; });
});

let menuOpen = false

const menuTogglesArray = Array.from(document.querySelectorAll(".header .w-dropdown-toggle"));

if (menuTogglesArray.length > 0) {
    menuTogglesArray.forEach(el => {
        el.addEventListener("click", (e) => {
            // Use setTimeout to check the state after Webflow has updated the DOM
            setTimeout(() => {
                // Check if any of the toggles has the class w--open
                menuOpen = menuTogglesArray.some(toggle => toggle.classList.contains("w--open"))
                if (menuOpen) {
                    // stop scroll by hijacking the scroll event
                    document.body.style.overflow = "hidden";
                } else {
                    document.body.style.overflow = "auto";
                }
            }, 10); // Small delay to ensure DOM is updated
        });
    });

    document.addEventListener("click", (e) => {
        if (menuOpen) {
            // stop scroll by hijacking the scroll event
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "auto";
        }
    });
}