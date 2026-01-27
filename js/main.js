/* =====================================================
   BLACK RABBIT COMEDY CLUB - MAIN JAVASCRIPT
   ===================================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ----- DOM Elements -----
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navOverlay = document.getElementById('navOverlay');
    const navLinks = document.querySelectorAll('.nav-link');

    // ----- Navbar Scroll Effect -----
    function handleNavbarScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleNavbarScroll);

    // ----- Mobile Menu Toggle -----
    function toggleMobileMenu() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    navToggle.addEventListener('click', toggleMobileMenu);
    navOverlay.addEventListener('click', toggleMobileMenu);

    // Close menu when clicking a nav link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });

    // ----- Scroll Spy - Highlight Active Section -----
    const sections = document.querySelectorAll('section[id]');

    function highlightActiveSection() {
        const scrollY = window.scrollY;
        const navHeight = navbar.offsetHeight;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveSection);

    // ----- Smooth Scroll for Anchor Links -----
    const aboutVideo = document.getElementById('aboutVideo');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const navHeight = navbar.offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Autoplay video when About section is clicked
                if (targetId === '#about' && aboutVideo) {
                    const currentSrc = aboutVideo.src;
                    if (!currentSrc.includes('autoplay=1')) {
                        aboutVideo.src = currentSrc + '&autoplay=1&mute=1';
                    }
                }
            }
        });
    });

    // ----- Fade In on Scroll Animation -----
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe elements with fade-in class
    document.querySelectorAll('.fade-in').forEach(el => {
        fadeInObserver.observe(el);
    });

    // ----- Gallery Lightbox -----
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');

    let currentImageIndex = 0;
    const galleryImages = [];

    // Collect all gallery images
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        galleryImages.push({
            src: img.src,
            alt: img.alt
        });

        item.addEventListener('click', () => {
            openLightbox(index);
        });
    });

    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function updateLightboxImage() {
        lightboxImg.src = galleryImages[currentImageIndex].src;
        lightboxImg.alt = galleryImages[currentImageIndex].alt;
    }

    function nextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        updateLightboxImage();
    }

    function prevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        updateLightboxImage();
    }

    // Lightbox event listeners
    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxNext) lightboxNext.addEventListener('click', nextImage);
    if (lightboxPrev) lightboxPrev.addEventListener('click', prevImage);

    // Close lightbox on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation for lightbox
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowRight':
                nextImage();
                break;
            case 'ArrowLeft':
                prevImage();
                break;
        }
    });

    // ----- Video Autoplay Fallback -----
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.play().catch(() => {
            // Autoplay was prevented, video will show poster image
            console.log('Video autoplay prevented by browser');
        });
    }

    // ----- Video Carousel -----
    const videoSlides = document.querySelectorAll('.video-slide');
    const videoDots = document.querySelectorAll('.video-dot');
    const videoPrev = document.querySelector('.video-prev');
    const videoNext = document.querySelector('.video-next');

    let currentVideoIndex = 0;

    function showVideo(index) {
        // Hide all slides
        videoSlides.forEach(slide => {
            slide.classList.remove('active');
            // Pause any playing video by resetting iframe src
            const iframe = slide.querySelector('iframe');
            if (iframe) {
                const src = iframe.src;
                iframe.src = src;
            }
        });

        // Remove active from all dots
        videoDots.forEach(dot => dot.classList.remove('active'));

        // Show selected slide and dot
        currentVideoIndex = index;
        if (videoSlides[currentVideoIndex]) {
            videoSlides[currentVideoIndex].classList.add('active');
        }
        if (videoDots[currentVideoIndex]) {
            videoDots[currentVideoIndex].classList.add('active');
        }
    }

    function nextVideo() {
        const newIndex = (currentVideoIndex + 1) % videoSlides.length;
        showVideo(newIndex);
    }

    function prevVideo() {
        const newIndex = (currentVideoIndex - 1 + videoSlides.length) % videoSlides.length;
        showVideo(newIndex);
    }

    // Event listeners for video carousel
    if (videoNext) videoNext.addEventListener('click', nextVideo);
    if (videoPrev) videoPrev.addEventListener('click', prevVideo);

    // Dot navigation
    videoDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showVideo(index));
    });

});
