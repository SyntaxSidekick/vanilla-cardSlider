/**
 * Vanilla CardSlider Configuration
 * Customize all aspects of the card carousel behavior and appearance
 * 
 * Created by: Riad Kilani @SyntaxSidekick
 * Portfolio: https://riadkilani.com
 * GitHub: https://github.com/SyntaxSidekick
 * CodePen: https://codepen.io/SyntaxSidekick
 * X.com: https://x.com/syntaxsidekick
 * LinkedIn: https://linkedin.com/in/riad-kilani
 */

// =============================================================================
// CAROUSEL DATA CONFIGURATION
// =============================================================================

/**
 * Slide data structure - Replace with your own content
 * Each slide should have: genre, titleTop, titleBottom, synopsis, poster
 */
window.SLIDE_DATA = [
    {
        genre: 'Sci-Fi Action',
        titleTop: 'ROGUE',
        titleBottom: 'ONE',
        synopsis: 'A standalone Star Wars story that follows a group of unlikely heroes who band together on a mission to steal the plans to the Death Star. Set just before the events of A New Hope, this thrilling adventure showcases the sacrifices made by the Rebel Alliance.',
        poster: 'https://image.tmdb.org/t/p/original/6t8ES1d12OzWyCGxBeDYLHoaDrT.jpg'
    },
    {
        genre: 'Comedy',
        titleTop: 'THE',
        titleBottom: 'INTERNSHIP',
        synopsis: 'Vince Vaughn and Owen Wilson star as two salesmen who crash Google\'s competitive internship program. A lighthearted comedy about second chances, friendship, and proving that experience and heart can triumph over youth and technology in the digital age.',
        poster: 'https://image.tmdb.org/t/p/original/kms4PhWfP1Q2jidPLOf26qm0paJ.jpg'
    },
    {
        genre: 'Superhero Epic',
        titleTop: 'THE DARK',
        titleBottom: 'KNIGHT',
        synopsis: 'Christopher Nolan\'s Batman sequel transcends the superhero genre with Heath Ledger\'s haunting portrayal of the Joker. A complex exploration of chaos versus order, featuring groundbreaking IMAX cinematography and a story that redefined what comic book movies could achieve.',
        poster: 'https://image.tmdb.org/t/p/original/oOv2oUXcAaNXakRqUPxYq5lJURz.jpg'
    },
    {
        genre: 'Sci-Fi Revolution',
        titleTop: 'THE',
        titleBottom: 'MATRIX',
        synopsis: 'The Wachowskis created a groundbreaking sci-fi thriller that questioned reality itself. With revolutionary bullet-time effects, philosophical depth, and Keanu Reeves as Neo, The Matrix became a cultural phenomenon that influenced action cinema and popular culture for decades.',
        poster: 'https://image.tmdb.org/t/p/original/n2nm4aZRmXyJ9LT4xQX9X6ThcP7.jpg'
    },
    {
        genre: 'Biographical Drama',
        titleTop: 'THE SOCIAL',
        titleBottom: 'NETWORK',
        synopsis: 'David Fincher\'s gripping portrayal of Facebook\'s creation follows Mark Zuckerberg\'s journey from Harvard student to tech mogul. Jesse Eisenberg delivers a compelling performance in this story of ambition, betrayal, and the birth of the social media revolution.',
        poster: 'https://image.tmdb.org/t/p/original/cq9N64ucEtfIc3eMxNr1VzY9LH9.jpg'
    },
    {
        genre: 'Space Drama',
        titleTop: 'INTER',
        titleBottom: 'STELLAR',
        synopsis: 'Christopher Nolan\'s ambitious space epic combines scientific accuracy with emotional depth. Matthew McConaughey\'s journey through space and time explores themes of love, sacrifice, and humanity\'s survival, supported by Hans Zimmer\'s powerful score and stunning visual effects.',
        poster: 'https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg'
    },
    {
        genre: 'Superhero Ensemble',
        titleTop: 'AVENGERS',
        titleBottom: 'INFINITY WAR',
        synopsis: 'The culmination of a decade of Marvel storytelling, bringing together Earth\'s Mightiest Heroes against Thanos. The Russo Brothers delivered an epic that balanced multiple storylines, characters, and emotions, creating one of the most ambitious blockbusters ever attempted.',
        poster: 'https://image.tmdb.org/t/p/original/lmZFxXgJE3vgrciwuDib0N8CfQo.jpg'
    }
];

