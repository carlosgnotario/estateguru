import { annotate } from 'https://unpkg.com/rough-notation?module';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    const annotations = document.querySelectorAll("[data-annotation]");

    annotations.forEach(el => {
        const annotationType = el.dataset.annotation;
        const annotationColor = el.dataset.annotation_color ? el.dataset.annotation_color : "#2C2B32";
        const annotationThickness = el.dataset.annotation_thickness ? el.dataset.annotation_thickness : 1;
        const bracketsDirections = el.dataset.brackets_directions ? el.dataset.brackets_directions.split(",").map(item => item.trim()) : "top";
        el.repeat = el.dataset.annotation_repeat == "" ? true : false;
        if (el.dataset.brackets_directions) {
            console.log(el.dataset.brackets_directions);
            
        }
        
        switch (annotationType) {
            case "underline":
                el.annotation = annotate(el, { type: "underline", color: annotationColor, strokeWidth: annotationThickness });
                break;
            case "circle":
                el.annotation = annotate(el, { type: "circle", color: annotationColor, strokeWidth: annotationThickness });
                break;
            case "box":
                el.annotation = annotate(el, { type: "box", color: annotationColor, strokeWidth: annotationThickness });
                break;
            case "highlight":
                el.annotation = annotate(el, { type: "highlight", color: annotationColor, strokeWidth: annotationThickness });
                break;
            case "bracket":
                el.annotation = annotate(el, { type: "bracket", color: annotationColor, strokeWidth: annotationThickness, brackets: bracketsDirections });
                break;
            case "strikethrough":
                el.annotation = annotate(el, { type: "strike-through", color: annotationColor, strokeWidth: annotationThickness });
                break;
            case "crossed-off":
                el.annotation = annotate(el, { type: "crossed-off", color: annotationColor, strokeWidth: annotationThickness });
                break;
        }
    });

    // show() annotations when scrolled into view at 30% of the screen
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.annotation.show();

                if (!entry.target.repeat) {
                    observer.unobserve(entry.target);
                }
            } else {
                if (entry.target.repeat) {
                    entry.target.annotation.hide();
                    console.log(entry.target);
                    
                }
            }
        });
    });

    // Observe each annotation element individually
    annotations.forEach(el => {
        observer.observe(el);
    });
});