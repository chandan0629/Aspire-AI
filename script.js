// Aspire-AI Website JavaScript
// Handles theme switching, navigation, and progressive enhancement

(function() {
  'use strict';

  // Theme Management
  class ThemeManager {
    constructor() {
      this.themeToggle = document.querySelector('.theme-toggle');
      this.currentTheme = this.getStoredTheme() || this.getPreferredTheme();
      
      this.init();
    }

    init() {
      // Set initial theme
      this.setTheme(this.currentTheme);
      
      // Add event listener to theme toggle
      if (this.themeToggle) {
        this.themeToggle.addEventListener('click', () => {
          this.toggleTheme();
        });
      }

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!this.getStoredTheme()) {
          this.setTheme(e.matches ? 'dark' : 'light');
        }
      });
    }

    getPreferredTheme() {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    getStoredTheme() {
      return localStorage.getItem('theme');
    }

    setTheme(theme) {
      this.currentTheme = theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('theme', theme);
      
      // Update aria-label for accessibility
      if (this.themeToggle) {
        const newLabel = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme';
        this.themeToggle.setAttribute('aria-label', newLabel);
      }
    }

    toggleTheme() {
      const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
      this.setTheme(newTheme);
    }
  }

  // Navigation Manager
  class NavigationManager {
    constructor() {
      this.navToggle = document.querySelector('.nav-toggle');
      this.navMenu = document.querySelector('.nav-menu');
      this.navLinks = document.querySelectorAll('.nav-link');
      
      this.init();
    }

    init() {
      if (this.navToggle && this.navMenu) {
        this.navToggle.addEventListener('click', () => {
          this.toggleMenu();
        });

        // Close menu when clicking nav links (mobile)
        this.navLinks.forEach(link => {
          link.addEventListener('click', () => {
            this.closeMenu();
          });
        });

        // Close menu when clicking outside (mobile)
        document.addEventListener('click', (e) => {
          if (!this.navToggle.contains(e.target) && !this.navMenu.contains(e.target)) {
            this.closeMenu();
          }
        });

        // Handle escape key to close menu
        document.addEventListener('keydown', (e) => {
          if (e.key === 'Escape' && this.isMenuOpen()) {
            this.closeMenu();
            this.navToggle.focus();
          }
        });
      }
    }

    toggleMenu() {
      const isOpen = this.isMenuOpen();
      
      if (isOpen) {
        this.closeMenu();
      } else {
        this.openMenu();
      }
    }

    openMenu() {
      this.navMenu.classList.add('open');
      this.navToggle.setAttribute('aria-expanded', 'true');
      
      // Focus first menu item for accessibility
      const firstLink = this.navMenu.querySelector('.nav-link');
      if (firstLink) {
        firstLink.focus();
      }
    }

    closeMenu() {
      this.navMenu.classList.remove('open');
      this.navToggle.setAttribute('aria-expanded', 'false');
    }

    isMenuOpen() {
      return this.navMenu.classList.contains('open');
    }
  }

  // Smooth Scrolling Manager
  class ScrollManager {
    constructor() {
      this.init();
    }

    init() {
      // Handle smooth scrolling for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
          e.preventDefault();
          
          const targetId = anchor.getAttribute('href').substring(1);
          const targetElement = document.getElementById(targetId);
          
          if (targetElement) {
            // Calculate offset for sticky header
            const header = document.querySelector('.site-header');
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = targetElement.offsetTop - headerHeight - 20;
            
            window.scrollTo({
              top: targetPosition,
              behavior: 'smooth'
            });
          }
        });
      });
    }
  }

  // Form Handler
  class FormHandler {
    constructor() {
      this.contactForm = document.querySelector('.contact-form');
      this.init();
    }

    init() {
      if (this.contactForm) {
        this.contactForm.addEventListener('submit', (e) => {
          this.handleSubmit(e);
        });

        // Add real-time validation
        const inputs = this.contactForm.querySelectorAll('.form-input');
        inputs.forEach(input => {
          input.addEventListener('blur', () => {
            this.validateField(input);
          });

          input.addEventListener('input', () => {
            this.clearErrors(input);
          });
        });
      }
    }

    handleSubmit(e) {
      e.preventDefault();
      
      const formData = new FormData(this.contactForm);
      const data = Object.fromEntries(formData);
      
      // Validate all fields
      const isValid = this.validateForm();
      
      if (!isValid) {
        return;
      }

      // Show loading state
      this.setSubmitState(true);
      
      // Simulate form submission (replace with actual API call)
      setTimeout(() => {
        this.showSuccessMessage();
        this.contactForm.reset();
        this.setSubmitState(false);
      }, 2000);
    }

    validateForm() {
      const inputs = this.contactForm.querySelectorAll('.form-input[required]');
      let isValid = true;
      
      inputs.forEach(input => {
        if (!this.validateField(input)) {
          isValid = false;
        }
      });
      
      return isValid;
    }

    validateField(input) {
      const value = input.value.trim();
      const type = input.type;
      let isValid = true;
      let errorMessage = '';

      // Required field validation
      if (input.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'This field is required.';
      }
      // Email validation
      else if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address.';
        }
      }

      this.showFieldError(input, isValid ? '' : errorMessage);
      return isValid;
    }

    showFieldError(input, message) {
      const formGroup = input.closest('.form-group');
      let errorElement = formGroup.querySelector('.field-error');
      
      if (message) {
        if (!errorElement) {
          errorElement = document.createElement('div');
          errorElement.className = 'field-error';
          errorElement.style.color = 'var(--color-danger)';
          errorElement.style.fontSize = 'var(--font-size-sm)';
          errorElement.style.marginTop = 'var(--space-1)';
          formGroup.appendChild(errorElement);
        }
        errorElement.textContent = message;
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', errorElement.id || 'error-' + input.name);
      } else {
        if (errorElement) {
          errorElement.remove();
        }
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
      }
    }

    clearErrors(input) {
      this.showFieldError(input, '');
    }

    setSubmitState(loading) {
      const submitBtn = this.contactForm.querySelector('button[type="submit"]');
      if (loading) {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
      } else {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
      }
    }

    showSuccessMessage() {
      // Create success message
      const successMessage = document.createElement('div');
      successMessage.className = 'success-message';
      successMessage.innerHTML = `
        <div style="
          background-color: var(--color-success);
          color: white;
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          margin-bottom: var(--space-4);
          text-align: center;
        ">
          ✅ Message sent successfully! We'll get back to you soon.
        </div>
      `;
      
      this.contactForm.insertBefore(successMessage, this.contactForm.firstChild);
      
      // Remove success message after 5 seconds
      setTimeout(() => {
        successMessage.remove();
      }, 5000);
    }
  }

  // Intersection Observer for animations
  class AnimationManager {
    constructor() {
      this.init();
    }

    init() {
      // Check if user prefers reduced motion
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      if (!prefersReducedMotion && 'IntersectionObserver' in window) {
        this.setupScrollAnimations();
      }
    }

    setupScrollAnimations() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      // Elements to animate
      const animatedElements = document.querySelectorAll(
        '.feature-card, .about-text, .tech-stack, .contact-form, .contact-info'
      );

      animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      });
    }
  }

  // Performance monitoring
  class PerformanceManager {
    constructor() {
      this.init();
    }

    init() {
      // Monitor Web Vitals if supported
      if ('performance' in window) {
        this.logLoadTime();
      }
    }

    logLoadTime() {
      window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page load time: ${loadTime.toFixed(2)}ms`);
        
        // Log navigation timing if available
        if (performance.getEntriesByType) {
          const navigation = performance.getEntriesByType('navigation')[0];
          if (navigation) {
            console.log('Navigation timing:', {
              domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
              load: navigation.loadEventEnd - navigation.loadEventStart
            });
          }
        }
      });
    }
  }

  // Initialize everything when DOM is ready
  function init() {
    new ThemeManager();
    new NavigationManager();
    new ScrollManager();
    new FormHandler();
    new AnimationManager();
    new PerformanceManager();
    
    // Add loaded class to body for CSS transitions
    document.body.classList.add('loaded');
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle page visibility changes for performance
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Pause non-essential animations when page is hidden
      document.body.classList.add('page-hidden');
    } else {
      document.body.classList.remove('page-hidden');
    }
  });

})();