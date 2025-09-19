
// Portfolio Website JavaScript - Complete & Improved
// Configured to send emails to phamtho034ls@gmail.com

// EmailJS Configuration
(function() {
    // Replace these with your actual EmailJS credentials
    const EMAILJS_PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // Get from EmailJS dashboard
    const EMAILJS_SERVICE_ID = "YOUR_SERVICE_ID"; // Your email service ID  
    const EMAILJS_TEMPLATE_ID = "YOUR_TEMPLATE_ID"; // Your email template ID
    
    // Initialize EmailJS
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

// DOM Elements
const elements = {
    mobileMenu: document.getElementById('mobile-menu'),
    hamburgerIcon: document.getElementById('hamburger-icon'),
    closeIcon: document.getElementById('close-icon'),
    contactForm: document.getElementById('contact-form'),
    formMessage: document.getElementById('form-message'),
    submitBtn: document.getElementById('submit-btn'),
    btnText: document.getElementById('btn-text'),
    btnLoading: document.getElementById('btn-loading'),
    toggleProjectsBtn: document.getElementById('toggle-projects'),
    toggleText: document.getElementById('toggle-text'),
    toggleIcon: document.getElementById('toggle-icon'),
    additionalProjects: document.getElementById('additional-projects'),
    skillsSection: document.getElementById('skills'),
    navLinks: document.querySelectorAll('nav a[href^="#"]'),
    sections: document.querySelectorAll('section[id]'),
    nav: document.querySelector('nav')
};

// State management
const state = {
    isProjectsExpanded: false,
    isMenuOpen: false,
    isFormSubmitting: false,
    currentSection: '',
    scrollTop: 0
};

// Mobile Menu Toggle with improved animation
function toggleMenu() {
    if (!elements.mobileMenu || !elements.hamburgerIcon || !elements.closeIcon) {
        console.error('Mobile menu elements not found');
        return;
    }
    
    state.isMenuOpen = !state.isMenuOpen;
    
    if (state.isMenuOpen) {
        // Open menu
        elements.mobileMenu.classList.remove('hidden');
        elements.hamburgerIcon.classList.add('hidden');
        elements.closeIcon.classList.remove('hidden');
        
        // Add body scroll lock
        document.body.style.overflow = 'hidden';
        
        // Animate menu items
        const menuItems = elements.mobileMenu.querySelectorAll('a');
        menuItems.forEach((item, index) => {
            item.style.animation = `slideIn 0.3s ease ${index * 0.1}s both`;
        });
    } else {
        // Close menu
        elements.mobileMenu.classList.add('hidden');
        elements.hamburgerIcon.classList.remove('hidden');
        elements.closeIcon.classList.add('hidden');
        
        // Remove body scroll lock
        document.body.style.overflow = '';
    }
}

// Projects Toggle Function with improved animation
function toggleProjects() {
    if (!elements.additionalProjects || !elements.toggleText || !elements.toggleIcon) {
        console.error('Project toggle elements not found');
        return;
    }
    
    state.isProjectsExpanded = !state.isProjectsExpanded;
    
    if (state.isProjectsExpanded) {
        // Show additional projects
        elements.additionalProjects.classList.remove('hidden');
        elements.additionalProjects.classList.add('grid');
        elements.toggleText.textContent = 'Thu gọn dự án';
        elements.toggleIcon.style.transform = 'rotate(180deg)';
        elements.toggleProjectsBtn.classList.add('rotated');
        
        // Add stagger animation to project cards
        const projectCards = elements.additionalProjects.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.animation = `slideUp 0.6s ease ${index * 0.1}s both`;
        });
    } else {
        // Hide additional projects with animation
        const projectCards = elements.additionalProjects.querySelectorAll('.project-card');
        projectCards.forEach((card, index) => {
            card.style.animation = `slideDown 0.3s ease ${index * 0.05}s both`;
        });
        
        // Hide after animation completes
        setTimeout(() => {
            elements.additionalProjects.classList.add('hidden');
            elements.additionalProjects.classList.remove('grid');
            elements.toggleText.textContent = 'Xem thêm dự án';
            elements.toggleIcon.style.transform = 'rotate(0deg)';
            elements.toggleProjectsBtn.classList.remove('rotated');
            
            // Smooth scroll back to projects section
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 300);
    }
}

// Contact Form Handler with enhanced validation
function handleContactForm() {
    if (!elements.contactForm) {
        console.error('Contact form not found');
        return;
    }

    elements.contactForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        if (state.isFormSubmitting) return;
        
        // Show loading state
        showLoadingState();
        state.isFormSubmitting = true;
        
        // Collect form data
        const templateParams = {
            from_name: document.getElementById('from_name').value.trim(),
            from_email: document.getElementById('from_email').value.trim(),
            subject: document.getElementById('subject').value.trim(),
            message: document.getElementById('message').value.trim(),
            to_email: 'phamtho034ls@gmail.com' // Target email
        };
        
        // Enhanced validation
        const validationResult = validateFormData(templateParams);
        if (!validationResult.isValid) {
            hideLoadingState();
            state.isFormSubmitting = false;
            showMessage(validationResult.message, 'error');
            
            // Focus on first invalid field
            if (validationResult.field) {
                document.getElementById(validationResult.field)?.focus();
            }
            return;
        }
        
        try {
            // Send email using EmailJS
            const response = await emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams);
            
            console.log('Email sent successfully!', response.status, response.text);
            showMessage('✅ Tin nhắn đã được gửi thành công! Tôi sẽ phản hồi sớm nhất có thể.', 'success');
            resetForm();
            
            // Clear saved form data
            clearSavedFormData();
            
            // Track success event
            trackEvent('form_submit', 'success');
            
        } catch (error) {
            console.error('Email sending failed:', error);
            showMessage('❌ Có lỗi xảy ra khi gửi tin nhắn. Vui lòng thử lại sau hoặc liên hệ trực tiếp qua email: phamtho034ls@gmail.com', 'error');
            
            // Track error event
            trackEvent('form_submit', 'error', error.message);
        } finally {
            hideLoadingState();
            state.isFormSubmitting = false;
        }
    });
}

