/**
 * ESTÚDIO RODRIGUES - JavaScript Premium
 * Funcionalidades: Hero Slider, Tabs de Serviços, Carrosséis, Scroll Animations, Menu Mobile
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.getElementById('header');
    
    function handleHeaderScroll() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Check on load
    
    // ============================================
    // HERO SLIDER
    // ============================================
    const heroSlides = document.querySelectorAll('.hero-slide');
    const heroDots = document.querySelectorAll('.hero-dot');
    const heroPrevBtn = document.querySelector('.hero-nav-btn.prev');
    const heroNextBtn = document.querySelector('.hero-nav-btn.next');
    let currentHeroSlide = 0;
    let heroSlideInterval;
    
    function showHeroSlide(index) {
        // Remove active class from all slides
        heroSlides.forEach(slide => slide.classList.remove('active'));
        heroDots.forEach(dot => dot.classList.remove('active'));
        
        // Handle wrap-around
        if (index >= heroSlides.length) {
            currentHeroSlide = 0;
        } else if (index < 0) {
            currentHeroSlide = heroSlides.length - 1;
        } else {
            currentHeroSlide = index;
        }
        
        // Add active class to current slide and dot
        heroSlides[currentHeroSlide].classList.add('active');
        heroDots[currentHeroSlide].classList.add('active');
    }
    
    function nextHeroSlide() {
        showHeroSlide(currentHeroSlide + 1);
    }
    
    function prevHeroSlide() {
        showHeroSlide(currentHeroSlide - 1);
    }
    
    function startHeroSlider() {
        heroSlideInterval = setInterval(nextHeroSlide, 5000);
    }
    
    function stopHeroSlider() {
        if (heroSlideInterval) {
            clearInterval(heroSlideInterval);
        }
    }
    
    // Event listeners for hero navigation
    if (heroNextBtn) {
        heroNextBtn.addEventListener('click', () => {
            stopHeroSlider();
            nextHeroSlide();
            startHeroSlider();
        });
    }
    
    if (heroPrevBtn) {
        heroPrevBtn.addEventListener('click', () => {
            stopHeroSlider();
            prevHeroSlide();
            startHeroSlider();
        });
    }
    
    // Dot navigation
    heroDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopHeroSlider();
            showHeroSlide(index);
            startHeroSlider();
        });
    });
    
    // Start slider
    startHeroSlider();
    
    // Pause on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopHeroSlider);
        heroSection.addEventListener('mouseleave', startHeroSlider);
    }
    
    // ============================================
    // SERVIÇOS TABS
    // ============================================
    const tabBtns = document.querySelectorAll('.tab-btn');
    const servicosContents = document.querySelectorAll('.servicos-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.dataset.tab;
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            servicosContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });
    
    // ============================================
    // CARDS CAROUSEL
    // ============================================
    function initCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;
        
        const wrapper = carousel.querySelector('.cards-wrapper');
        const cards = wrapper.querySelectorAll('.card-servico');
        const prevBtn = carousel.querySelector('.carousel-btn.prev');
        const nextBtn = carousel.querySelector('.carousel-btn.next');
        
        if (!prevBtn || !nextBtn || cards.length === 0) return;
        
        const cardWidth = cards[0].offsetWidth + 24; // 24px gap
        const visibleCards = Math.floor(carousel.offsetWidth / cardWidth);
        const maxScroll = (cards.length - visibleCards) * cardWidth;
        let currentPosition = 0;
        
        function updateCarousel() {
            wrapper.style.transform = `translateX(-${currentPosition}px)`;
        }
        
        function scrollNext() {
            if (currentPosition >= maxScroll) {
                currentPosition = 0;
            } else {
                currentPosition = Math.min(currentPosition + cardWidth * visibleCards, maxScroll);
            }
            updateCarousel();
        }
        
        function scrollPrev() {
            if (currentPosition <= 0) {
                currentPosition = maxScroll;
            } else {
                currentPosition = Math.max(currentPosition - cardWidth * visibleCards, 0);
            }
            updateCarousel();
        }
        
        prevBtn.addEventListener('click', scrollPrev);
        nextBtn.addEventListener('click', scrollNext);
        
        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;
        
        wrapper.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        wrapper.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    scrollNext();
                } else {
                    scrollPrev();
                }
            }
        }
    }
    
    // Initialize all carousels
    initCarousel('carousel-cabelo');
    initCarousel('carousel-estetica');
    
    // ============================================
    // SCROLL ANIMATIONS (Intersection Observer)
    // ============================================
    const animatedElements = document.querySelectorAll('.animar-fade, .timeline-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });
    
    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavLink() {
        const scrollPosition = window.scrollY + 200;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavLink);
    
    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just "#" or dropdown toggle
            if (href === '#' || this.classList.contains('dropdown-toggle')) {
                e.preventDefault();
                return;
            }
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                const headerHeight = header.offsetHeight;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (mobileMenu.classList.contains('active')) {
                    toggleMobileMenu();
                }
            }
        });
    });
    
    // ============================================
    // MOBILE MENU
    // ============================================
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMain = document.querySelector('.nav-main');
    const mobileMenuActiveClass = 'mobile-menu-active';
    
    function toggleMobileMenu() {
        navMain.classList.toggle(mobileMenuActiveClass);
        mobileMenuToggle.classList.toggle(mobileMenuActiveClass);
    }
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMain && navMain.classList.contains(mobileMenuActiveClass)) {
            if (!navMain.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
                navMain.classList.remove(mobileMenuActiveClass);
                mobileMenuToggle.classList.remove(mobileMenuActiveClass);
            }
        }
    });
    
    // ============================================
    // LAZY LOADING IMAGES (Native + Fallback)
    // ============================================
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.src;
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
    
    // ============================================
    // GALERIA HISTÓRIA - Lightbox Simples
    // ============================================
    const galeriaImages = document.querySelectorAll('.galeria-grid img');
    
    galeriaImages.forEach(img => {
        img.addEventListener('click', () => {
            // Create lightbox overlay
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 2000;
                cursor: pointer;
                animation: fadeIn 0.3s ease;
            `;
            
            const lightboxImg = document.createElement('img');
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightboxImg.style.cssText = `
                max-width: 90%;
                max-height: 90%;
                object-fit: contain;
            `;
            
            lightbox.appendChild(lightboxImg);
            document.body.appendChild(lightbox);
            
            // Close on click
            lightbox.addEventListener('click', () => {
                lightbox.style.animation = 'fadeOut 0.3s ease';
                setTimeout(() => lightbox.remove(), 300);
            });
        });
    });
    
    // Add lightbox animations to CSS dynamically
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
    
});

// Console log for debugging
console.log('Estúdio Rodrigues - Site Premium Carregado com Sucesso! ✨');
