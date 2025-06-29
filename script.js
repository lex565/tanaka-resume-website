// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800, // values from 0 to 3000, with step 50ms
        easing: 'ease-in-out', // default easing for AOS animations
        once: true, // whether animation should happen only once - while scrolling down
        mirror: false, // whether elements should animate out while scrolling past them
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const darkModeToggleText = document.getElementById('darkModeToggleText');
    const htmlElement = document.documentElement;

    // Check for saved theme preference
    if (localStorage.getItem('theme') === 'light') {
        htmlElement.classList.add('light');
        if (darkModeIcon) darkModeIcon.classList.replace('fa-moon', 'fa-sun');
        if (darkModeToggleText) darkModeToggleText.textContent = 'Light Mode';
    } else {
        htmlElement.classList.remove('light'); // Default to dark
        if (darkModeIcon) darkModeIcon.classList.replace('fa-sun', 'fa-moon');
        if (darkModeToggleText) darkModeToggleText.textContent = 'Dark Mode';
    }

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            htmlElement.classList.toggle('light');
            if (htmlElement.classList.contains('light')) {
                if (darkModeIcon) darkModeIcon.classList.replace('fa-moon', 'fa-sun');
                if (darkModeToggleText) darkModeToggleText.textContent = 'Light Mode';
                localStorage.setItem('theme', 'light');
            } else {
                if (darkModeIcon) darkModeIcon.classList.replace('fa-sun', 'fa-moon');
                if (darkModeToggleText) darkModeToggleText.textContent = 'Dark Mode';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // Intersection Observer for animations not handled by AOS (e.g., counters, skill bars)
    const animatedElements = document.querySelectorAll('.animate-item:not([data-aos]), .skill-fill, .counter, .circle-progress-wrapper');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Adjust threshold as needed
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');

                // Skill bar animation
                if (entry.target.classList.contains('skill-fill')) {
                    entry.target.style.width = entry.target.dataset.progress + '%';
                    entry.target.style.transition = 'width 1s ease-in-out';
                }

                // Counter animation
                if (entry.target.classList.contains('counter')) {
                    const target = +entry.target.dataset.target;
                    let count = 0;
                    const speed = 200; // Lower is faster

                    const updateCount = () => {
                        const increment = Math.ceil(target / speed); // Dynamic increment
                        count += increment;

                        if (count < target) {
                            entry.target.innerText = Math.ceil(count);
                            requestAnimationFrame(updateCount);
                        } else {
                            entry.target.innerText = target;
                        }
                    };
                    updateCount();
                }

                // Circular progress bar animation
                if (entry.target.classList.contains('circle-progress-wrapper')) {
                    const canvas = entry.target.querySelector('.circle-canvas');
                    const circleText = entry.target.querySelector('.circle-text');
                    const progress = parseInt(entry.target.dataset.progress, 10);
                    const color = entry.target.dataset.color || 'var(--color-fresh-green)';
                    animateCircle(canvas, circleText, progress, color);
                }

                if (!entry.target.classList.contains('skill-fill') && !entry.target.classList.contains('counter') && !entry.target.classList.contains('circle-progress-wrapper')) {
                    // Only unobserve general .animate-item if not a special animation type that might need re-triggering
                    // or if you are sure it's a one-time animation.
                    // For skill bars and counters, they might re-animate if you scroll up and down if not unobserved.
                    // Depending on desired behavior, you might want to unobserve them too.
                     observer.unobserve(entry.target);
                } else if (entry.target.classList.contains('skill-fill') || entry.target.classList.contains('counter') || entry.target.classList.contains('circle-progress-wrapper')) {
                    // Unobserve these after they've animated to prevent re-triggering
                    observer.unobserve(entry.target);
                }


            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        observer.observe(element);
    });

    // Function to animate circular progress bars
    function animateCircle(canvas, textElement, targetProgress, color) {
        const ctx = canvas.getContext('2d');
        const size = canvas.width;
        const center = size / 2;
        const radius = center - 10; // Adjusted for stroke width
        const lineWidth = 8;
        let currentProgress = 0;

        function draw(progress) {
            ctx.clearRect(0, 0, size, size);

            // Background circle
            ctx.beginPath();
            ctx.arc(center, center, radius, 0, 2 * Math.PI);
            ctx.strokeStyle = 'rgba(128, 128, 128, 0.2)'; // Light grey background
            ctx.lineWidth = lineWidth;
            ctx.stroke();

            // Foreground progress arc
            ctx.beginPath();
            ctx.arc(center, center, radius, -Math.PI / 2, (-Math.PI / 2) + (progress / 100) * 2 * Math.PI);
            ctx.strokeStyle = color;
            ctx.lineWidth = lineWidth;
            ctx.lineCap = 'round';
            ctx.stroke();

            if (textElement) {
                textElement.textContent = Math.floor(progress) + '%';
            }
        }

        function animationLoop() {
            if (currentProgress < targetProgress) {
                currentProgress += 1; // Animation speed
                draw(currentProgress);
                requestAnimationFrame(animationLoop);
            } else {
                draw(targetProgress); // Ensure it ends exactly on target
            }
        }
        animationLoop();
    }

    // Initial call for any elements already in view (though AOS and IntersectionObserver should handle this)
    // document.querySelectorAll('.skill-fill.is-visible').forEach(bar => bar.style.width = bar.dataset.progress + '%');
    // document.querySelectorAll('.counter.is-visible').forEach(animateCounter);
    // document.querySelectorAll('.circle-progress-wrapper.is-visible').forEach(el => {
    //     const canvas = el.querySelector('.circle-canvas');
    //     const circleText = el.querySelector('.circle-text');
    //     const progress = parseInt(el.dataset.progress, 10);
    //     const color = el.dataset.color || 'var(--color-fresh-green)';
    //     animateCircle(canvas, circleText, progress, color);
    // });

    // Parallax effect for Hero Background
    const parallaxBgHero = document.getElementById('parallax-bg-hero');
    if (parallaxBgHero) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.pageYOffset;
            // Adjust the '0.1' for more or less parallax effect.
            // Negative value will make it move upwards as you scroll down.
            parallaxBgHero.style.transform = `translateY(${scrollPosition * -0.1}px)`;
        });
    }
});
