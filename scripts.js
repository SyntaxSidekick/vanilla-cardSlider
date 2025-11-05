/**
 * Vanilla CardSlider - Material Design Content Showcase
 * A highly customizable, responsive card carousel with Material Design controls
 * 
 * Created by: Riad Kilani @SyntaxSidekick
 * Portfolio: https://riadkilani.com
 * GitHub: https://github.com/SyntaxSidekick
 * CodePen: https://codepen.io/SyntaxSidekick
 * X.com: https://x.com/syntaxsidekick
 * LinkedIn: https://linkedin.com/in/riad-kilani
 */

// Slide carousel using external configuration
const slideData = window.SLIDE_DATA || [];
const CAROUSEL_CONFIG = window.CAROUSEL_CONFIG || {};

class SlideCarousel {
    constructor() {
        // State management
        this.activeIndex = 0;
        this.totalSlides = slideData.length;
        this.sequenceArray = Array.from({length: this.totalSlides}, (_, i) => i);
        this.isAutoActive = CAROUSEL_CONFIG.AUTO_PLAY_ENABLED !== false;
        this.autoTimer = null;
        this.usePrimaryInfo = true;
        this.cycleCounter = 0;
        
        // Debug logging
        this.debug = CAROUSEL_CONFIG.DEBUG_LOGGING || false;
        
        this.log('🚀 Initializing with configuration:', CAROUSEL_CONFIG);
        this.init();
    }
    
    log(...args) {
        if (this.debug) {
            console.log(...args);
        }
    }
    
