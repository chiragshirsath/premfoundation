/* Extracted JS from index.html inline scripts */

// Initialize AOS animation library
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true
        });
    }
});

// Optimized hero image loading and Firebase visitor counter
document.addEventListener('DOMContentLoaded', function() {
    // Load hero image after page loads
    const hero = document.querySelector('.hero');
    const heroBg = document.querySelector('.hero-bg');
    
    // First check if image is in cache
    const img = new Image();
    img.src = 'images/hero-bg.jpeg';
    
    if (img.complete) {
        // Image is cached
        if (hero) hero.classList.add('loaded');
    } else {
        // Wait for image to load
        img.onload = function() {
            if (hero) hero.classList.add('loaded');
        };
    }
    
    // Fallback if image fails to load
    img.onerror = function() {
        if (heroBg) heroBg.style.display = 'none';
    };
    
    // Initialize Firebase
    if (typeof firebase !== 'undefined') {
        const firebaseConfig = {
          apiKey: "AIzaSyAt37YeGbaMSZVqYyzm7IgDsRzmwccYZsk",
          authDomain: "prem-1802.firebaseapp.com",
          databaseURL: "https://prem-1802-default-rtdb.asia-southeast1.firebasedatabase.app",
          projectId: "prem-1802",
          storageBucket: "prem-1802.firebasestorage.app",
          messagingSenderId: "713300815317",
          appId: "1:713300815317:web:defa02a5c3804c70b5a15c",
          measurementId: "G-5BYKKN4NQ7"
        };
        try {
            firebase.initializeApp(firebaseConfig);
            const database = firebase.database();
            // Visitor counter
            const counterElement = document.getElementById('visitorCounter');
            if (counterElement) {
                const visitorRef = database.ref('visitors/total');
                // Increment visitor count
                visitorRef.transaction(function(currentValue) {
                    return (currentValue || 0) + 1;
                });
                // Update counter display
                visitorRef.on('value', (snapshot) => {
                    const count = snapshot.val();
                    counterElement.querySelector('.counter-value').textContent = count.toLocaleString();
                }, (error) => {
                    console.error('Error fetching visitor count:', error);
                    counterElement.querySelector('.counter-value').textContent = '10,000+';
                });
            }
        } catch (e) {
            console.warn('Firebase init failed', e);
        }
    }
    
    // Map loading fallback
    const maps = document.querySelectorAll('.prem-map-ratio iframe');
    maps.forEach(map => {
        map.addEventListener('error', function() {
            const wrapper = this.closest('.prem-map-wrapper');
            if (wrapper) {
                wrapper.innerHTML = `
                    <div class="alert alert-warning">
                        <i class="fas fa-map-marked-alt"></i> Map failed to load. 
                        <a href="https://maps.google.com" target="_blank">Open in Google Maps</a>
                    </div>
                `;
            }
        });
    });
});

// Fix for mobile viewport resize
function fixViewport() {
    let viewport = document.querySelector("meta[name=viewport]");
    if (!viewport) return;
    if (window.innerWidth <= 768) {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no');
    } else {
        viewport.setAttribute('content', 'width=device-width, initial-scale=1');
    }
}

window.addEventListener('resize', fixViewport);
window.addEventListener('load', fixViewport);