// =============================================================================
// LAYOUT & POSITIONING CONFIGURATION
// =============================================================================

window.CAROUSEL_CONFIG = {
    // Thumbnail dimensions and spacing
    THUMB_WIDTH: 200,
    THUMB_HEIGHT: 300,
    THUMB_SPACING: 40,
    MAX_VISIBLE_THUMBS: 4,
    
    // Positioning
    THUMB_AREA_RIGHT: 900,      // Distance from right edge of screen
    THUMB_AREA_BOTTOM: 500,     // Distance from bottom of screen
    MIN_AREA_OFFSET: 300,       // Minimum offset from screen edge
    
    // Animation timing (in milliseconds)
    ANIMATION_DURATION: 600,    // Main slide transition duration
    STAGGER_DELAY: 0.1,         // Delay between thumbnail animations (seconds)
    TEXT_SWITCH_DELAY: 320,     // Delay before text content switches
    TEXT_HIDE_DELAY: 200,       // Delay before hiding old text
    
    // Auto-play settings
    AUTO_PLAY_INTERVAL: 5000,   // Time between auto-advances (ms)
    AUTO_PLAY_ENABLED: true,    // Start with auto-play enabled
    
    // Z-index management
    Z_INDEX_CYCLE_LENGTH: 8,    // Number of slides before z-index resets
    Z_INDEX_BASE: 10,           // Base z-index value
    Z_INDEX_SPACING: 4,         // Spacing between z-index layers
    
    // Keyboard navigation
    KEYBOARD_ENABLED: true,     // Enable arrow key navigation
    
    // Debug mode
    DEBUG_LOGGING: false        // Enable console logging for debugging
};

// =============================================================================
// APPEARANCE CONFIGURATION
// =============================================================================

window.APPEARANCE_CONFIG = {
    // Color scheme
    PRIMARY_COLOR: '#2196F3',       // Material blue
    ACCENT_COLOR: '#FF5722',        // Material deep orange
    BACKGROUND_COLOR: '#121212',    // Dark background
    TEXT_COLOR: '#ffffff',          // Primary text color
    
    // Material Design elevation shadows
    CONTROL_SHADOW: '0 4px 8px rgba(0,0,0,0.3)',
    THUMBNAIL_SHADOW: '0 2px 8px rgba(0,0,0,0.2)',
    
    // Border radius
    BORDER_RADIUS: '8px',
    
    // Typography
    TITLE_FONT_SIZE: '4rem',
    GENRE_FONT_SIZE: '1.1rem',
    SYNOPSIS_FONT_SIZE: '1rem',
    
    // Text shadows for visibility
    TEXT_SHADOW: `
        0 0 20px rgba(0, 0, 0, 0.9),
        0 0 40px rgba(0, 0, 0, 0.7),
        0 4px 12px rgba(0, 0, 0, 0.8)
    `
};

// =============================================================================
// RESPONSIVE BREAKPOINTS
// =============================================================================