    cacheDOMElements() {
        const elements = {};
        const ids = [
            'slide-carousel', 'slide-info-primary', 'slide-info-secondary',
            'loading-screen'
        ];
        
        ids.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                console.error(`❌ Element with ID '${id}' not found!`);
            } else {
                console.log(`✅ Found element with ID '${id}'`);
            }
            elements[id.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())] = element;
        });
        
        // Cache Material Design navigation elements
        elements.materialControls = document.querySelector('.material-controls');
        elements.navLeft = document.querySelector('[data-action="prev"]');
        elements.navRight = document.querySelector('[data-action="next"]');
        elements.playPauseBtn = document.querySelector('[data-action="play-pause"]');
        elements.progressIndicator = document.querySelector('.progress-fill');
        elements.currentSlide = document.querySelector('.current-slide');
        elements.totalSlides = document.querySelector('.total-slides');
        elements.bottomProgressIndicator = document.querySelector('.progress-indicator');
        
        // Log what we found
        this.log('🔧 Cached elements:', {
            slideCarousel: elements.slideCarousel,
            slideInfoPrimary: elements.slideInfoPrimary,
            slideInfoSecondary: elements.slideInfoSecondary,
            materialControls: elements.materialControls,
            navLeft: elements.navLeft,
            navRight: elements.navRight
        });
        
        return elements;
    }
    
    calculateLayout() {
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        
        // Get responsive configuration
        const RESPONSIVE_CONFIG = window.RESPONSIVE_CONFIG || {};
        
        // Determine current breakpoint
        const isMobile = vw <= (RESPONSIVE_CONFIG.MOBILE_MAX || 768);
        const isTablet = vw > (RESPONSIVE_CONFIG.MOBILE_MAX || 768) && vw <= (RESPONSIVE_CONFIG.TABLET_MAX || 1024);
        
        // Use responsive values
        const thumbWidth = isMobile ? (RESPONSIVE_CONFIG.MOBILE_THUMB_WIDTH || 120) :
                          isTablet ? (RESPONSIVE_CONFIG.TABLET_THUMB_WIDTH || 160) :
                          CAROUSEL_CONFIG.THUMB_WIDTH;
        
        const thumbHeight = isMobile ? (RESPONSIVE_CONFIG.MOBILE_THUMB_HEIGHT || 180) :
                           isTablet ? (RESPONSIVE_CONFIG.TABLET_THUMB_HEIGHT || 240) :
                           CAROUSEL_CONFIG.THUMB_HEIGHT;
        
        const maxThumbs = isMobile ? (RESPONSIVE_CONFIG.MOBILE_MAX_THUMBS || 2) :
                         isTablet ? (RESPONSIVE_CONFIG.TABLET_MAX_THUMBS || 3) :
                         CAROUSEL_CONFIG.MAX_VISIBLE_THUMBS;
        
        // Responsive positioning
        const thumbAreaRight = isMobile ? Math.min(vw * 0.1, 50) : 
                              isTablet ? Math.min(vw * 0.15, 200) :
                              CAROUSEL_CONFIG.THUMB_AREA_RIGHT;
        
        const thumbAreaBottom = isMobile ? Math.min(vh * 0.25, 200) :
                               isTablet ? Math.min(vh * 0.3, 300) :
                               CAROUSEL_CONFIG.THUMB_AREA_BOTTOM;
        
        const layout = {
            thumbAreaX: Math.max(CAROUSEL_CONFIG.MIN_AREA_OFFSET || 100, vw - thumbAreaRight),
            thumbAreaY: Math.max(CAROUSEL_CONFIG.MIN_AREA_OFFSET || 100, vh - thumbAreaBottom),
            entryX: vw + 200,
            textOffsetY: thumbHeight - 100,
            thumbWidth,
            thumbHeight,
            maxThumbs,
            isMobile,
            isTablet,
            breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
        };
        
        console.log(`🔧 Layout calculated for ${layout.breakpoint}:`, layout);
        return layout;
    }
    
    init() {
        this.log('🚀 Initializing slide carousel...');
        
        try {
            this.elements = this.cacheDOMElements();
            
            if (!this.elements.slideCarousel) {
                console.error('❌ slideCarousel element not found! Cannot initialize.');
                return;
            }
            
            this.layoutCache = this.calculateLayout();
            this.sequenceArray = Array.from({length: this.totalSlides}, (_, i) => i);
            
            this.createSlideElements();
            this.initializeSlideCounter();
            this.bindEventHandlers();
            this.initializeFirstSlide();
            this.showUIElements();
            
            // Start auto-play
            setTimeout(() => this.startAutoPlayTimer(), 3000);
            
        } catch (error) {
            console.error('❌ Carousel initialization failed:', error);
        }
    }
    
    createSlideElements() {
        const fragment = document.createDocumentFragment();
        
        slideData.forEach((slide, index) => {
            const slideEl = this.createSlideElement(slide, index);
            fragment.appendChild(slideEl);
        });
        
        this.elements.slideCarousel.innerHTML = '';
        this.elements.slideCarousel.appendChild(fragment);
        
        // Hide loading screen after elements are created and initial slide is displayed
        setTimeout(() => {
            this.elements.loadingScreen.classList.add('hidden');
        }, 500);
    }
    
    createSlideElement(slide, index) {
        const slideEl = document.createElement('div');
        slideEl.className = 'slide-poster';
        slideEl.style.position = 'absolute';
        slideEl.style.left = '0';
        slideEl.style.top = '0';
        slideEl.style.transformOrigin = 'top left';
        slideEl.style.backgroundImage = `url(${slide.poster})`;
        slideEl.style.backgroundSize = 'cover';
        slideEl.style.backgroundPosition = 'center';
        slideEl.setAttribute('data-slide', index);
        
        const contentEl = document.createElement('div');
        contentEl.className = 'poster-content';
        contentEl.style.position = 'absolute';
        contentEl.innerHTML = `
            <div class="content-start"></div>
            <div class="content-genre">${slide.genre}</div>
            <div class="content-title">${slide.titleTop} ${slide.titleBottom}</div>
        `;
        
        slideEl.appendChild(contentEl);
        
        // Initial state - set up proper initial styling
        if (index === 0) {
            // Set initial main slide styling
            slideEl.style.width = '100%';
            slideEl.style.height = '100vh';
            slideEl.style.opacity = '1';
            slideEl.style.zIndex = '10';
        } else {
            this.hideElement(slideEl);
        }
        
        return slideEl;
    }
    
    initializeSlideCounter() {
        if (this.elements.totalSlides) {
            this.elements.totalSlides.textContent = this.totalSlides;
        }
        if (this.elements.currentSlide) {
            this.elements.currentSlide.textContent = '1';
        }
    }
    
    bindEventHandlers() {
        this.elements.navLeft?.addEventListener('click', () => this.previousSlide());
        this.elements.navRight?.addEventListener('click', () => this.nextSlide());
        this.elements.playPauseBtn?.addEventListener('click', () => this.toggleAutoPlay());
        
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // Add touch event handling for mobile devices
        this.bindTouchEvents();
        
        let resizeTimer;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                this.layoutCache = this.calculateLayout();
                this.refreshThumbnailPositions();
                this.positionControlsUnderThumbs();
            }, 150);
        });
        
        // Handle orientation change on mobile devices
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.layoutCache = this.calculateLayout();
                this.refreshThumbnailPositions();
                this.positionControlsUnderThumbs();
            }, 300); // Delay to allow orientation change to complete
        });
    }
    
    bindTouchEvents() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        let isTouch = false;
        
        const carousel = this.elements.slideCarousel;
        if (!carousel) return;
        
        // Touch start
        carousel.addEventListener('touchstart', (e) => {
            isTouch = true;
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        // Touch end - handle swipe gestures
        carousel.addEventListener('touchend', (e) => {
            if (!isTouch) return;
            
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            const deltaX = touchEndX - touchStartX;
            const deltaY = touchEndY - touchStartY;
            const minSwipeDistance = 50;
            
            // Only handle horizontal swipes (ignore vertical scrolling)
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                e.preventDefault();
                
                if (deltaX > 0) {
                    // Swipe right - previous slide
                    this.previousSlide();
                } else {
                    // Swipe left - next slide
                    this.nextSlide();
                }
            }
            
            isTouch = false;
        }, { passive: false });
        
        // Prevent default touch behaviors on buttons
        document.querySelectorAll('.material-fab').forEach(button => {
            button.addEventListener('touchstart', (e) => {
                e.stopPropagation();
            }, { passive: true });
        });
    }
    
    handleKeyPress(e) {
        const actions = {
            'ArrowLeft': () => this.previousSlide(),
            'ArrowRight': () => this.nextSlide(),
            ' ': () => this.toggleAutoPlay()
        };
        
        if (actions[e.key]) {
            e.preventDefault();
            actions[e.key]();
        }
    }
    
    initializeFirstSlide() {
        console.log('🔧 Initializing first slide...');
        
        if (slideData.length === 0) {
            console.error('❌ No slide data available!');
            return;
        }
        
        const firstSlideData = slideData[0];
        this.updateTextContent('primary', firstSlideData);
        this.elements.slideInfoPrimary.classList.add('active');
        this.elements.slideInfoPrimary.style.zIndex = '25';
        
        // Initialize progress bar to first position
        setTimeout(() => {
            this.updateProgressAndNumbers(0);
        }, 300);
        
        // Display the first slide with thumbnails
        setTimeout(() => {
            console.log('🔧 Displaying slide 0');
            this.displaySlide(0);
        }, 100);
        
        // Initialize the first slide display with proper layout after DOM is ready
        setTimeout(() => {
            console.log('🔧 Setting up initial slide layout');
            this.displaySlide(0);
        }, 500);
    }
    
    showUIElements() {
        setTimeout(() => {
            const materialControls = this.elements.materialControls;
            if (materialControls) {
                materialControls.classList.add('visible');
                this.positionControlsUnderThumbs();
            }
        }, 500);
    }
    
    positionControlsUnderThumbs() {
        const materialControls = this.elements.materialControls;
        if (!materialControls) return;
        
        // Calculate the center of the thumbnail area using responsive values
        const vw = window.innerWidth;
        const thumbAreaWidth = this.layoutCache.maxThumbs * (this.layoutCache.thumbWidth + CAROUSEL_CONFIG.THUMB_SPACING);
        const thumbAreaCenterX = this.layoutCache.thumbAreaX + (thumbAreaWidth / 2);
        
        // Responsive positioning
        if (this.layoutCache.isMobile) {
            // On mobile, center controls at bottom
            materialControls.style.right = '50%';
            materialControls.style.transform = 'translateX(50%)';
            materialControls.style.bottom = '20px';
        } else {
            // Position controls centered under thumbnails
            materialControls.style.right = `${vw - thumbAreaCenterX}px`;
            materialControls.style.transform = 'translateX(50%)';
            materialControls.style.bottom = this.layoutCache.isTablet ? '40px' : '60px';
        }
        
        console.log(`🎯 Controls positioned for ${this.layoutCache.breakpoint}: center at ${Math.round(thumbAreaCenterX)}px`);
    }
    
    displaySlide(targetIndex) {
        this.log(`🎯 Displaying slide ${targetIndex}: ${slideData[targetIndex].genre}`);
        
        const zIndices = this.calculateZIndices();
        
        this.activeIndex = targetIndex;
        this.rotateSequenceToFront(targetIndex);
        
        const [activeIdx, ...restIndices] = this.sequenceArray;
        
        const switchText = this.setupTextTransition(targetIndex, zIndices);
        this.updatePosterStates(activeIdx, restIndices, zIndices, switchText);
        this.updateProgressAndNumbers(targetIndex);
    }
    
    calculateZIndices() {
        this.cycleCounter++;
        const cyclePos = this.cycleCounter % CAROUSEL_CONFIG.Z_INDEX_CYCLE_LENGTH;
        const baseZ = CAROUSEL_CONFIG.Z_INDEX_BASE + (cyclePos * CAROUSEL_CONFIG.Z_INDEX_SPACING);
        
        const indices = {
            oldText: baseZ,
            growingImage: baseZ + 1,
            newText: baseZ + 2
        };
        
        if (cyclePos === 1) {
            this.cleanupOldElements();
        }
        
        return indices;
    }
    
    cleanupOldElements() {
        [this.elements.slideInfoPrimary, this.elements.slideInfoSecondary].forEach(el => {
            if (!el.classList.contains('active')) {
                el.style.zIndex = '1';
                el.classList.add('inactive');
                el.classList.remove('active');
            }
        });
        
        const allSlides = this.elements.slideCarousel.querySelectorAll('.slide-poster');
        allSlides.forEach(slide => {
            const currentZ = parseInt(slide.style.zIndex) || 0;
            if (!slide.classList.contains('active') && !slide.classList.contains('thumbnail') && currentZ > 40) {
                slide.style.zIndex = '1';
            }
        });
    }
    
    rotateSequenceToFront(targetIndex) {
        while (this.sequenceArray[0] !== targetIndex) {
            this.sequenceArray.push(this.sequenceArray.shift());
        }
    }
    
    setupTextTransition(targetIndex, zIndices) {
        const currentActive = this.usePrimaryInfo ? this.elements.slideInfoPrimary : this.elements.slideInfoSecondary;
        currentActive.style.zIndex = zIndices.oldText;
        
        const switchText = (delayOldTextHide = false) => {
            this.usePrimaryInfo = !this.usePrimaryInfo;
            const newActive = this.usePrimaryInfo ? this.elements.slideInfoPrimary : this.elements.slideInfoSecondary;
            const oldActive = this.usePrimaryInfo ? this.elements.slideInfoSecondary : this.elements.slideInfoPrimary;
            
            this.updateTextContent(this.usePrimaryInfo ? 'primary' : 'secondary', slideData[targetIndex]);
            newActive.style.zIndex = zIndices.newText;
            newActive.classList.add('active');
            newActive.classList.remove('inactive');
            
            if (delayOldTextHide) {
                setTimeout(() => this.hideTextContainer(oldActive), CAROUSEL_CONFIG.TEXT_HIDE_DELAY);
            } else {
                this.hideTextContainer(oldActive);
            }
        };
        
        return switchText;
    }
    
    updateTextContent(container, slideData) {
        const suffix = container === 'primary' ? '-primary' : '-secondary';
        document.getElementById(`current-genre${suffix}`).textContent = slideData.genre;
        document.getElementById(`current-title-top${suffix}`).textContent = slideData.titleTop;
        document.getElementById(`current-title-bottom${suffix}`).textContent = slideData.titleBottom;
        document.getElementById(`current-synopsis${suffix}`).textContent = slideData.synopsis;
    }
    
    hideTextContainer(element) {
        element.classList.add('inactive');
        element.classList.remove('active');
        element.style.zIndex = '1';
    }
    
    updatePosterStates(activeIdx, restIndices, zIndices, switchText) {
        const allSlides = this.elements.slideCarousel.querySelectorAll('.slide-poster');
        
        allSlides.forEach((slide, index) => {
            slide.classList.remove('active', 'thumbnail');
            
            if (index === activeIdx) {
                this.handleActivePoster(slide, zIndices, switchText);
            } else if (restIndices.includes(index)) {
                const thumbPos = restIndices.indexOf(index);
                if (thumbPos < CAROUSEL_CONFIG.MAX_VISIBLE_THUMBS) {
                    this.handleThumbnailPoster(slide, index, thumbPos);
                } else {
                    this.hideElement(slide);
                }
            } else {
                this.hideElement(slide);
            }
        });
    }
    
    handleActivePoster(slide, zIndices, switchText) {
        const wasThumbnail = slide.style.width && slide.style.width !== '100%';
        slide.classList.add('active');
        
        if (wasThumbnail) {
            this.animateFromThumbnail(slide, zIndices, switchText);
        } else {
            this.setAsMainSlide(slide, zIndices.growingImage);
            if (switchText) switchText();
        }
        
        const content = slide.querySelector('.poster-content');
        if (content) {
            content.classList.remove('visible');
            content.style.opacity = '0';
        }
    }
    
    animateFromThumbnail(slide, zIndices, switchText) {
        const transform = slide.style.transform;
        const match = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        const currentX = match ? parseFloat(match[1]) : 0;
        const currentY = match ? parseFloat(match[2]) : 0;
        const currentWidth = parseFloat(slide.style.width) || this.layoutCache.thumbWidth;
        
        const backgroundImage = slide.style.backgroundImage;
        
        const scale = currentWidth / window.innerWidth;
        slide.style.width = '100%';
        slide.style.height = '100vh';
        slide.style.backgroundSize = 'cover';
        slide.style.backgroundPosition = 'center';
        slide.style.backgroundImage = backgroundImage;
        slide.style.zIndex = zIndices.growingImage;
        slide.style.transition = 'none';
        slide.style.transform = `translate(${currentX}px, ${currentY}px) scale(${scale})`;
        slide.style.transformOrigin = 'top left';
        
        slide.offsetHeight;
        slide.style.transition = `transform ${CAROUSEL_CONFIG.ANIMATION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        slide.style.transform = 'translate(0, 0) scale(1)';
        
        setTimeout(() => {
            switchText(true);
        }, CAROUSEL_CONFIG.TEXT_SWITCH_DELAY);
        
        setTimeout(() => {
            slide.style.transition = 'none';
            slide.style.transform = '';
            slide.style.transformOrigin = '';
        }, CAROUSEL_CONFIG.ANIMATION_DURATION);
    }
    
    setAsMainSlide(slide, zIndex = 10) {
        const backgroundImage = slide.style.backgroundImage;
        slide.style.position = 'absolute';
        slide.style.left = '0';
        slide.style.top = '0';
        slide.style.width = '100%';
        slide.style.height = '100vh';
        slide.style.opacity = '1';
        slide.style.backgroundSize = 'cover';
        slide.style.backgroundPosition = 'center';
        slide.style.zIndex = zIndex;
        slide.style.transformOrigin = 'top left';
        slide.style.backgroundImage = backgroundImage;
    }
    
    handleThumbnailPoster(slide, slideIndex, thumbPos) {
        slide.classList.add('thumbnail');
        
        // Use responsive layout values
        const finalX = this.layoutCache.thumbAreaX + thumbPos * (this.layoutCache.thumbWidth + CAROUSEL_CONFIG.THUMB_SPACING);
        const wasActive = slide.classList.contains('active');
        const hasPosition = this.hasExistingPosition(slide);
        
        const staggerDelay = thumbPos * CAROUSEL_CONFIG.STAGGER_DELAY;
        const zIndex = 50 + thumbPos;
        
        // Check if we should show this thumbnail based on responsive max
        if (thumbPos >= this.layoutCache.maxThumbs) {
            this.hideElement(slide);
            return;
        }
        
        if (wasActive || hasPosition) {
            this.animateToThumbnail(slide, finalX, staggerDelay, zIndex);
        } else {
            this.slideInThumbnail(slide, finalX, staggerDelay, zIndex);
        }
        
        this.updateThumbnailContent(slide, slideIndex, finalX, staggerDelay);
        this.addThumbnailClickHandler(slide, slideIndex);
    }
    
    hasExistingPosition(slide) {
        const transform = slide.style.transform;
        return transform && transform.includes('translate') && !transform.includes('-1000px');
    }
    
    animateToThumbnail(slide, finalX, delay, zIndex) {
        const backgroundImage = slide.style.backgroundImage;
        slide.style.transition = `transform ${CAROUSEL_CONFIG.ANIMATION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        slide.style.transitionDelay = `${delay}s`;
        slide.style.transform = `translate(${finalX}px, ${this.layoutCache.thumbAreaY}px)`;
        slide.style.width = `${this.layoutCache.thumbWidth}px`;
        slide.style.height = `${this.layoutCache.thumbHeight}px`;
        slide.style.zIndex = zIndex;
        slide.style.opacity = '1';
        slide.style.backgroundImage = backgroundImage;
    }
    
    slideInThumbnail(slide, finalX, delay, zIndex) {
        const backgroundImage = slide.style.backgroundImage;
        slide.style.position = 'absolute';
        slide.style.left = '0';
        slide.style.top = '0';
        slide.style.width = `${this.layoutCache.thumbWidth}px`;
        slide.style.height = `${this.layoutCache.thumbHeight}px`;
        slide.style.transform = `translate(${this.layoutCache.entryX}px, ${this.layoutCache.thumbAreaY}px)`;
        slide.style.zIndex = zIndex;
        slide.style.opacity = '1';
        slide.style.transition = 'none';
        slide.style.transitionDelay = '0s';
        slide.style.backgroundImage = backgroundImage;
        
        slide.offsetHeight;
        slide.style.transition = `transform ${CAROUSEL_CONFIG.ANIMATION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        slide.style.transitionDelay = `${delay}s`;
        slide.style.transform = `translate(${finalX}px, ${this.layoutCache.thumbAreaY}px)`;
    }
    
    updateThumbnailContent(slide, slideIndex, finalX, delay) {
        const content = slide.querySelector('.poster-content');
        if (!content) return;
        
        const slideInfo = slideData[slideIndex];
        content.style.position = 'absolute';
        content.style.zIndex = `${60 + (slideIndex % 4)}`;
        content.style.opacity = '1';
        content.style.transition = `transform ${CAROUSEL_CONFIG.ANIMATION_DURATION}ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
        content.style.transitionDelay = `${delay}s`;
        content.style.transform = `translate(${finalX}px, ${this.layoutCache.thumbAreaY + this.layoutCache.textOffsetY}px)`;
        
        content.classList.add('visible');
        content.querySelector('.content-genre').textContent = slideInfo.genre;
        content.querySelector('.content-title').textContent = `${slideInfo.titleTop} ${slideInfo.titleBottom}`;
    }
    
    addThumbnailClickHandler(slide, slideIndex) {
        slide.onclick = (e) => {
            e.preventDefault();
            this.navigateToSlide(slideIndex);
        };
        slide.style.cursor = 'pointer';
    }
    
    hideElement(slide) {
        slide.style.position = 'absolute';
        slide.style.opacity = '0';
        slide.style.zIndex = '1';
        slide.style.transform = 'translate(-1000px, -1000px)';
        slide.style.transition = 'none';
        
        const content = slide.querySelector('.poster-content');
        if (content) {
            content.classList.remove('visible');
            content.style.opacity = '0';
        }
    }
    
    updateProgressAndNumbers(index) {
        // Calculate percentage of slides completed (discrete steps)
        const progress = ((index + 1) / this.totalSlides) * 100;
        
        // Update Material Design progress bar with smooth progression animation
        if (this.elements.progressIndicator) {
            // Add a slight delay to make the progression feel more deliberate
            setTimeout(() => {
                this.elements.progressIndicator.style.transition = 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                this.elements.progressIndicator.style.width = `${progress}%`;
            }, 100);
        }
        
        // Update slide counter with a subtle animation
        if (this.elements.currentSlide) {
            this.elements.currentSlide.style.transform = 'scale(1.1)';
            this.elements.currentSlide.textContent = index + 1;
            setTimeout(() => {
                this.elements.currentSlide.style.transform = 'scale(1)';
            }, 150);
        }
        
        console.log(`📊 Progress animated to: ${Math.round(progress)}% (slide ${index + 1}/${this.totalSlides})`);
    }
    
    refreshThumbnailPositions() {
        const thumbnails = this.elements.slideCarousel.querySelectorAll('.slide-poster.thumbnail');
        thumbnails.forEach((thumb, index) => {
            // Only position thumbnails that should be visible
            if (index < this.layoutCache.maxThumbs) {
                const finalX = this.layoutCache.thumbAreaX + index * (this.layoutCache.thumbWidth + CAROUSEL_CONFIG.THUMB_SPACING);
                thumb.style.transform = `translate(${finalX}px, ${this.layoutCache.thumbAreaY}px)`;
                thumb.style.width = `${this.layoutCache.thumbWidth}px`;
                thumb.style.height = `${this.layoutCache.thumbHeight}px`;
                thumb.style.opacity = '1';
                
                const content = thumb.querySelector('.poster-content');
                if (content) {
                    content.style.transform = `translate(${finalX}px, ${this.layoutCache.thumbAreaY + this.layoutCache.textOffsetY}px)`;
                }
            } else {
                // Hide excess thumbnails
                this.hideElement(thumb);
            }
        });
    }
    
    nextSlide() {
        this.sequenceArray.push(this.sequenceArray.shift());
        this.displaySlide(this.sequenceArray[0]);
    }
    
    previousSlide() {
        this.sequenceArray.unshift(this.sequenceArray.pop());
        this.displaySlide(this.sequenceArray[0]);
    }
    
    navigateToSlide(index) {
        if (index === this.activeIndex) return;
        this.displaySlide(index);
        if (this.isAutoActive) this.startAutoPlayTimer();
    }
    
    startAutoPlayTimer() {
        this.stopAutoPlayTimer();
        if (!this.isAutoActive) return;
        
        // Update controls progress bar to current position immediately
        this.updateProgressAndNumbers(this.activeIndex);
        
        // Start bottom progress bar animation
        this.animateBottomProgressIndicator();
        
        this.autoTimer = setInterval(() => {
            this.nextSlide();
            // Start new progress bar animation for next slide
            this.animateBottomProgressIndicator();
        }, CAROUSEL_CONFIG.AUTO_PLAY_INTERVAL);
    }
    
    stopAutoPlayTimer() {
        if (this.autoTimer) {
            clearInterval(this.autoTimer);
            this.autoTimer = null;
        }
        this.resetProgressIndicator();
    }
    
    animateBottomProgressIndicator() {
        const bottomIndicator = this.elements.bottomProgressIndicator;
        if (!bottomIndicator) return;
        
        // Reset the progress indicator
        bottomIndicator.classList.remove('animating');
        bottomIndicator.classList.add('reset');
        bottomIndicator.style.left = '0';
        bottomIndicator.style.right = '0';
        bottomIndicator.style.width = '100vw';
        bottomIndicator.style.transformOrigin = 'center';
        bottomIndicator.style.transform = 'scaleX(0)';
        bottomIndicator.style.transition = 'none';
        
        // Force reflow
        bottomIndicator.offsetHeight;
        
        // Start animation over the slide duration
        setTimeout(() => {
            bottomIndicator.classList.remove('reset');
            bottomIndicator.classList.add('animating');
            bottomIndicator.style.transition = `transform ${CAROUSEL_CONFIG.AUTO_PLAY_INTERVAL}ms linear`;
            bottomIndicator.style.transform = 'scaleX(1)';
        }, 50);
        
        console.log(`⏱️ Bottom progress indicator animating over ${CAROUSEL_CONFIG.AUTO_PLAY_INTERVAL}ms`);
    }
    
    resetProgressIndicator() {
        const indicator = this.elements.progressIndicator;
        const bottomIndicator = this.elements.bottomProgressIndicator;
        
        if (indicator) {
            const currentProgress = ((this.activeIndex + 1) / this.totalSlides) * 100;
            indicator.style.width = `${currentProgress}%`;
            indicator.style.transition = 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        }
        
        if (bottomIndicator) {
            bottomIndicator.classList.remove('animating');
            bottomIndicator.classList.add('reset');
            bottomIndicator.style.transform = 'scaleX(0)';
            bottomIndicator.style.transition = 'none';
        }
    }
    
    toggleAutoPlay() {
        this.isAutoActive = !this.isAutoActive;
        const playPauseBtn = this.elements.playPauseBtn;
        
        if (playPauseBtn) {
            const icon = playPauseBtn.querySelector('.material-icon');
            if (icon) {
                if (this.isAutoActive) {
                    icon.textContent = 'pause';
                    playPauseBtn.setAttribute('aria-label', 'Pause carousel');
                    this.startAutoPlayTimer();
                } else {
                    icon.textContent = 'play_arrow';
                    playPauseBtn.setAttribute('aria-label', 'Play carousel');
                    this.stopAutoPlayTimer();
                }
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.slideCarousel = new SlideCarousel();
});