// Enhanced Form Validation
function validateFormData(data) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (data.from_name.length < 2) {
        return {
            isValid: false,
            message: 'Tên phải có ít nhất 2 ký tự.',
            field: 'from_name'
        };
    }
    
    if (data.from_name.length > 50) {
        return {
            isValid: false,
            message: 'Tên không được quá 50 ký tự.',
            field: 'from_name'
        };
    }
    
    if (!emailRegex.test(data.from_email)) {
        return {
            isValid: false,
            message: 'Vui lòng nhập email hợp lệ.',
            field: 'from_email'
        };
    }
    
    if (data.subject.length < 3) {
        return {
            isValid: false,
            message: 'Chủ đề phải có ít nhất 3 ký tự.',
            field: 'subject'
        };
    }
    
    if (data.subject.length > 100) {
        return {
            isValid: false,
            message: 'Chủ đề không được quá 100 ký tự.',
            field: 'subject'
        };
    }
    
    if (data.message.length < 10) {
        return {
            isValid: false,
            message: 'Tin nhắn phải có ít nhất 10 ký tự.',
            field: 'message'
        };
    }
    
    if (data.message.length > 1000) {
        return {
            isValid: false,
            message: 'Tin nhắn không được quá 1000 ký tự.',
            field: 'message'
        };
    }
    
    return { isValid: true };
}

// Show Loading State
function showLoadingState() {
    if (elements.submitBtn && elements.btnText && elements.btnLoading) {
        elements.submitBtn.disabled = true;
        elements.btnText.classList.add('hidden');
        elements.btnLoading.classList.remove('hidden');
    }
}