window.RESPONSIVE_CONFIG = {
    // Modern breakpoint definitions
    MOBILE_MAX: 768,
    TABLET_MAX: 1024,
    DESKTOP_MIN: 1025,
    LARGE_DESKTOP_MIN: 1400,
    
    // Mobile adjustments (≤768px)
    MOBILE_THUMB_WIDTH: 100,
    MOBILE_THUMB_HEIGHT: 150,
    MOBILE_MAX_THUMBS: 2,
    MOBILE_TITLE_SIZE: '2rem',
    MOBILE_SPACING: 20,
    
    // Tablet adjustments (769px - 1024px)
    TABLET_THUMB_WIDTH: 140,
    TABLET_THUMB_HEIGHT: 210,
    TABLET_MAX_THUMBS: 3,
    TABLET_TITLE_SIZE: '3rem',
    TABLET_SPACING: 30,
    
    // Desktop adjustments (≥1025px)
    DESKTOP_THUMB_WIDTH: 200,
    DESKTOP_THUMB_HEIGHT: 300,
    DESKTOP_MAX_THUMBS: 4,
    DESKTOP_TITLE_SIZE: '4rem',
    DESKTOP_SPACING: 40,
    
    // Large desktop adjustments (≥1400px)
    LARGE_DESKTOP_MAX_THUMBS: 5,
    LARGE_DESKTOP_TITLE_SIZE: '5rem',
    
    // Dynamic spacing calculations
    getResponsiveSpacing: function(screenWidth) {
        if (screenWidth <= this.MOBILE_MAX) return this.MOBILE_SPACING;
        if (screenWidth <= this.TABLET_MAX) return this.TABLET_SPACING;
        return this.DESKTOP_SPACING;
    },
    
    // Viewport-based positioning
    getViewportPositioning: function(screenWidth, screenHeight) {
        const isMobile = screenWidth <= this.MOBILE_MAX;
        const isTablet = screenWidth > this.MOBILE_MAX && screenWidth <= this.TABLET_MAX;
        
        return {
            thumbAreaRight: isMobile ? Math.min(screenWidth * 0.05, 30) : 
                           isTablet ? Math.min(screenWidth * 0.1, 150) :
                           Math.min(screenWidth * 0.2, 400),
            
            thumbAreaBottom: isMobile ? Math.min(screenHeight * 0.2, 150) :
                            isTablet ? Math.min(screenHeight * 0.25, 250) :
                            Math.min(screenHeight * 0.3, 350),
            
            slideInfoLeft: isMobile ? Math.min(screenWidth * 0.05, 20) :
                          isTablet ? Math.min(screenWidth * 0.08, 40) :
                          60,
            
            slideInfoTop: isMobile ? Math.min(screenHeight * 0.15, 120) :
                         isTablet ? Math.min(screenHeight * 0.2, 180) :
                         240
        };
    }
};

// =============================================================================
// CUSTOMIZATION HELPERS
// =============================================================================

/**
 * Quick setup function for common customizations
 */
window.CAROUSEL_QUICK_SETUP = {
    /**
     * Set up carousel with custom data
     */
    setSlideData: function(newData) {
        window.SLIDE_DATA = newData;
        return this;
    },
    
    /**
     * Adjust timing for slower/faster transitions
     */
    setTiming: function(speed = 'normal') {
        const timings = {
            slow: { duration: 1000, interval: 8000 },
            normal: { duration: 600, interval: 5000 },
            fast: { duration: 400, interval: 3000 }
        };
        
        const config = timings[speed] || timings.normal;
        window.CAROUSEL_CONFIG.ANIMATION_DURATION = config.duration;
        window.CAROUSEL_CONFIG.AUTO_PLAY_INTERVAL = config.interval;
        return this;
    },
    
    /**
     * Set color scheme
     */
    setColors: function(primary, accent, background = '#121212') {
        window.APPEARANCE_CONFIG.PRIMARY_COLOR = primary;
        window.APPEARANCE_CONFIG.ACCENT_COLOR = accent;
        window.APPEARANCE_CONFIG.BACKGROUND_COLOR = background;
        return this;
    },
    
    /**
     * Disable auto-play
     */
    disableAutoPlay: function() {
        window.CAROUSEL_CONFIG.AUTO_PLAY_ENABLED = false;
        return this;
    },
    
    /**
     * Enable debug mode
     */
    enableDebug: function() {
        window.CAROUSEL_CONFIG.DEBUG_LOGGING = true;
        return this;
    }
};

// =============================================================================
// EXAMPLE CUSTOMIZATIONS
// =============================================================================

/**
 * Example: Product showcase setup
 */
window.PRODUCT_SHOWCASE_SETUP = function() {
    return window.CAROUSEL_QUICK_SETUP
        .setColors('#4CAF50', '#FF9800', '#fafafa')
        .setTiming('slow')
        .disableAutoPlay();
};

/**
 * Example: Portfolio gallery setup  
 */
window.PORTFOLIO_SETUP = function() {
    return window.CAROUSEL_QUICK_SETUP
        .setColors('#9C27B0', '#E91E63')
        .setTiming('normal');
};

/**
 * Example: News/article carousel setup
 */
window.NEWS_SETUP = function() {
    return window.CAROUSEL_QUICK_SETUP
        .setColors('#607D8B', '#FF5722')
        .setTiming('fast');
};