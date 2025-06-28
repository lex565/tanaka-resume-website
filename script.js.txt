// script.js

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for scroll-triggered animations
    const animatedElements = document.querySelectorAll('.animate-item');

    const observerOptions = {
        root: null, // viewport as root
        rootMargin: '0px',
        threshold: 0.1 // 10% of the element must be visible to trigger
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add the 'is-visible' class when the element enters the viewport
                entry.target.classList.add('is-visible');
                // Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe each animated element
    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Optional: Add a subtle animation to the main content after load
    // This helps with the initial impression of the page fading in
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.style.opacity = 1; // Already set via CSS animation, but good to ensure
    }
});