// Hide Loading State
function hideLoadingState() {
    if (elements.submitBtn && elements.btnText && elements.btnLoading) {
        elements.submitBtn.disabled = false;
        elements.btnText.classList.remove('hidden');
        elements.btnLoading.classList.add('hidden');
    }
}

// Show Form Message with animation
function showMessage(message, type) {
    if (!elements.formMessage) return;
    
    elements.formMessage.classList.remove('hidden', 'success', 'error');
    elements.formMessage.classList.add(type, 'animate-fade-in');
    elements.formMessage.textContent = message;
    
    // Auto hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            elements.formMessage.classList.add('hidden');
        }, 5000);
    }
    
    // Scroll to message
    elements.formMessage.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'nearest' 
    });
}

// Reset Form
function resetForm() {
    if (elements.contactForm) {
        elements.contactForm.reset();
    }
}

// Clear saved form data
function clearSavedFormData() {
    const formFields = ['from_name', 'from_email', 'subject', 'message'];
    formFields.forEach(fieldId => {
        localStorage.removeItem(`portfolio_${fieldId}`);
    });
}

// Smooth Scroll for Navigation with active state
function initSmoothScroll() {
    elements.navLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Calculate offset for fixed navigation
                const navHeight = elements.nav ? elements.nav.offsetHeight : 80;
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight - 20;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (state.isMenuOpen) {
                    toggleMenu();
                }
                
                // Update active link immediately
                updateActiveLink(targetId.substring(1));
            }
        });
    });
}

// Enhanced Active Navigation State
function initActiveNavigation() {
    const updateActiveNav = utils.throttle(() => {
        let current = '';
        const navHeight = elements.nav ? elements.nav.offsetHeight : 80;
        
        // Find current section
        elements.sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top - navHeight - 50;
            const sectionBottom = section.getBoundingClientRect().bottom - navHeight - 50;
            
            if (sectionTop <= 0 && sectionBottom > 0) {
                current = section.getAttribute('id');
            }
        });
        
        // If no section found, check if at top
        if (!current && window.scrollY < 200) {
            current = 'about'; // Default to first section
        }
        
        if (current !== state.currentSection) {
            state.currentSection = current;
            updateActiveLink(current);
        }
    }, 100);
    
    window.addEventListener('scroll', updateActiveNav);
    
    // Initial call
    updateActiveNav();
}

// Update active link helper
function updateActiveLink(currentSection) {
    elements.navLinks.forEach(link => {
        link.classList.remove('text-white', 'font-semibold', 'active');
        link.classList.add('text-gray-300');
        
        const linkSection = link.getAttribute('href').substring(1);
        if (linkSection === currentSection) {
            link.classList.remove('text-gray-300');
            link.classList.add('text-white', 'font-semibold', 'active');
        }
    });
}

// Enhanced Skills Animation with Intersection Observer
function initSkillsAnimation() {
    const observerOptions = {
        threshold: 0.3,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillBars = entry.target.querySelectorAll('.skill-progress');
                
                skillBars.forEach((bar, index) => {
                    const targetWidth = bar.getAttribute('data-width');
                    if (targetWidth && bar.style.width === '0%') {
                        // Stagger animations
                        setTimeout(() => {
                            bar.style.width = targetWidth;
                        }, index * 200);
                    }
                });
            }
        });
    }, observerOptions);
    
    if (elements.skillsSection) {
        skillsObserver.observe(elements.skillsSection);
    }
}

// Enhanced Scroll Animations
function initScrollAnimations() {
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animate-slide-up')) {
                entry.target.classList.add('animate-slide-up');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Animate elements that should slide up
    const elementsToAnimate = document.querySelectorAll(`
        .project-card,
        .contact-form-container,
        .avatar-container,
        .contact-info-item,
        section h2,
        section h3
    `);
    
    elementsToAnimate.forEach(element => {
        animationObserver.observe(element);
    });
}