/* Gallery functionality extracted from index.html */
document.addEventListener('DOMContentLoaded', function() {
    // ...existing code...
    // Image configuration
    const imageConfig = {
        folder: 'images/journey',
        extensions: ['jpeg', 'jpg', 'png'],
        count: 305,
        prefix: '',
        startIndex: 1
    };
    // Video configuration
    const videoConfig = {
        folder: 'videos/journey',
        extensions: ['mp4', 'mov'],
        count: 16,
        prefix: '',
        startIndex: 1
    };
    let currentMediaType = 'photos';
    let currentMediaItems = [];
    const mainSlider = document.querySelector('.main-slider');
    const thumbnailStrip = document.querySelector('.thumbnail-strip');
    const modalSlides = document.querySelector('.modal-slides');
    const showPhotosBtn = document.getElementById('showPhotos');
    const showVideosBtn = document.getElementById('showVideos');
    const viewAllBtn = document.getElementById('viewAllMedia');
    const allMediaGrid = document.getElementById('allMediaGrid');

    function initGallery() {
        loadMediaItems(currentMediaType);
        setupEventListeners();
    }

    function loadMediaItems(type) {
        currentMediaType = type;
        currentMediaItems = [];
        if (mainSlider) mainSlider.innerHTML = '';
        if (thumbnailStrip) thumbnailStrip.innerHTML = '';
        if (modalSlides) modalSlides.innerHTML = '';
        const config = type === 'photos' ? imageConfig : videoConfig;
        for (let i = config.startIndex; i <= config.count; i++) {
            const filename = `${config.prefix}${i}.${config.extensions[0]}`;
            const mediaPath = `${config.folder}/${filename}`;
            const mediaItem = {
                type: type,
                path: mediaPath,
                caption: (type === 'photos' && i >= 273) ? `Organic Farming & NARI Company Membership Meeting - Photo ${i}` : `${type === 'photos' ? 'Photo' : 'Video'} ${i} - ${type === 'photos' ? 'Gallery' : 'Event Coverage'} `,
                index: i - config.startIndex
            };
            currentMediaItems.push(mediaItem);
            if (i <= (type === 'photos' ? 30 : 6)) {
                createSlide(mediaItem, i <= 1);
            }
        }
        // toggle button classes
        if (type === 'photos') {
            showPhotosBtn.classList.add('active');
            showPhotosBtn.classList.remove('btn-outline-prem');
            showPhotosBtn.classList.add('btn-prem');
            showVideosBtn.classList.remove('active');
            showVideosBtn.classList.remove('btn-prem');
            showVideosBtn.classList.add('btn-outline-prem');
        } else {
            showVideosBtn.classList.add('active');
            showVideosBtn.classList.remove('btn-outline-prem');
            showVideosBtn.classList.add('btn-prem');
            showPhotosBtn.classList.remove('active');
            showPhotosBtn.classList.remove('btn-prem');
            showPhotosBtn.classList.add('btn-outline-prem');
        }
        try { initSlider(); } catch (e) { console.error('initSlider error', e); }
    }

    function createSlide(mediaItem, isActive = false) {
        if (!mainSlider) return;
        const slideIndex = mediaItem.index;
        const isVideo = mediaItem.type === 'videos';
        const slide = document.createElement('div');
        slide.className = `slide ${isActive ? 'active' : ''}`;
        slide.dataset.index = slideIndex;
        if (isVideo) {
            slide.innerHTML = `
                <div class="video-placeholder position-relative" data-video="${mediaItem.path}">
                    <video class="w-100 h-100 preview-video object-fit-cover" muted playsinline autoplay loop preload="metadata">
                        <source src="${mediaItem.path}" type="video/mp4">
                    </video>
                    <div class="video-overlay d-flex align-items-center justify-content-center">
                        <div class="play-overlay">
                            <i class="fas fa-play"></i>
                        </div>
                    </div>
                </div>
                <div class="slide-caption">${mediaItem.caption}</div>
            `;
        } else {
            slide.innerHTML = `
                <img src="${mediaItem.path}" alt="Gallery Image ${slideIndex + 1}" loading="lazy">
                <div class="slide-caption">${mediaItem.caption}</div>
            `;
        }
        mainSlider.appendChild(slide);
        const thumb = document.createElement('div');
        thumb.className = `thumb ${isActive ? 'active' : ''}`;
        thumb.dataset.index = slideIndex;
        if (isVideo) {
            thumb.innerHTML = `
                <div class="video-thumb position-relative h-100" data-video="${mediaItem.path}">
                    <video class="w-100 h-100 object-fit-cover" muted playsinline autoplay loop preload="metadata">
                        <source src="${mediaItem.path}" type="video/mp4">
                    </video>
                    <div class="thumb-overlay d-flex align-items-center justify-content-center">
                        <i class="fas fa-play text-white play-btn"></i>
                    </div>
                </div>
            `;
        } else {
            thumb.innerHTML = `<img src="${mediaItem.path}" alt="Thumbnail ${slideIndex + 1}">`;
        }
        if (thumbnailStrip) thumbnailStrip.appendChild(thumb);
        if (modalSlides) {
            const modalSlide = document.createElement('div');
            modalSlide.className = `modal-slide ${isActive ? 'active' : ''}`;
            modalSlide.dataset.index = slideIndex;
            if (isVideo) {
                modalSlide.innerHTML = `<div class="modal-media-placeholder" data-video="${mediaItem.path}"></div>`;
            } else {
                modalSlide.innerHTML = `<img src="${mediaItem.path}" alt="Gallery Image ${slideIndex + 1}">`;
            }
            modalSlides.appendChild(modalSlide);
        }
    }

    function initSlider() {
        const nextBtnOld = document.querySelector('.next-btn');
        const prevBtnOld = document.querySelector('.prev-btn');
        if (!nextBtnOld || !prevBtnOld) return;
        const nextBtn = nextBtnOld.cloneNode(true);
        nextBtnOld.parentNode.replaceChild(nextBtn, nextBtnOld);
        const prevBtn = prevBtnOld.cloneNode(true);
        prevBtnOld.parentNode.replaceChild(prevBtn, prevBtnOld);
        const slides = document.querySelectorAll('.slide');
        const thumbs = document.querySelectorAll('.thumb');
        let currentSlide = 0;
        let slideInterval;
        if (slides.length === 0) return;
        function startSlideShow() {
            clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 3000);
        }
        function goToSlide(n) {
            const modalSlidesAll = document.querySelectorAll('.modal-slide');
            if (slides[currentSlide]) slides[currentSlide].classList.remove('active');
            if (thumbs[currentSlide]) thumbs[currentSlide].classList.remove('active');
            if (modalSlidesAll[currentSlide]) modalSlidesAll[currentSlide].classList.remove('active');
            currentSlide = (n + slides.length) % slides.length;
            if (slides[currentSlide]) slides[currentSlide].classList.add('active');
            if (thumbs[currentSlide]) thumbs[currentSlide].classList.add('active');
            if (modalSlidesAll[currentSlide]) modalSlidesAll[currentSlide].classList.add('active');
        }
        function nextSlide() { goToSlide(currentSlide + 1); }
        function prevSlide() { goToSlide(currentSlide - 1); }
        nextBtn.addEventListener('click', function() {
            clearInterval(slideInterval);
            nextSlide();
            startSlideShow();
        });
        prevBtn.addEventListener('click', function() {
            clearInterval(slideInterval);
            prevSlide();
            startSlideShow();
        });
        thumbs.forEach(thumb => {
            thumb.addEventListener('click', function(e) {
                const index = parseInt(this.getAttribute('data-index'));
                clearInterval(slideInterval);
                goToSlide(index);
                startSlideShow();
            });
        });
        document.querySelectorAll('.video-placeholder, .video-thumb').forEach(el => {
            el.addEventListener('click', function(e) {
                const parent = this.closest('.slide, .thumb');
                const index = parent ? parseInt(parent.getAttribute('data-index')) : null;
                if (index !== null) openLightbox(index);
            });
        });
        startSlideShow();
    }

    function setupEventListeners() {
        showPhotosBtn.addEventListener('click', () => {
            if (currentMediaType !== 'photos') {
                loadMediaItems('photos');
            }
        });
        showVideosBtn.addEventListener('click', () => {
            if (currentMediaType !== 'videos') {
                loadMediaItems('videos');
            }
        });
        viewAllBtn.addEventListener('click', () => {
            showAllMediaModal();
        });
        document.addEventListener('click', function(e) {
            const slide = e.target.closest('.slide');
            if (slide && !e.target.closest('.video-placeholder')) {
                const index = parseInt(slide.getAttribute('data-index'));
                openLightbox(index);
            }
            const thumb = e.target.closest('.thumb');
            if (thumb && !e.target.closest('.video-thumb')) {
                const index = parseInt(thumb.getAttribute('data-index'));
                openLightbox(index);
            }
        });
    }

    function showAllMediaModal() {
        if (!allMediaGrid) return;
        allMediaGrid.innerHTML = '';
        currentMediaItems.forEach((item, index) => {
            const col = document.createElement('div');
            col.className = 'col-6 col-md-4 col-lg-3';
            const mediaItem = document.createElement('div');
            mediaItem.className = 'media-grid-item position-relative overflow-hidden rounded cursor-pointer';
            mediaItem.style.height = '200px';
            mediaItem.dataset.index = index;
            if (item.type === 'videos') {
                mediaItem.innerHTML = `
                    <video class="w-100 h-100 object-fit-cover" muted loop>
                        <source src="${item.path}" type="video/mp4">
                    </video>
                    <div class="position-absolute top-50 start-50 translate-middle">
                        <i class="fas fa-play text-white bg-dark bg-opacity-50 rounded-circle p-2"></i>
                    </div>
                    <div class="position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-75 text-white small">
                        ${item.caption}
                    </div>
                `;
            } else {
                mediaItem.innerHTML = `
                    <img src="${item.path}" alt="Media ${index + 1}" class="w-100 h-100 object-fit-cover">
                    <div class="position-absolute bottom-0 start-0 end-0 p-2 bg-dark bg-opacity-75 text-white small">
                        ${item.caption}
                    </div>
                `;
            }
            mediaItem.addEventListener('click', () => {
                openLightbox(index);
                const modal = bootstrap.Modal.getInstance(document.getElementById('allMediaModal'));
                if (modal) modal.hide();
            });
            col.appendChild(mediaItem);
            allMediaGrid.appendChild(col);
        });
        const modal = new bootstrap.Modal(document.getElementById('allMediaModal'));
        modal.show();
    }

    function openLightbox(index) {
        const item = currentMediaItems[index];
        const lightboxContent = document.getElementById('lightboxContent');
        const downloadBtn = document.getElementById('downloadMedia');
        document.querySelectorAll('.thumbnail-strip video, .video-thumb video, .video-placeholder video, .slide video, .preview-video').forEach(v => {
            try { v.pause(); v.currentTime = 0; } catch(e) {}
        });
        if (item.type === 'videos') {
            if (lightboxContent) lightboxContent.innerHTML = '';
            const video = document.createElement('video');
            video.setAttribute('controls', '');
            video.className = 'w-100';
            video.style.maxHeight = '80vh';
            video.src = item.path;
            video.autoplay = true;
            video.playsInline = true;
            video.controls = true;
            if (lightboxContent) lightboxContent.appendChild(video);
        } else {
            if (lightboxContent) lightboxContent.innerHTML = `\n                <img src="${item.path}" alt="Media ${index + 1}" class="img-fluid" style="max-height: 80vh; display:block; margin:0 auto;">\n            `;
        }
        if (downloadBtn) {
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = item.path;
                link.download = item.path.split('/').pop();
                link.click();
            };
        }
        const fsBtn = document.getElementById('fullscreenMedia');
        if (fsBtn) {
            fsBtn.onclick = null;
            fsBtn.onclick = () => {
                const vid = lightboxContent ? lightboxContent.querySelector('video') : null;
                if (!vid) return;
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else if (vid.requestFullscreen) {
                    vid.requestFullscreen();
                } else if (vid.webkitRequestFullscreen) {
                    vid.webkitRequestFullscreen();
                }
            };
        }
        const modalEl = document.getElementById('mediaLightbox');
        const bsModal = new bootstrap.Modal(modalEl);
        modalEl.removeEventListener('hidden.bs.modal', modalEl._videoCleanupHandler);
        modalEl._videoCleanupHandler = function() {
            const vid = lightboxContent ? lightboxContent.querySelector('video') : null;
            if (vid) {
                try { vid.pause(); vid.src = ''; } catch(e) {}
            }
            if (lightboxContent) lightboxContent.innerHTML = '';
            const fsBtnCleanup = document.getElementById('fullscreenMedia');
            if (fsBtnCleanup) fsBtnCleanup.onclick = null;
        };
        modalEl.addEventListener('hidden.bs.modal', modalEl._videoCleanupHandler);
        bsModal.show();
    }

    initGallery();
    // createParticles() assumed present in main.js; call if available
    if (typeof createParticles === 'function') createParticles();
    const badges = document.querySelectorAll('.badge-item');
    badges.forEach((badge, i) => {
        setTimeout(() => {
            badge.style.transform = 'translateY(-5px)';
            badge.style.opacity = '1';
        }, i * 200);
    });
    const galleryModalEl = document.querySelector('.gallery-modal');
    if (galleryModalEl) {
        galleryModalEl.addEventListener('transitionend', () => {
            if (getComputedStyle(galleryModalEl).display === 'none') {
                document.querySelectorAll('video').forEach(v => { try { v.pause(); } catch(e){} });
            }
        });
        const gmClose = galleryModalEl.querySelector('.close-modal');
        if (gmClose) gmClose.addEventListener('click', () => {
            document.querySelectorAll('video').forEach(v => { try { v.pause(); } catch(e){} });
            galleryModalEl.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
});

// Hero glitter: generate small colorful spiky SVG stars
(function() {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.addEventListener('DOMContentLoaded', () => {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        const wrapper = document.createElement('div');
        wrapper.className = 'hero-glitter';
        hero.appendChild(wrapper);
        const STAR_COUNT = 20;
        const palette = ['#fff8e1', '#ffe6a7', '#ffd1dc', '#e6f7ff', '#fff4e6', '#ffd6a5', '#fff'];
        function makeStar(spikes, outerR, innerR, color) {
            const svgNS = 'http://www.w3.org/2000/svg';
            const svg = document.createElementNS(svgNS, 'svg');
            svg.classList.add('star');
            const size = outerR * 2;
            svg.setAttribute('viewBox', `0 0 ${size} ${size}`);
            svg.setAttribute('width', size);
            svg.setAttribute('height', size);
            const poly = document.createElementNS(svgNS, 'polygon');
            const cx = outerR, cy = outerR;
            const pts = [];
            for (let i = 0; i < spikes; i++) {
                const outerAngle = (i / spikes) * Math.PI * 2;
                const ox = cx + Math.cos(outerAngle) * outerR;
                const oy = cy + Math.sin(outerAngle) * outerR;
                pts.push(`${ox},${oy}`);
                const innerAngle = outerAngle + Math.PI / spikes;
                const ix = cx + Math.cos(innerAngle) * innerR;
                const iy = cy + Math.sin(innerAngle) * innerR;
                pts.push(`${ix},${iy}`);
            }
            poly.setAttribute('points', pts.join(' '));
            poly.setAttribute('fill', color);
            poly.setAttribute('opacity', '0.98');
            svg.appendChild(poly);
            return svg;
        }
        for (let i = 0; i < STAR_COUNT; i++) {
            const spikes = Math.random() > 0.6 ? 8 : 6;
            // make stars smaller: outer radius in range 2-5px
            const outer = Math.floor(Math.random() * 4) + 2;
            const inner = Math.max(1, Math.floor(outer * (0.35 + Math.random() * 0.2)));
            const color = palette[Math.floor(Math.random() * palette.length)];
            const star = makeStar(spikes, outer, inner, color);
            const left = Math.random() * 100;
            const top = Math.random() * 100;
            star.style.left = `${left}%`;
            star.style.top = `${top}%`;
            star.style.width = `${outer * 2}px`;
            star.style.height = `${outer * 2}px`;
            const duration = (1.6 + Math.random() * 2.4).toFixed(2);
            const delay = (Math.random() * 8).toFixed(2);
            star.style.animation = `hero-twinkle ${duration}s ease-in-out ${delay}s infinite`;
            const rot = (Math.random() * 40) - 20;
            const scl = 0.7 + Math.random() * 0.4;
            star.style.transform = `rotate(${rot}deg) scale(${scl})`;
            star.addEventListener('animationiteration', () => {
                const prevLeft = parseFloat(star.style.left) || 0;
                const prevTop = parseFloat(star.style.top) || 0;
                let attempts = 0;
                let newLeft, newTop;
                do {
                    newLeft = Math.random() * 100;
                    newTop = Math.random() * 100;
                    attempts++;
                } while (attempts < 8 && Math.abs(newLeft - prevLeft) < 6 && Math.abs(newTop - prevTop) < 6);
                star.style.left = `${newLeft}%`;
                star.style.top = `${newTop}%`;
                const newRot = (Math.random() * 40) - 20;
                const newScl = 0.7 + Math.random() * 0.4;
                star.style.transform = `rotate(${newRot}deg) scale(${newScl})`;
            });
            wrapper.appendChild(star);
        }
        let rt;
        const onResize = () => {
            clearTimeout(rt);
            rt = setTimeout(() => {
                wrapper.querySelectorAll('svg.star').forEach(s => {
                    s.style.left = `${Math.random() * 100}%`;
                    s.style.top = `${Math.random() * 100}%`;
                });
            }, 150);
        };
        window.addEventListener('resize', onResize);
        window.addEventListener('beforeunload', () => window.removeEventListener('resize', onResize));
    });
})();


// Enhanced Hero Section Functionality
function enhanceHeroSection() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    // Create floating elements
    const floatingElements = document.createElement('div');
    floatingElements.className = 'floating-elements';
    
    for (let i = 0; i < 3; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        floatingElements.appendChild(element);
    }
    
    hero.appendChild(floatingElements);
    
    // Add subtle animation to hero title
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transform = 'translateY(20px)';
        heroTitle.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        
        setTimeout(() => {
            heroTitle.style.opacity = '1';
            heroTitle.style.transform = 'translateY(0)';
        }, 300);
    }
    
    // Add button hover effects
    const buttons = document.querySelectorAll('.hero-btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.02)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Animate stats counter
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = parseInt(target.getAttribute('data-target'));
                animateCounter(target, finalValue);
                observer.unobserve(target);
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => {
        observer.observe(stat);
    });
    
    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 50;
        const duration = 1500;
        const stepTime = Math.abs(Math.floor(duration / (target / increment)));
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString();
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString();
            }
        }, stepTime);
    }
}

// Call the function when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    enhanceHeroSection();
});
