const tabsSystem = document.querySelectorAll("#tabify");
console.log(tabsSystem);

tabsSystem.forEach((el, i) => {
    const tabsLinks = el.querySelectorAll(".w-tab-link");
    const tabsContentItems = el.querySelectorAll(".w-tab-pane");

    tabsLinks.forEach((link, i) => { 
        link.style.order = i;
        const linkparent = link.closest('.tabs').offsetTop;

        link.addEventListener("click", () => {
            // scroll to link
            setTimeout(() => {
                window.scrollTo({top: linkparent + 120, behavior: "smooth"})
            }, 300);
        });
    });    
    tabsContentItems.forEach((item, i) => { item.style.order = i; });
});