// Scroll to top button
function initScrollToTop() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top';
    scrollTopBtn.innerHTML = `
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
        </svg>
    `;
    scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide based on scroll position
    const toggleScrollTopBtn = utils.throttle(() => {
        if (window.scrollY > 500) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }, 100);
    
    window.addEventListener('scroll', toggleScrollTopBtn);
    
    // Scroll to top on click
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Navigation background opacity based on scroll
function initNavBackground() {
    const updateNavBackground = utils.throttle(() => {
        if (!elements.nav) return;
        
        const scrolled = window.scrollY;
        const opacity = Math.min(scrolled / 100, 1);
        
        elements.nav.style.backgroundColor = `rgba(17, 24, 39, ${0.9 + opacity * 0.1})`;
    }, 16); // 60fps
    
    window.addEventListener('scroll', updateNavBackground);
}

// Keyboard Navigation Support
function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            if (state.isMenuOpen) {
                toggleMenu();
            }
            
            // Clear form message
            if (elements.formMessage && !elements.formMessage.classList.contains('hidden')) {
                elements.formMessage.classList.add('hidden');
            }
        }
        
        // Enter key on toggle projects button
        if (e.key === 'Enter' && e.target === elements.toggleProjectsBtn) {
            e.preventDefault();
            toggleProjects();
        }
        
        // Arrow keys for section navigation
        if (e.altKey) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                navigateToNextSection();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                navigateToPreviousSection();
            }
        }
    });
}

// Section navigation helpers
function navigateToNextSection() {
    const currentIndex = Array.from(elements.sections).findIndex(
        section => section.id === state.currentSection
    );
    const nextIndex = (currentIndex + 1) % elements.sections.length;
    const nextSection = elements.sections[nextIndex];
    
    if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

function navigateToPreviousSection() {
    const currentIndex = Array.from(elements.sections).findIndex(
        section => section.id === state.currentSection
    );
    const prevIndex = currentIndex === 0 ? elements.sections.length - 1 : currentIndex - 1;
    const prevSection = elements.sections[prevIndex];
    
    if (prevSection) {
        prevSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Enhanced Form Data Persistence
function initFormDataPersistence() {
    if (!elements.contactForm) return;
    
    const formFields = ['from_name', 'from_email', 'subject', 'message'];
    
    // Save form data on input with debouncing
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            const debouncedSave = utils.debounce(() => {
                localStorage.setItem(`portfolio_${fieldId}`, field.value);
            }, 500);
            
            field.addEventListener('input', debouncedSave);
        }
    });
    
    // Restore form data on page load
    formFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const savedValue = localStorage.getItem(`portfolio_${fieldId}`);
        if (field && savedValue) {
            field.value = savedValue;
        }
    });
}

// Error Handling and Reporting
function initErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
        trackEvent('javascript_error', 'error', e.error?.message || 'Unknown error');
    });
    
    window.addEventListener('unhandledrejection', (e) => {
        console.error('Unhandled Promise Rejection:', e.reason);
        trackEvent('promise_rejection', 'error', e.reason?.message || 'Unknown rejection');
    });
}

// Performance Monitoring
function initPerformanceMonitoring() {
    // Log page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${loadTime.toFixed(2)}ms`);
        trackEvent('page_load', 'timing', loadTime);
    });
    
    // Monitor largest contentful paint
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            console.log('LCP:', lastEntry.startTime);
            trackEvent('lcp', 'timing', lastEntry.startTime);
        });
        
        try {
            observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
            console.log('LCP observation not supported');
        }
    }
}

