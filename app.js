// GENFIT AI - Production JavaScript
// Optimized for performance and accessibility

(function() {
    'use strict';

    // Cache DOM elements
    const DOM = {
        navbar: document.getElementById('navbar'),
        navToggle: document.getElementById('navToggle'),
        navLinks: document.querySelector('.nav-links'),
        body: document.body
    };

    // Navbar scroll effect (throttled)
    let scrollTicking = false;
    const handleScroll = () => {
        if (!scrollTicking) {
            window.requestAnimationFrame(() => {
                DOM.navbar?.classList.toggle('scrolled', window.scrollY > 50);
                scrollTicking = false;
            });
            scrollTicking = true;
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile navigation toggle
    DOM.navToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = DOM.navLinks?.classList.toggle('open');
        DOM.navToggle?.classList.toggle('active');
        DOM.body.classList.toggle('nav-open');
        DOM.navToggle?.setAttribute('aria-expanded', isOpen);
    });

    // Close mobile nav when clicking outside
    document.addEventListener('click', (e) => {
        if (DOM.navLinks?.classList.contains('open') && 
            !e.target.closest('.nav-links') && 
            !e.target.closest('.nav-toggle')) {
            DOM.navLinks.classList.remove('open');
            DOM.navToggle?.classList.remove('active');
            DOM.body.classList.remove('nav-open');
            DOM.navToggle?.setAttribute('aria-expanded', 'false');
        }
    });

    // Close mobile nav when clicking a link
    DOM.navLinks?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            DOM.navLinks.classList.remove('open');
            DOM.navToggle?.classList.remove('active');
            DOM.body.classList.remove('nav-open');
            DOM.navToggle?.setAttribute('aria-expanded', 'false');
        });
    });

    // Intersection Observer for scroll animations
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = (parseInt(entry.target.dataset.index) || 0) * 80;
                    entry.target.style.transitionDelay = `${delay}ms`;
                    entry.target.classList.add('revealed');
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    );

    document.querySelectorAll('[data-reveal]').forEach((el, i) => {
        el.dataset.index = i % 6;
        revealObserver.observe(el);
    });

    // FAQ toggle
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', function() {
            const item = this.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            
            if (!isOpen) {
                item.classList.add('open');
                this.setAttribute('aria-expanded', 'true');
            } else {
                this.setAttribute('aria-expanded', 'false');
            }
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const navbarHeight = DOM.navbar?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
                
                window.scrollTo({ top: targetPosition, behavior: 'smooth' });
            }
        });
    });

    // Handle resize (debounced)
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth > 768) {
                DOM.navLinks?.classList.remove('open');
                DOM.navToggle?.classList.remove('active');
                DOM.body.classList.remove('nav-open');
                DOM.navToggle?.setAttribute('aria-expanded', 'false');
            }
        }, 250);
    }, { passive: true });

})();
