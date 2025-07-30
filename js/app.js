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
            setTimeout(() => {
                menuOpen = menuTogglesArray.some(toggle => toggle.classList.contains("w--open"))
                if (menuOpen) {
                    document.body.style.overflow = "hidden";
                } else {
                    document.body.style.overflow = "auto";
                }
            }, 10);
        });
    });

    document.addEventListener("click", (e) => {
        setTimeout(() => {  
            if (menuOpen) {
                document.body.style.overflow = "auto";
                menuOpen = false;
            }
        }, 10);
    });
}