// Animation helpers
function initAnimationHelpers() {
    // Add slideDown animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from {
                opacity: 1;
                transform: translateY(0);
            }
            to {
                opacity: 0;
                transform: translateY(20px);
            }
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateX(-20px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
    `;
    document.head.appendChild(style);
}

// Lazy loading for images
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Dark mode toggle (future feature)
function initDarkModeToggle() {
    // Create dark mode toggle button if needed
    const darkModeToggle = document.createElement('button');
    darkModeToggle.className = 'dark-mode-toggle hidden'; // Hidden for now
    darkModeToggle.innerHTML = '🌙';
    darkModeToggle.setAttribute('aria-label', 'Toggle dark mode');
    
    // Add to navigation or corner
    if (elements.nav) {
        elements.nav.appendChild(darkModeToggle);
    }
    
    // Toggle functionality
    darkModeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('light-mode');
        const isLight = document.documentElement.classList.contains('light-mode');
        darkModeToggle.innerHTML = isLight ? '☀️' : '🌙';
        localStorage.setItem('theme', isLight ? 'light' : 'dark');
    });
    
    // Restore theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.documentElement.classList.add('light-mode');
        darkModeToggle.innerHTML = '☀️';
    }
}

// Analytics and tracking
function trackEvent(eventName, category, value) {
    // Google Analytics 4 tracking
    if (typeof gtag === 'function') {
        gtag('event', eventName, {
            event_category: category,
            value: value
        });
    }
    
    // Console log for development
    console.log(`Event tracked: ${eventName}`, { category, value });
}

// Page visibility API
function initVisibilityHandling() {
    let visibilityChangeHandler;
    
    if (typeof document.hidden !== "undefined") {
        visibilityChangeHandler = "visibilitychange";
    } else if (typeof document.msHidden !== "undefined") {
        visibilityChangeHandler = "msvisibilitychange";
    } else if (typeof document.webkitHidden !== "undefined") {
        visibilityChangeHandler = "webkitvisibilitychange";
    }
    
    if (visibilityChangeHandler) {
        document.addEventListener(visibilityChangeHandler, () => {
            if (document.hidden) {
                console.log('Page is hidden');
                trackEvent('page_hidden', 'engagement');
            } else {
                console.log('Page is visible');
                trackEvent('page_visible', 'engagement');
            }
        });
    }
}

// Service Worker registration for PWA (future enhancement)
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', async () => {
            try {
                // Register service worker if sw.js exists
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('ServiceWorker registered successfully:', registration.scope);
            } catch (error) {
                console.log('ServiceWorker registration failed:', error);
            }
        });
    }
}

// Utility Functions
const utils = {
    // Debounce function for scroll events
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },
    
    // Throttle function for performance
    throttle: function(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    },
    
    // Check if device is mobile
    isMobile: function() {
        return window.innerWidth <= 768;
    },
    
    // Check if device supports touch
    isTouchDevice: function() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    },
    
    // Scroll to top function
    scrollToTop: function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    },
    
    // Format date for display
    formatDate: function(date) {
        return new Intl.DateTimeFormat('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    },
    
    // Get scroll percentage
    getScrollPercentage: function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        return Math.round((scrollTop / docHeight) * 100);
    },
    
    // Check if element is in viewport
    isInViewport: function(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },
    
    // Copy text to clipboard
    copyToClipboard: async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            return success;
        }
    }
};
// Animation cho thanh skill khi load page
document.addEventListener('DOMContentLoaded', function() {
    // Animation cho thanh mini
    const miniProgressBars = document.querySelectorAll('.skill-mini-progress');
    miniProgressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width;
        }, 200);
    });
    
    // Animation cho thanh chính
    const progressBars = document.querySelectorAll('.skill-progress');
    progressBars.forEach((bar, index) => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width;
        }, 400 + index * 200); // Delay khác nhau cho mỗi thanh
    });
});

// Animation khi scroll vào section (tùy chọn)
const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px 0px -100px 0px'
};

const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const skillItems = entry.target.querySelectorAll('.skill-item');
            skillItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('animate-fade-in');
                    
                    const miniProgress = item.querySelector('.skill-mini-progress');
                    const mainProgress = item.querySelector('.skill-progress');
                    
                    if (miniProgress) {
                        miniProgress.style.width = miniProgress.getAttribute('data-width');
                    }
                    if (mainProgress) {
                        mainProgress.style.width = mainProgress.getAttribute('data-width');
                    }
                }, index * 150);
            });
        }
    });
}, observerOptions);

// Áp dụng observer cho skills section
const skillsSection = document.querySelector('#skills');
if (skillsSection) {
    skillObserver.observe(skillsSection);
}
// Thêm vào script.js
function scrollToContact() {
    const contactSection = document.getElementById('contact');
    const navbar = document.querySelector('nav');
    
    if (contactSection) {
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = contactSection.getBoundingClientRect().top + window.pageYOffset - navbarHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
    
    // Đóng mobile menu nếu đang mở
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }
}

// EmailJS Setup Instructions Console Log
function logEmailJSSetup() {
    console.log(`
🚀 EMAILJS SETUP INSTRUCTIONS:

1. Go to https://emailjs.com and create an account
2. Create a new Email Service (Gmail recommended)
3. Create an Email Template with these variables:
   - {{from_name}} - Sender's name
   - {{from_email}} - Sender's email  
   - {{subject}} - Email subject
   - {{message}} - Email message
   - {{to_email}} - Will be phamtho034ls@gmail.com

4. Replace these values in script.js:
   - YOUR_PUBLIC_KEY: Your EmailJS public key
   - YOUR_SERVICE_ID: Your email service ID
   - YOUR_TEMPLATE_ID: Your email template ID

5. Test the contact form!

Target Email: phamtho034ls@gmail.com

📱 Keyboard Shortcuts:
- ESC: Close mobile menu or form messages
- Alt + Arrow Down: Next section
- Alt + Arrow Up: Previous section
    `);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎉 Portfolio website loaded successfully!');
    
    // Log setup instructions
    logEmailJSSetup();
    
    // Initialize all features
    try {
        handleContactForm();
        initSmoothScroll();
        initActiveNavigation();
        initSkillsAnimation();
        initScrollAnimations();
        initScrollToTop();
        initNavBackground();
        initKeyboardNavigation();
        initFormDataPersistence();
        initErrorHandling();
        initPerformanceMonitoring();
        initAnimationHelpers();
        initLazyLoading();
        initDarkModeToggle();
        initVisibilityHandling();
        initServiceWorker();
        
        console.log('✅ All features initialized successfully');
        console.log(`📱 Device: ${utils.isMobile() ? 'Mobile' : 'Desktop'}`);
        console.log(`👆 Touch Support: ${utils.isTouchDevice() ? 'Yes' : 'No'}`);
        
        // Track page initialization
        trackEvent('page_init', 'load', performance.now());
        
    } catch (error) {
        console.error('❌ Error during initialization:', error);
        trackEvent('init_error', 'error', error.message);
    }
});

// Handle page unload
window.addEventListener('beforeunload', (e) => {
    // Save current form data before leaving
    if (elements.contactForm) {
        const formFields = ['from_name', 'from_email', 'subject', 'message'];
        formFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && field.value.trim()) {
                localStorage.setItem(`portfolio_${fieldId}`, field.value);
            }
        });
    }
    
    // Track page unload
    trackEvent('page_unload', 'navigation');
});

// Handle online/offline events
window.addEventListener('online', () => {
    console.log('🌐 Connection restored');
    showMessage('Kết nối internet đã được khôi phục.', 'success');
    trackEvent('connection_restored', 'network');
});

window.addEventListener('offline', () => {
    console.log('📵 Connection lost');
    showMessage('Mất kết nối internet. Một số tính năng có thể không hoạt động.', 'error');
    trackEvent('connection_lost', 'network');
});

// Make functions globally available for HTML onclick handlers
window.toggleMenu = toggleMenu;
window.toggleProjects = toggleProjects;

// Export utils for potential future use
window.portfolioUtils = utils;

// Development helpers (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.portfolioState = state;
    window.portfolioElements = elements;
    console.log('🔧 Development mode active - portfolioState and portfolioElements available in console');
}

console.log('📋 Portfolio JavaScript loaded completely! 🚀');
// End of index.js