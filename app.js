// ===================================
// ArenaX Application Logic
// ===================================

// ===================================
// State Management with Local Storage
// ===================================

class StateManager {
  // In-memory fallback storage when localStorage is unavailable
  static memoryStorage = {};
  static useMemoryStorage = false;

  // Check if localStorage is available
  static isLocalStorageAvailable() {
    try {
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('localStorage is not available, using in-memory storage');
      return false;
    }
  }

  // Initialize storage mode
  static initializeStorage() {
    this.useMemoryStorage = !this.isLocalStorageAvailable();
    
    if (this.useMemoryStorage) {
      showToast('Browser storage unavailable. Data will not persist after page refresh.', 'warning');
    }
  }

  // Get data from storage
  static get(key) {
    try {
      if (this.useMemoryStorage) {
        const data = this.memoryStorage[`arenax_${key}`];
        return data ? JSON.parse(JSON.stringify(data)) : null; // Deep clone
      }
      
      const data = localStorage.getItem(`arenax_${key}`);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Error reading from storage:', e);
      
      // Try memory storage as fallback
      if (!this.useMemoryStorage) {
        const data = this.memoryStorage[`arenax_${key}`];
        return data ? JSON.parse(JSON.stringify(data)) : null;
      }
      
      return null;
    }
  }

  // Save data to storage
  static set(key, value) {
    try {
      if (this.useMemoryStorage) {
        this.memoryStorage[`arenax_${key}`] = JSON.parse(JSON.stringify(value)); // Deep clone
        return true;
      }
      
      localStorage.setItem(`arenax_${key}`, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error('Error writing to storage:', e);
      
      if (e.name === 'QuotaExceededError') {
        showToast('Storage limit reached. Some data may not be saved.', 'error');
        
        // Try to save to memory storage as fallback
        try {
          this.memoryStorage[`arenax_${key}`] = JSON.parse(JSON.stringify(value));
          showToast('Data saved to temporary storage only.', 'warning');
          return true;
        } catch (memError) {
          console.error('Failed to save to memory storage:', memError);
          return false;
        }
      }
      
      // Try memory storage as fallback for other errors
      if (!this.useMemoryStorage) {
        try {
          this.memoryStorage[`arenax_${key}`] = JSON.parse(JSON.stringify(value));
          return true;
        } catch (memError) {
          console.error('Failed to save to memory storage:', memError);
          return false;
        }
      }
      
      return false;
    }
  }

  // Remove data from storage
  static remove(key) {
    try {
      if (this.useMemoryStorage) {
        delete this.memoryStorage[`arenax_${key}`];
        return true;
      }
      
      localStorage.removeItem(`arenax_${key}`);
      return true;
    } catch (e) {
      console.error('Error removing from storage:', e);
      
      // Try memory storage as fallback
      if (!this.useMemoryStorage) {
        delete this.memoryStorage[`arenax_${key}`];
      }
      
      return false;
    }
  }

  // Clear all ArenaX data
  static clearAll() {
    try {
      if (this.useMemoryStorage) {
        // Clear memory storage
        const keys = Object.keys(this.memoryStorage);
        keys.forEach(key => {
          if (key.startsWith('arenax_')) {
            delete this.memoryStorage[key];
          }
        });
        return true;
      }
      
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('arenax_')) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (e) {
      console.error('Error clearing storage:', e);
      return false;
    }
  }

  // Check if localStorage is available (legacy method name)
  static isAvailable() {
    return this.isLocalStorageAvailable();
  }

  // Initialize default data if not exists
  static initialize() {
    // Initialize storage mode first
    this.initializeStorage();
    
    if (!this.get('user_profile')) {
      this.set('user_profile', defaultUserProfile);
    }
    if (!this.get('bookings')) {
      this.set('bookings', []);
    }
    if (!this.get('community_posts')) {
      this.set('community_posts', samplePosts);
    }
    if (!this.get('rewards')) {
      this.set('rewards', defaultRewards);
    }
  }
}

// ===================================
// Data Persistence Helpers
// ===================================

// User Profile Functions
function saveUserProfile(profile) {
  return StateManager.set('user_profile', profile);
}

function loadUserProfile() {
  const profile = StateManager.get('user_profile');
  return profile || defaultUserProfile;
}

// Booking Functions
function saveBooking(booking) {
  const bookings = loadBookings();
  bookings.push(booking);
  return StateManager.set('bookings', bookings);
}

function loadBookings() {
  const bookings = StateManager.get('bookings');
  return bookings || [];
}

// Community Post Functions
function savePost(post) {
  const posts = loadPosts();
  posts.unshift(post); // Add to beginning of array
  return StateManager.set('community_posts', posts);
}

function loadPosts() {
  const posts = StateManager.get('community_posts');
  return posts || samplePosts;
}

// Rewards Functions
function saveRewards(rewardsData) {
  return StateManager.set('rewards', rewardsData);
}

function loadRewards() {
  const rewardsData = StateManager.get('rewards');
  return rewardsData || defaultRewards;
}

// ===================================
// Utility Functions
// ===================================

// Show toast notification
function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  
  // Support multi-line messages
  const lines = message.split('\n');
  if (lines.length > 1) {
    lines.forEach((line, index) => {
      const lineElement = document.createElement('div');
      lineElement.textContent = line;
      if (index === 0) {
        lineElement.style.fontWeight = '600';
        lineElement.style.marginBottom = '4px';
      }
      toast.appendChild(lineElement);
    });
  } else {
    toast.textContent = message;
  }
  
  container.appendChild(toast);
  
  // Auto-dismiss after 4 seconds (longer for booking confirmations)
  const dismissTime = type === 'success' ? 4000 : 3000;
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      if (container.contains(toast)) {
        container.removeChild(toast);
      }
    }, 300);
  }, dismissTime);
}

// Show error message for form field
function showError(inputElement, message) {
  if (!inputElement) return;
  
  // Add error class to input
  inputElement.classList.add('input-error');
  
  // Find or create error message element
  const errorId = `${inputElement.id}Error`;
  let errorElement = document.getElementById(errorId);
  
  if (!errorElement) {
    // Create error element if it doesn't exist
    errorElement = document.createElement('small');
    errorElement.id = errorId;
    errorElement.className = 'form-error';
    
    // Insert after the input element
    if (inputElement.nextSibling) {
      inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
    } else {
      inputElement.parentNode.appendChild(errorElement);
    }
  }
  
  errorElement.textContent = message;
  errorElement.style.display = 'block';
}

// Clear error message for form field
function clearError(inputElement) {
  if (!inputElement) return;
  
  // Remove error class from input
  inputElement.classList.remove('input-error');
  
  // Hide error message
  const errorId = `${inputElement.id}Error`;
  const errorElement = document.getElementById(errorId);
  
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
}

// Show success indicator for valid field
function showSuccess(inputElement) {
  if (!inputElement) return;
  
  // Add success class to input
  inputElement.classList.add('input-success');
  
  // Clear any error
  clearError(inputElement);
}

// Clear all validation states for a form
function clearFormValidation(formElement) {
  if (!formElement) return;
  
  const inputs = formElement.querySelectorAll('input, select, textarea');
  inputs.forEach(input => {
    input.classList.remove('input-error', 'input-success');
    clearError(input);
  });
}

// Validate required field
function validateRequired(inputElement, fieldName) {
  const value = inputElement.value.trim();
  
  if (!value) {
    showError(inputElement, `${fieldName} is required`);
    return false;
  }
  
  showSuccess(inputElement);
  return true;
}

// Validate email format
function validateEmail(inputElement) {
  const value = inputElement.value.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!value) {
    showError(inputElement, 'Email is required');
    return false;
  }
  
  if (!emailRegex.test(value)) {
    showError(inputElement, 'Please enter a valid email address');
    return false;
  }
  
  showSuccess(inputElement);
  return true;
}

// Validate number range
function validateNumberRange(inputElement, fieldName, min, max) {
  const value = parseInt(inputElement.value);
  
  if (isNaN(value)) {
    showError(inputElement, `${fieldName} must be a number`);
    return false;
  }
  
  if (value < min || value > max) {
    showError(inputElement, `${fieldName} must be between ${min} and ${max}`);
    return false;
  }
  
  showSuccess(inputElement);
  return true;
}

// Validate date is in future
function validateFutureDate(inputElement) {
  const value = inputElement.value;
  
  if (!value) {
    showError(inputElement, 'Date is required');
    return false;
  }
  
  const selectedDate = new Date(value);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    showError(inputElement, 'Please select a future date');
    return false;
  }
  
  showSuccess(inputElement);
  return true;
}

// Format currency in INR
function formatCurrency(amount) {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Format relative time
function formatRelativeTime(timestamp) {
  const now = Date.now();
  const diff = now - timestamp;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  return 'Just now';
}

// Generate unique ID
function generateId(prefix = 'id') {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Show loading spinner
function showLoading(message = 'Loading...') {
  // Remove existing loader if any
  hideLoading();
  
  const loader = document.createElement('div');
  loader.id = 'globalLoader';
  loader.className = 'loading-overlay';
  
  loader.innerHTML = `
    <div class="loading-spinner-container">
      <div class="loading-spinner"></div>
      <div class="loading-message">${message}</div>
    </div>
  `;
  
  document.body.appendChild(loader);
  document.body.style.overflow = 'hidden';
}

// Hide loading spinner
function hideLoading() {
  const loader = document.getElementById('globalLoader');
  if (loader) {
    loader.remove();
    document.body.style.overflow = 'auto';
  }
}

// Show loading state for a specific element
function showElementLoading(element, message = 'Loading...') {
  if (!element) return;
  
  // Store original content
  element.dataset.originalContent = element.innerHTML;
  element.classList.add('loading-state');
  
  element.innerHTML = `
    <div class="element-loading">
      <div class="loading-spinner-small"></div>
      <span>${message}</span>
    </div>
  `;
}

// Hide loading state for a specific element
function hideElementLoading(element) {
  if (!element) return;
  
  element.classList.remove('loading-state');
  
  if (element.dataset.originalContent) {
    element.innerHTML = element.dataset.originalContent;
    delete element.dataset.originalContent;
  }
}

// ===================================
// Navigation
// ===================================

function initNavigation() {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  // Toggle mobile menu
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const isExpanded = navMenu.classList.toggle('active');
      navToggle.classList.toggle('active');
      // Update aria-expanded attribute
      navToggle.setAttribute('aria-expanded', isExpanded);
      // Prevent body scroll when menu is open
      document.body.classList.toggle('menu-open');
    });
  }
  
  // Close menu when clicking outside
  if (navMenu) {
    navMenu.addEventListener('click', (e) => {
      // Close if clicking on the overlay (before pseudo-element)
      if (e.target === navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        if (navToggle) {
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('menu-open');
      }
    });
  }

  // Smooth scroll and close mobile menu
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        // Calculate offset for fixed navbar
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = targetSection.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu
        navMenu.classList.remove('active');
        if (navToggle) {
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('menu-open');
        
        // Update active link
        updateActiveNavLink(targetId);
      }
    });
  });

  // Highlight active section on scroll
  window.addEventListener('scroll', () => {
    highlightActiveSection();
  });

  // Initial highlight
  highlightActiveSection();

  // Profile button
  const btnProfile = document.getElementById('btnProfile');
  if (btnProfile) {
    btnProfile.addEventListener('click', () => {
      const profileSection = document.getElementById('profile');
      if (profileSection) {
        profileSection.style.display = 'block';
        const navbarHeight = navbar ? navbar.offsetHeight : 0;
        const targetPosition = profileSection.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu
        navMenu.classList.remove('active');
        if (navToggle) {
          navToggle.classList.remove('active');
          navToggle.setAttribute('aria-expanded', 'false');
        }
        document.body.classList.remove('menu-open');
      }
    });
  }
}

// Highlight active section based on scroll position
function highlightActiveSection() {
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');
  const navbarHeight = navbar ? navbar.offsetHeight : 0;
  const scrollPosition = window.scrollY + navbarHeight + 100; // Add offset for better detection

  // Get all sections
  const sections = Array.from(navLinks).map(link => {
    const targetId = link.getAttribute('href').substring(1);
    return document.getElementById(targetId);
  }).filter(section => section !== null);

  // Find the current section
  let currentSection = null;
  for (const section of sections) {
    if (section.offsetTop <= scrollPosition) {
      currentSection = section;
    }
  }

  // Update active link
  if (currentSection) {
    updateActiveNavLink(currentSection.id);
  }
}

// Update active navigation link
function updateActiveNavLink(sectionId) {
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    const targetId = link.getAttribute('href').substring(1);
    if (targetId === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ===================================
// Hero Section
// ===================================

function initHero() {
  const btnGetStarted = document.getElementById('btnGetStarted');
  if (btnGetStarted) {
    btnGetStarted.addEventListener('click', () => {
      const discoverSection = document.getElementById('discover');
      if (discoverSection) {
        discoverSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  // Typing effect for hero tagline
  const heroTagline = document.querySelector('.hero-tagline');
  if (heroTagline) {
    const text = heroTagline.textContent;
    heroTagline.textContent = '';
    heroTagline.style.opacity = '1';
    heroTagline.style.whiteSpace = 'normal'; // Allow text wrapping
    heroTagline.style.display = 'block'; // Make it block level
    
    let charIndex = 0;
    const typingSpeed = 80; // milliseconds per character
    const startDelay = 800; // delay before typing starts
    
    setTimeout(() => {
      const typingInterval = setInterval(() => {
        if (charIndex < text.length) {
          heroTagline.textContent += text.charAt(charIndex);
          charIndex++;
        } else {
          clearInterval(typingInterval);
          // Remove cursor after typing completes
          setTimeout(() => {
            heroTagline.style.borderRight = 'none';
          }, 500);
        }
      }, typingSpeed);
    }, startDelay);
  }
}

// ===================================
// Modal Management
// ===================================

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Store the element that opened the modal for focus restoration
    modal.dataset.previousFocus = document.activeElement.id || '';
    
    // Focus the first focusable element in the modal
    setTimeout(() => {
      const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }, 100);
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Restore focus to the element that opened the modal
    const previousFocusId = modal.dataset.previousFocus;
    if (previousFocusId) {
      const previousElement = document.getElementById(previousFocusId);
      if (previousElement) {
        previousElement.focus();
      }
    }
  }
}

function initModals() {
  // Close buttons
  const closeButtons = document.querySelectorAll('.modal-close');
  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal');
      if (modal) {
        closeModal(modal.id);
      }
    });
  });

  // Close on outside click
  const modals = document.querySelectorAll('.modal');
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal.id);
      }
    });
    
    // Keyboard navigation for modals
    modal.addEventListener('keydown', (e) => {
      // Close modal on Escape key
      if (e.key === 'Escape') {
        closeModal(modal.id);
      }
      
      // Trap focus within modal
      if (e.key === 'Tab') {
        trapFocusInModal(modal, e);
      }
    });
  });
}

// Trap focus within modal for keyboard navigation
function trapFocusInModal(modal, event) {
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  // If shift+tab on first element, focus last element
  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  }
  // If tab on last element, focus first element
  else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

// ===================================
// Keyboard Navigation Helpers
// ===================================

/**
 * Make an element keyboard accessible by adding Enter/Space key support
 * @param {HTMLElement} element - Element to make keyboard accessible
 * @param {Function} callback - Function to call when Enter or Space is pressed
 */
function makeKeyboardAccessible(element, callback) {
  if (!element) return;
  
  // Ensure element is focusable
  if (!element.hasAttribute('tabindex')) {
    element.setAttribute('tabindex', '0');
  }
  
  // Add keyboard event listener
  element.addEventListener('keydown', (e) => {
    // Trigger on Enter or Space key
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback(e);
    }
  });
}

/**
 * Add keyboard navigation to a collection of elements
 * @param {NodeList|Array} elements - Elements to add keyboard navigation to
 * @param {Function} callback - Function to call when element is activated
 */
function addKeyboardNavigation(elements, callback) {
  elements.forEach(element => {
    makeKeyboardAccessible(element, callback);
  });
}

// ===================================
// Scroll-Triggered Animations
// ===================================

function initScrollAnimations() {
  // Create Intersection Observer for scroll-triggered animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add 'animated' class when element enters viewport
        entry.target.classList.add('animated');
        
        // Trigger counter animation for market stat
        if (entry.target.id === 'marketStat' && !entry.target.classList.contains('counted')) {
          entry.target.classList.add('counted');
          animateCounter(entry.target);
        }
        
        // Optionally unobserve after animation to improve performance
        // Uncomment the line below if you want animations to trigger only once
        // observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all elements with animate-on-scroll class
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  animatedElements.forEach(el => observer.observe(el));
  
  // Observe market stat for counter animation
  const marketStat = document.getElementById('marketStat');
  if (marketStat) {
    observer.observe(marketStat);
  }
}

// ===================================
// Stagger Animations
// ===================================

/**
 * Apply stagger delays to a collection of elements
 * @param {NodeList|Array} elements - Elements to apply stagger to
 * @param {number} delayIncrement - Delay increment in milliseconds (default: 100ms)
 * @param {number} startDelay - Initial delay before first element (default: 0ms)
 */
function applyStaggerAnimation(elements, delayIncrement = 100, startDelay = 0) {
  elements.forEach((element, index) => {
    const delay = startDelay + (index * delayIncrement);
    element.style.setProperty('--stagger-delay', `${delay}ms`);
  });
}

/**
 * Apply stagger delays to card grids and lists
 * Automatically detects and applies stagger to common grid patterns
 */
function initStaggerAnimations() {
  // Apply stagger to problem cards
  const problemCards = document.querySelectorAll('.problem-card');
  if (problemCards.length > 0) {
    applyStaggerAnimation(problemCards, 100);
  }

  // Apply stagger to market point cards
  const marketCards = document.querySelectorAll('.market-point-card');
  if (marketCards.length > 0) {
    applyStaggerAnimation(marketCards, 150);
  }

  // Apply stagger to solution flow steps
  const solutionSteps = document.querySelectorAll('.solution-step');
  if (solutionSteps.length > 0) {
    applyStaggerAnimation(solutionSteps, 200);
  }

  // Apply stagger to solution arrows
  const solutionArrows = document.querySelectorAll('.solution-arrow');
  if (solutionArrows.length > 0) {
    solutionArrows.forEach((arrow, index) => {
      const delay = index * 200 + 100; // Offset by 100ms from steps
      arrow.style.setProperty('--stagger-delay', `${delay}ms`);
    });
  }

  // Apply stagger to arena cards
  const arenaCards = document.querySelectorAll('.arena-card');
  if (arenaCards.length > 0) {
    applyStaggerAnimation(arenaCards, 80);
  }

  // Apply stagger to subscription plan cards
  const planCards = document.querySelectorAll('.plan-card');
  if (planCards.length > 0) {
    applyStaggerAnimation(planCards, 150);
  }

  // Apply stagger to community posts
  const communityPosts = document.querySelectorAll('.community-post');
  if (communityPosts.length > 0) {
    applyStaggerAnimation(communityPosts, 100);
  }

  // Apply stagger to revenue cards
  const revenueCards = document.querySelectorAll('.revenue-card');
  if (revenueCards.length > 0) {
    applyStaggerAnimation(revenueCards, 150);
  }

  // Apply stagger to advantage cards
  const advantageCards = document.querySelectorAll('.advantage-card');
  if (advantageCards.length > 0) {
    applyStaggerAnimation(advantageCards, 150);
  }

  // Apply stagger to team cards
  const teamCards = document.querySelectorAll('.team-card');
  if (teamCards.length > 0) {
    applyStaggerAnimation(teamCards, 150);
  }

  // Apply stagger to trial offer cards
  const trialCards = document.querySelectorAll('.trial-offer-card');
  if (trialCards.length > 0) {
    applyStaggerAnimation(trialCards, 150);
  }

  // Apply stagger to reward cards
  const rewardCards = document.querySelectorAll('.reward-card');
  if (rewardCards.length > 0) {
    applyStaggerAnimation(rewardCards, 100);
  }

  // Apply stagger to achievement cards
  const achievementCards = document.querySelectorAll('.achievement-card');
  if (achievementCards.length > 0) {
    applyStaggerAnimation(achievementCards, 100);
  }
}

// ===================================
// Counter Animation
// ===================================

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000; // 2 seconds
  const startTime = performance.now();
  const startValue = 0;

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
    
    element.textContent = `$${currentValue}B+`;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = `$${target}B+`;
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// ===================================
// Trial Offers Section
// ===================================

function renderTrialOffers() {
  const trialOffersGrid = document.getElementById('trialOffersGrid');
  if (!trialOffersGrid) return;

  trialOffersGrid.innerHTML = '';

  // Filter arenas that have trial available
  const trialArenas = arenas.filter(arena => arena.trialAvailable);

  // Show up to 6 trial offers
  const displayArenas = trialArenas.slice(0, 6);

  displayArenas.forEach((arena, index) => {
    const trialCard = document.createElement('div');
    trialCard.className = 'trial-offer-card animate-on-scroll';
    trialCard.style.setProperty('--stagger-delay', `${index * 150}ms`);
    
    // Get sport badges
    const sportBadges = arena.sports.map(sportId => {
      const sport = sports.find(s => s.id === sportId);
      if (!sport) return '';
      return `
        <span class="trial-offer-sport-badge">
          <span>${sport.icon}</span>
          <span>${sport.name}</span>
        </span>
      `;
    }).join('');

    // Get first sport icon for display
    const firstSport = sports.find(s => s.id === arena.sports[0]);
    const sportIcon = firstSport ? firstSport.icon : '🏃';

    // Calculate trial price (50% off)
    const trialPrice = Math.round(arena.pricePerHour * 0.5);

    trialCard.innerHTML = `
      <div class="trial-offer-badge" aria-label="Trial session offer">🎁 Trial Session</div>
      <div class="trial-offer-header">
        <div class="trial-offer-info">
          <h3 class="trial-offer-arena-name">${arena.name}</h3>
          <div class="trial-offer-location">${arena.location}, ${arena.city}</div>
        </div>
        <div class="trial-offer-icon" aria-hidden="true">${sportIcon}</div>
      </div>
      <div class="trial-offer-body">
        <div class="trial-offer-sports" role="list" aria-label="Available sports">
          ${sportBadges}
        </div>
        <div class="trial-offer-highlight">
          <div class="trial-offer-highlight-text">
            <span class="trial-offer-highlight-icon" aria-hidden="true">🎾</span>
            <span>Equipment Included • No Extra Cost</span>
          </div>
        </div>
        <div class="trial-offer-details">
          <div class="trial-offer-detail">
            <span class="trial-offer-detail-icon" aria-hidden="true">⏱️</span>
            <span>1 Hour Session</span>
          </div>
          <div class="trial-offer-detail">
            <span class="trial-offer-detail-icon" aria-hidden="true">⭐</span>
            <span>${arena.rating.toFixed(1)} Rating</span>
          </div>
        </div>
        <div class="trial-offer-pricing">
          <div class="trial-offer-price">
            <span class="trial-offer-price-original">${formatCurrency(arena.pricePerHour)}</span>
            <span class="trial-offer-price-trial">${formatCurrency(trialPrice)}</span>
          </div>
          <div class="trial-offer-price-label">50% OFF</div>
        </div>
      </div>
      <div class="trial-offer-footer">
        <button class="trial-offer-btn" aria-label="Book trial session at ${arena.name}">
          Book Trial Session
        </button>
      </div>
    `;
    
    // Add click handler to button instead of using onclick
    const bookButton = trialCard.querySelector('.trial-offer-btn');
    if (bookButton) {
      bookButton.addEventListener('click', () => bookTrialSession(arena.id));
    }
    
    trialOffersGrid.appendChild(trialCard);
  });

  // Re-initialize scroll animations after rendering
  setTimeout(() => initScrollAnimations(), 100);
}

// Book trial session
function bookTrialSession(arenaId) {
  const arena = arenas.find(a => a.id === arenaId);
  if (!arena) return;

  // Open booking modal with trial flag
  currentBookingArena = arena;
  currentBookingIsTrial = true;
  openBookingModal(arenaId);
}

// ===================================
// Problem Statement Section
// ===================================

function renderProblems() {
  const problemsGrid = document.getElementById('problemsGrid');
  if (!problemsGrid) return;

  problemsGrid.innerHTML = '';

  problems.forEach((problem, index) => {
    const problemCard = document.createElement('div');
    problemCard.className = 'card problem-card animate-on-scroll';
    problemCard.style.setProperty('--stagger-delay', `${index * 100}ms`);
    problemCard.setAttribute('role', 'listitem');
    
    problemCard.innerHTML = `
      <div class="problem-icon" aria-hidden="true">${problem.icon}</div>
      <h3 class="problem-title">${problem.title}</h3>
      <p class="problem-description">${problem.description}</p>
    `;
    
    problemsGrid.appendChild(problemCard);
  });

  // Re-initialize scroll animations after rendering
  setTimeout(() => initScrollAnimations(), 100);
}

// ===================================
// Solution Flow Section
// ===================================

function renderSolutionFlow() {
  const solutionFlowContainer = document.getElementById('solutionFlow');
  if (!solutionFlowContainer) return;

  solutionFlowContainer.innerHTML = '';

  solutionFlow.forEach((step, index) => {
    // Create step card
    const stepCard = document.createElement('div');
    stepCard.className = 'solution-step animate-on-scroll';
    stepCard.style.setProperty('--stagger-delay', `${index * 200}ms`);
    
    stepCard.innerHTML = `
      <div class="solution-step-number">${step.step}</div>
      <div class="solution-step-icon">${step.icon}</div>
      <h3 class="solution-step-name">${step.name}</h3>
      <p class="solution-step-description">${step.description}</p>
    `;
    
    solutionFlowContainer.appendChild(stepCard);

    // Add arrow between steps (except after the last step)
    if (index < solutionFlow.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'solution-arrow animate-on-scroll';
      arrow.style.setProperty('--stagger-delay', `${index * 200 + 100}ms`);
      arrow.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 20 L30 20 M30 20 L24 14 M30 20 L24 26" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      `;
      solutionFlowContainer.appendChild(arrow);
    }
  });

  // Re-initialize scroll animations after rendering
  setTimeout(() => initScrollAnimations(), 100);
}

// ===================================
// Market Opportunity Section
// ===================================

function renderMarketOpportunity() {
  const marketStat = document.getElementById('marketStat');
  const marketPoints = document.getElementById('marketPoints');
  
  if (!marketStat || !marketPoints) return;

  // Set initial market stat to 0 for counter animation
  marketStat.textContent = '$0B+';
  marketStat.setAttribute('data-target', marketOpportunity.marketSize);
  marketStat.classList.add('animate-on-scroll');

  // Render market opportunity points
  marketPoints.innerHTML = '';

  marketOpportunity.points.forEach((point, index) => {
    const pointCard = document.createElement('div');
    pointCard.className = 'card market-point-card animate-on-scroll';
    pointCard.style.setProperty('--stagger-delay', `${index * 150}ms`);
    
    pointCard.innerHTML = `
      <div class="market-point-icon">${point.icon}</div>
      <h3 class="market-point-title">${point.title}</h3>
      <p class="market-point-description">${point.description}</p>
    `;
    
    marketPoints.appendChild(pointCard);
  });

  // Re-initialize scroll animations after rendering
  setTimeout(() => initScrollAnimations(), 100);
}

// ===================================
// Subscription Plans Feature
// ===================================

// Render subscription plans
function renderSubscriptionPlans() {
  const plansGrid = document.getElementById('plansGrid');
  if (!plansGrid) return;

  plansGrid.innerHTML = '';

  subscriptionPlans.forEach((plan, index) => {
    const planCard = createPlanCard(plan, index);
    plansGrid.appendChild(planCard);
  });

  // Re-initialize scroll animations
  setTimeout(() => initScrollAnimations(), 100);
  
  // Load and highlight selected plan
  const selectedPlanId = StateManager.get('selected_plan');
  if (selectedPlanId) {
    highlightSelectedPlan(selectedPlanId);
  }
}

// Create plan card HTML
function createPlanCard(plan, index) {
  const card = document.createElement('div');
  card.className = 'card plan-card animate-on-scroll';
  card.style.setProperty('--stagger-delay', `${index * 150}ms`);
  card.dataset.planId = plan.id;

  // Add popular badge if applicable
  const popularBadge = plan.popular 
    ? '<div class="plan-badge-popular">Most Popular</div>' 
    : '';

  // Generate benefits list
  const benefitsList = plan.benefits.map(benefit => `
    <li class="plan-benefit">
      <span class="plan-benefit-icon">✓</span>
      ${benefit}
    </li>
  `).join('');

  card.innerHTML = `
    ${popularBadge}
    <div class="plan-card-header">
      <h3 class="plan-name">${plan.name}</h3>
      <div class="plan-price">
        <span class="plan-price-currency">₹</span>
        <span class="plan-price-amount">${plan.price.toLocaleString('en-IN')}</span>
        <span class="plan-price-period">/${plan.period}</span>
      </div>
    </div>
    <div class="plan-card-body">
      <ul class="plan-benefits">
        ${benefitsList}
      </ul>
    </div>
    <div class="plan-card-footer">
      <button class="btn-plan-select" onclick="selectPlan('${plan.id}')">
        Select Plan
      </button>
    </div>
  `;

  return card;
}

// Select a subscription plan
function selectPlan(planId) {
  // Save selection to local storage
  StateManager.set('selected_plan', planId);
  
  // Update user profile
  const profile = loadUserProfile();
  profile.selectedPlan = planId;
  saveUserProfile(profile);
  
  // Highlight selected plan
  highlightSelectedPlan(planId);
  
  // Show success message
  const plan = subscriptionPlans.find(p => p.id === planId);
  if (plan) {
    showToast(`${plan.name} plan selected! Your preferences have been saved.`, 'success');
  }
}

// Highlight the selected plan
function highlightSelectedPlan(planId) {
  // Remove selected class from all plan cards
  document.querySelectorAll('.plan-card').forEach(card => {
    card.classList.remove('plan-selected');
    const button = card.querySelector('.btn-plan-select');
    if (button) {
      button.textContent = 'Select Plan';
      button.classList.remove('btn-plan-selected');
    }
  });
  
  // Add selected class to the chosen plan
  const selectedCard = document.querySelector(`.plan-card[data-plan-id="${planId}"]`);
  if (selectedCard) {
    selectedCard.classList.add('plan-selected');
    const button = selectedCard.querySelector('.btn-plan-select');
    if (button) {
      button.textContent = 'Selected ✓';
      button.classList.add('btn-plan-selected');
    }
  }
}

// ===================================
// Revenue Streams Section
// ===================================

function renderRevenueStreams() {
  const revenueGrid = document.getElementById('revenueGrid');
  if (!revenueGrid) return;

  revenueGrid.innerHTML = '';

  revenueStreams.forEach((stream, index) => {
    const streamCard = document.createElement('div');
    streamCard.className = 'card revenue-card animate-on-scroll';
    streamCard.style.setProperty('--stagger-delay', `${index * 150}ms`);
    
    streamCard.innerHTML = `
      <div class="revenue-icon">${stream.icon}</div>
      <h3 class="revenue-title">${stream.title}</h3>
      <p class="revenue-description">${stream.description}</p>
    `;
    
    revenueGrid.appendChild(streamCard);
  });

  // Render scalability subsection
  renderScalability();

  // Re-initialize scroll animations after rendering
  setTimeout(() => initScrollAnimations(), 100);
}

function renderScalability() {
  const scalabilityContent = document.getElementById('scalabilityContent');
  if (!scalabilityContent) return;

  scalabilityContent.innerHTML = '';

  // Render Expansion Strategies
  const expansionCategory = document.createElement('div');
  expansionCategory.className = 'scalability-category animate-on-scroll';
  expansionCategory.style.setProperty('--stagger-delay', '0ms');
  
  expansionCategory.innerHTML = `
    <h4 class="scalability-category-title">
      <span class="scalability-category-icon">🚀</span>
      Expansion Strategies
    </h4>
    <ul class="scalability-list">
      ${scalability.expansion.map(item => `
        <li class="scalability-list-item">${item}</li>
      `).join('')}
    </ul>
  `;
  
  scalabilityContent.appendChild(expansionCategory);

  // Render Partnership Opportunities
  const partnershipsCategory = document.createElement('div');
  partnershipsCategory.className = 'scalability-category animate-on-scroll';
  partnershipsCategory.style.setProperty('--stagger-delay', '150ms');
  
  partnershipsCategory.innerHTML = `
    <h4 class="scalability-category-title">
      <span class="scalability-category-icon">🤝</span>
      Partnership Opportunities
    </h4>
    <ul class="scalability-list">
      ${scalability.partnerships.map(item => `
        <li class="scalability-list-item">${item}</li>
      `).join('')}
    </ul>
  `;
  
  scalabilityContent.appendChild(partnershipsCategory);
}

// ===================================
// Competitive Advantages Section
// ===================================

function renderAdvantages() {
  const advantagesGrid = document.getElementById('advantagesGrid');
  if (!advantagesGrid) return;

  advantagesGrid.innerHTML = '';

  advantages.forEach((advantage, index) => {
    const advantageCard = document.createElement('div');
    advantageCard.className = 'card advantage-card animate-on-scroll';
    advantageCard.style.setProperty('--stagger-delay', `${index * 150}ms`);
    
    advantageCard.innerHTML = `
      <div class="advantage-icon">${advantage.icon}</div>
      <h3 class="advantage-title">${advantage.title}</h3>
      <p class="advantage-description">${advantage.description}</p>
    `;
    
    advantagesGrid.appendChild(advantageCard);
  });

  // Re-initialize scroll animations after rendering
  setTimeout(() => initScrollAnimations(), 100);
}

// ===================================
// Team Section
// ===================================

function renderTeam() {
  const teamGrid = document.getElementById('teamGrid');
  if (!teamGrid) return;

  teamGrid.innerHTML = '';

  teamMembers.forEach((member, index) => {
    const teamCard = document.createElement('div');
    teamCard.className = 'card team-card animate-on-scroll';
    teamCard.style.setProperty('--stagger-delay', `${index * 150}ms`);
    teamCard.setAttribute('role', 'listitem');
    
    // Generate initials for avatar placeholder
    const initials = member.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
    
    teamCard.innerHTML = `
      <div class="team-avatar" aria-label="Avatar for ${member.name}">${initials}</div>
      <h3 class="team-name">${member.name}</h3>
      <p class="team-role">${member.role}</p>
      <p class="team-bio">${member.bio}</p>
    `;
    
    teamGrid.appendChild(teamCard);
  });

  // Re-initialize scroll animations after rendering
  setTimeout(() => initScrollAnimations(), 100);
}

// ===================================
// Initialization
// ===================================

document.addEventListener('DOMContentLoaded', () => {
  // Check localStorage availability
  if (!StateManager.isAvailable()) {
    console.warn('localStorage is not available. Using in-memory storage.');
    showToast('Some features may not persist across sessions.', 'warning');
  }

  // Initialize state
  StateManager.initialize();

  // Initialize components
  initNavigation();
  initHero();
  initModals();
  renderTrialOffers();
  renderProblems();
  renderMarketOpportunity();
  renderSolutionFlow();
  initArenaDiscovery();
  initBooking();
  renderSubscriptionPlans();
  initCommunity();
  initRewards();
  initProfile();
  renderRevenueStreams();
  renderAdvantages();
  renderTeam();
  initStaggerAnimations();
  initScrollAnimations();
  initTouchFeedback();
  optimizeMobileBookingFlow();

  console.log('ArenaX MVP initialized successfully');
});

// ===================================
// Arena Discovery Feature
// ===================================

// State for arena filters
let arenaFilters = {
  city: '',
  sport: '',
  searchText: ''
};

// Initialize Arena Discovery
function initArenaDiscovery() {
  populateCitySelector();
  renderSportFilters();
  initArenaFilters();
  
  // Apply initial filters (including saved city preference)
  applyArenaFilters();
}

// Populate city selector dropdown
function populateCitySelector() {
  const citySelect = document.getElementById('citySelect');
  if (!citySelect) return;

  // Clear existing options except the first one
  citySelect.innerHTML = '<option value="">All Cities</option>';

  // Add city options
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });

  // Load saved city preference
  const savedCity = StateManager.get('selected_city');
  if (savedCity) {
    citySelect.value = savedCity;
    arenaFilters.city = savedCity;
  }
}

// Render sport filter chips
function renderSportFilters() {
  const sportFiltersContainer = document.getElementById('sportFilters');
  if (!sportFiltersContainer) return;

  sportFiltersContainer.innerHTML = '';

  sports.forEach((sport, index) => {
    const chip = document.createElement('button');
    chip.className = 'sport-chip';
    chip.dataset.sportId = sport.id;
    chip.style.setProperty('--chip-index', index);
    chip.setAttribute('aria-pressed', 'false');
    chip.setAttribute('aria-label', `Filter by ${sport.name}`);
    
    chip.innerHTML = `
      <span class="sport-chip-icon" aria-hidden="true">${sport.icon}</span>
      <span class="sport-chip-name">${sport.name}</span>
    `;
    
    chip.addEventListener('click', () => {
      toggleSportFilter(sport.id, chip);
    });
    
    // Keyboard support is built-in for button elements
    
    sportFiltersContainer.appendChild(chip);
  });
}

// Toggle sport filter
function toggleSportFilter(sportId, chipElement) {
  // Toggle active state
  if (arenaFilters.sport === sportId) {
    // Deselect
    arenaFilters.sport = '';
    chipElement.classList.remove('active');
    chipElement.setAttribute('aria-pressed', 'false');
  } else {
    // Select new sport
    arenaFilters.sport = sportId;
    
    // Remove active from all chips
    document.querySelectorAll('.sport-chip').forEach(chip => {
      chip.classList.remove('active');
      chip.setAttribute('aria-pressed', 'false');
    });
    
    // Add active to clicked chip
    chipElement.classList.add('active');
    chipElement.setAttribute('aria-pressed', 'true');
  }
  
  // Apply filters
  applyArenaFilters();
}

// Initialize arena filter event listeners
function initArenaFilters() {
  const citySelect = document.getElementById('citySelect');
  const searchInput = document.getElementById('searchInput');

  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      arenaFilters.city = e.target.value;
      
      // Save city preference
      if (e.target.value) {
        StateManager.set('selected_city', e.target.value);
      } else {
        StateManager.remove('selected_city');
      }
      
      applyArenaFilters();
    });
  }

  if (searchInput) {
    const searchClearBtn = document.getElementById('searchClearBtn');
    
    searchInput.addEventListener('input', (e) => {
      arenaFilters.searchText = e.target.value.toLowerCase().trim();
      
      // Show/hide clear button
      if (searchClearBtn) {
        if (e.target.value.trim()) {
          searchClearBtn.classList.add('visible');
        } else {
          searchClearBtn.classList.remove('visible');
        }
      }
      
      applyArenaFilters();
    });
    
    // Clear button functionality
    if (searchClearBtn) {
      searchClearBtn.addEventListener('click', () => {
        searchInput.value = '';
        arenaFilters.searchText = '';
        searchClearBtn.classList.remove('visible');
        searchInput.focus();
        applyArenaFilters();
      });
    }
  }
}

// Filter arenas by city
function filterArenasByCity(arenasList, city) {
  if (!city) return arenasList;
  return arenasList.filter(arena => arena.city === city);
}

// Filter arenas by sport
function filterArenasBySport(arenasList, sportId) {
  if (!sportId) return arenasList;
  return arenasList.filter(arena => arena.sports.includes(sportId));
}

// Filter arenas by search text
function filterArenasBySearch(arenasList, searchText) {
  if (!searchText) return arenasList;
  
  return arenasList.filter(arena => {
    // Search in arena name
    if (arena.name.toLowerCase().includes(searchText)) return true;
    
    // Search in location
    if (arena.location.toLowerCase().includes(searchText)) return true;
    
    // Search in city
    if (arena.city.toLowerCase().includes(searchText)) return true;
    
    // Search in sports
    const sportNames = arena.sports.map(sportId => {
      const sport = sports.find(s => s.id === sportId);
      return sport ? sport.name.toLowerCase() : '';
    });
    
    if (sportNames.some(name => name.includes(searchText))) return true;
    
    return false;
  });
}

// Highlight matching text in search results
function highlightText(text, searchText) {
  if (!searchText || !text) return text;
  
  const regex = new RegExp(`(${searchText})`, 'gi');
  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

// Clear all arena filters
function clearAllFilters() {
  // Reset filter state
  arenaFilters.city = '';
  arenaFilters.sport = '';
  arenaFilters.searchText = '';
  
  // Reset UI elements
  const citySelect = document.getElementById('citySelect');
  const searchInput = document.getElementById('searchInput');
  const searchClearBtn = document.getElementById('searchClearBtn');
  
  if (citySelect) {
    citySelect.value = '';
  }
  
  if (searchInput) {
    searchInput.value = '';
  }
  
  if (searchClearBtn) {
    searchClearBtn.classList.remove('visible');
  }
  
  // Remove active class from all sport chips
  document.querySelectorAll('.sport-chip').forEach(chip => {
    chip.classList.remove('active');
  });
  
  // Remove saved city preference
  StateManager.remove('selected_city');
  
  // Apply filters (will show all arenas)
  applyArenaFilters();
  
  // Show success message
  showToast('All filters cleared', 'info');
}

// Apply all arena filters
function applyArenaFilters() {
  let filteredArenas = [...arenas];
  
  // Apply city filter
  filteredArenas = filterArenasByCity(filteredArenas, arenaFilters.city);
  
  // Apply sport filter
  filteredArenas = filterArenasBySport(filteredArenas, arenaFilters.sport);
  
  // Apply search filter
  filteredArenas = filterArenasBySearch(filteredArenas, arenaFilters.searchText);
  
  // Render filtered arenas
  renderArenaCards(filteredArenas);
}

// Render arena cards
function renderArenaCards(arenasList) {
  const arenasGrid = document.getElementById('arenasGrid');
  if (!arenasGrid) return;

  // Clear existing cards
  arenasGrid.innerHTML = '';

  // Check if no arenas found
  if (arenasList.length === 0) {
    renderNoArenasMessage(arenasGrid);
    return;
  }

  // Render each arena card
  arenasList.forEach((arena, index) => {
    const arenaCard = createArenaCard(arena, index);
    arenasGrid.appendChild(arenaCard);
  });

  // Re-initialize scroll animations
  setTimeout(() => initScrollAnimations(), 100);
}

// Create arena card HTML
function createArenaCard(arena, index) {
  const card = document.createElement('div');
  card.className = 'card arena-card animate-on-scroll';
  card.style.setProperty('--stagger-delay', `${index * 100}ms`);
  card.dataset.arenaId = arena.id;

  // Apply text highlighting if search is active
  const searchText = arenaFilters.searchText;
  const arenaName = searchText ? highlightText(arena.name, searchText) : arena.name;
  const arenaLocation = searchText ? highlightText(arena.location, searchText) : arena.location;
  const arenaCity = searchText ? highlightText(arena.city, searchText) : arena.city;

  // Get sport badges HTML with highlighting
  const sportBadges = arena.sports.map(sportId => {
    const sport = sports.find(s => s.id === sportId);
    if (!sport) return '';
    const sportName = searchText ? highlightText(sport.name, searchText) : sport.name;
    return `
      <span class="arena-sport-badge">
        <span class="arena-sport-badge-icon">${sport.icon}</span>
        ${sportName}
      </span>
    `;
  }).join('');

  // Generate star rating display
  const fullStars = Math.floor(arena.rating);
  const hasHalfStar = arena.rating % 1 >= 0.5;
  const starsDisplay = '⭐'.repeat(fullStars) + (hasHalfStar ? '½' : '');

  // Trial badge with equipment highlight
  const trialBadge = arena.trialAvailable 
    ? '<span class="arena-card-trial"><span class="arena-card-trial-icon">🎾</span>Trial Available • Equipment Included</span>' 
    : '';

  card.innerHTML = `
    <div class="arena-card-header">
      <h3 class="arena-card-name">${arenaName}</h3>
      <div class="arena-card-location">${arenaLocation}, ${arenaCity}</div>
      <div class="arena-card-rating">
        <span class="arena-card-rating-stars" aria-label="${arena.rating} star rating">${starsDisplay}</span>
        <span aria-hidden="true">${arena.rating.toFixed(1)}</span>
      </div>
    </div>
    <div class="arena-card-body">
      ${trialBadge}
      <div class="arena-card-sports" role="list" aria-label="Available sports">
        ${sportBadges}
      </div>
      <div class="arena-card-price">
        ${formatCurrency(arena.pricePerHour)}
        <span class="arena-card-price-label">per hour</span>
      </div>
    </div>
    <div class="arena-card-footer">
      <button class="arena-card-btn" aria-label="View details for ${arena.name}">
        View Details
      </button>
    </div>
  `;
  
  // Add click handler to button
  const viewButton = card.querySelector('.arena-card-btn');
  if (viewButton) {
    viewButton.addEventListener('click', () => viewArenaDetails(arena.id));
  }

  return card;
}

// Render "No arenas found" message
function renderNoArenasMessage(container) {
  const noResultsDiv = document.createElement('div');
  noResultsDiv.className = 'no-results';
  
  let suggestions = 'Try adjusting your filters or search terms.';
  let suggestionsList = [
    'Clear some filters to see more results',
    'Check your spelling',
    'Try a different city or sport'
  ];
  
  if (arenaFilters.city && arenaFilters.sport && arenaFilters.searchText) {
    suggestions = `No arenas match your search in ${arenaFilters.city} offering ${getSportName(arenaFilters.sport)}.`;
    suggestionsList = [
      'Try a broader search term',
      'Remove the city or sport filter',
      'Check your spelling'
    ];
  } else if (arenaFilters.city && arenaFilters.sport) {
    suggestions = `No arenas found in ${arenaFilters.city} offering ${getSportName(arenaFilters.sport)}.`;
    suggestionsList = [
      'Try selecting a different city',
      'Try selecting a different sport',
      'Clear all filters to see all arenas'
    ];
  } else if (arenaFilters.city && arenaFilters.searchText) {
    suggestions = `No arenas match "${arenaFilters.searchText}" in ${arenaFilters.city}.`;
    suggestionsList = [
      'Try a different search term',
      'Select a different city',
      'Clear the search to see all arenas in this city'
    ];
  } else if (arenaFilters.sport && arenaFilters.searchText) {
    suggestions = `No arenas match "${arenaFilters.searchText}" offering ${getSportName(arenaFilters.sport)}.`;
    suggestionsList = [
      'Try a broader search term',
      'Select a different sport',
      'Clear filters to see all results'
    ];
  } else if (arenaFilters.city) {
    suggestions = `No arenas found in ${arenaFilters.city}.`;
    suggestionsList = [
      'Try selecting a different city',
      'Clear the city filter to see all arenas'
    ];
  } else if (arenaFilters.sport) {
    suggestions = `No arenas found offering ${getSportName(arenaFilters.sport)}.`;
    suggestionsList = [
      'Try selecting a different sport',
      'Clear the sport filter to see all arenas'
    ];
  } else if (arenaFilters.searchText) {
    suggestions = `No arenas match "${arenaFilters.searchText}".`;
    suggestionsList = [
      'Check your spelling',
      'Try a different search term',
      'Use more general keywords (e.g., "badminton" instead of "badminton court")',
      'Clear the search to see all arenas'
    ];
  }
  
  const suggestionsHTML = suggestionsList.map(s => `<li>• ${s}</li>`).join('');
  
  noResultsDiv.innerHTML = `
    <div class="no-results-icon">🔍</div>
    <h3 class="no-results-title">No Arenas Found</h3>
    <p class="no-results-message">${suggestions}</p>
    <div class="no-results-suggestions">
      <p><strong>Suggestions:</strong></p>
      <ul style="list-style: none; padding: 0; margin: 0;">
        ${suggestionsHTML}
      </ul>
    </div>
    <button class="btn-primary" onclick="clearAllFilters()" style="margin-top: var(--spacing-lg);">
      Clear All Filters
    </button>
  `;
  
  container.appendChild(noResultsDiv);
}

// Get sport name by ID
function getSportName(sportId) {
  const sport = sports.find(s => s.id === sportId);
  return sport ? sport.name : sportId;
}

// View arena details
function viewArenaDetails(arenaId) {
  const arena = arenas.find(a => a.id === arenaId);
  if (!arena) return;
  
  // Open booking modal directly
  openBookingModal(arenaId);
}


// ===================================
// Booking Feature
// ===================================

// Current booking state
let currentBookingArena = null;
let currentBookingIsTrial = false;

// Initialize booking feature
function initBooking() {
  const bookingForm = document.getElementById('bookingForm');
  const bookingSport = document.getElementById('bookingSport');
  const bookingDate = document.getElementById('bookingDate');
  const bookingDuration = document.getElementById('bookingDuration');
  const bookingPlayers = document.getElementById('bookingPlayers');
  const bookingEquipment = document.getElementById('bookingEquipment');
  const closeBookingModal = document.getElementById('closeBookingModal');

  // Set minimum date to today
  if (bookingDate) {
    const today = new Date().toISOString().split('T')[0];
    bookingDate.setAttribute('min', today);
    
    // Set max date to 30 days from now
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    bookingDate.setAttribute('max', maxDate.toISOString().split('T')[0]);
    
    // Event listener for date change
    bookingDate.addEventListener('change', () => {
      renderTimeSlots();
      calculateBookingCost();
      validateBookingField('bookingDate');
    });
    
    // Also listen for input event (for better responsiveness)
    bookingDate.addEventListener('input', () => {
      renderTimeSlots();
      calculateBookingCost();
      validateBookingField('bookingDate');
    });
  }
  
  // Event listener for sport selection
  if (bookingSport) {
    bookingSport.addEventListener('change', () => {
      validateBookingField('bookingSport');
      calculateBookingCost();
    });
  }

  if (bookingDuration) {
    bookingDuration.addEventListener('change', () => {
      calculateBookingCost();
      validateBookingField('bookingDuration');
    });
  }

  if (bookingPlayers) {
    bookingPlayers.addEventListener('input', () => {
      calculateBookingCost();
      validateBookingField('bookingPlayers');
    });
  }

  if (bookingEquipment) {
    bookingEquipment.addEventListener('change', () => {
      calculateBookingCost();
    });
  }

  // Form submission
  if (bookingForm) {
    bookingForm.addEventListener('submit', handleBookingSubmit);
  }

  // Close modal
  if (closeBookingModal) {
    closeBookingModal.addEventListener('click', () => {
      closeModal('bookingModal');
      resetBookingForm();
    });
  }
}

// Open booking modal for a specific arena
function openBookingModal(arenaId) {
  const arena = arenas.find(a => a.id === arenaId);
  if (!arena) {
    showToast('Arena not found', 'error');
    return;
  }

  // Reset form FIRST (before setting arena)
  resetBookingForm();
  
  // NOW set the current arena
  currentBookingArena = arena;

  // Populate arena info
  const arenaInfo = document.getElementById('bookingArenaInfo');
  if (arenaInfo) {
    const trialBadge = currentBookingIsTrial 
      ? '<div class="booking-trial-badge">🎁 Trial Session • 50% OFF • Equipment Included</div>' 
      : '';
    arenaInfo.innerHTML = `
      ${trialBadge}
      <div class="booking-arena-name">${arena.name}</div>
      <div class="booking-arena-location">${arena.location}, ${arena.city}</div>
    `;
  }

  // Populate sports dropdown
  populateBookingSports(arena);

  // Open modal
  openModal('bookingModal');
}

// Populate sports dropdown based on arena
function populateBookingSports(arena) {
  const sportSelect = document.getElementById('bookingSport');
  if (!sportSelect) return;

  sportSelect.innerHTML = '<option value="">Select sport</option>';

  arena.sports.forEach(sportId => {
    const sport = sports.find(s => s.id === sportId);
    if (sport) {
      const option = document.createElement('option');
      option.value = sport.id;
      option.textContent = `${sport.icon} ${sport.name}`;
      sportSelect.appendChild(option);
    }
  });
  
  // Event listener is already added in initBooking(), no need to add again
}

// Render time slots based on selected date
function renderTimeSlots() {
  const timeSlotsContainer = document.getElementById('bookingTimeSlots');
  const dateInput = document.getElementById('bookingDate');
  const timeInput = document.getElementById('bookingTime');

  console.log('renderTimeSlots called', {
    hasContainer: !!timeSlotsContainer,
    hasDateInput: !!dateInput,
    hasArena: !!currentBookingArena,
    dateValue: dateInput?.value
  });

  if (!timeSlotsContainer || !dateInput || !currentBookingArena) {
    console.log('Missing required elements for time slots');
    return;
  }

  const selectedDate = dateInput.value;
  if (!selectedDate) {
    timeSlotsContainer.innerHTML = '<p class="text-secondary text-small">Please select a date first</p>';
    return;
  }

  // Clear previous selection
  if (timeInput) {
    timeInput.value = '';
    clearError(timeInput);
  }

  timeSlotsContainer.innerHTML = '';

  // Get available slots for the arena
  const availableSlots = currentBookingArena.availableSlots || [];
  console.log('Available slots:', availableSlots);

  if (availableSlots.length === 0) {
    timeSlotsContainer.innerHTML = '<p class="text-secondary text-small">No time slots available</p>';
    return;
  }

  // Check if selected date is today
  const today = new Date().toISOString().split('T')[0];
  const isToday = selectedDate === today;
  const currentTime = new Date().getHours();

  // Render time slots
  availableSlots.forEach(slot => {
    const slotButton = document.createElement('button');
    slotButton.type = 'button';
    slotButton.className = 'time-slot';
    slotButton.textContent = slot;
    slotButton.dataset.slot = slot;
    slotButton.setAttribute('aria-label', `Time slot ${slot}`);
    slotButton.setAttribute('aria-pressed', 'false');

    // Check if slot is in the past (for today only)
    if (isToday) {
      const slotHour = parseInt(slot.split(':')[0]);
      if (slotHour <= currentTime) {
        slotButton.classList.add('disabled');
        slotButton.disabled = true;
        slotButton.setAttribute('aria-label', `Time slot ${slot} - unavailable (past time)`);
      }
    }

    // Randomly mark some slots as booked for demo purposes (20% chance)
    // In a real app, this would come from the backend
    if (Math.random() < 0.2 && !slotButton.disabled) {
      slotButton.classList.add('booked');
      slotButton.disabled = true;
      slotButton.setAttribute('aria-label', `Time slot ${slot} - unavailable (booked)`);
    }

    // Add click handler
    if (!slotButton.disabled) {
      slotButton.addEventListener('click', () => {
        selectTimeSlot(slot, slotButton);
      });
    }

    timeSlotsContainer.appendChild(slotButton);
  });
  
  console.log('Time slots rendered:', timeSlotsContainer.children.length);
}

// Select a time slot
function selectTimeSlot(slot, slotElement) {
  const timeInput = document.getElementById('bookingTime');
  if (!timeInput) return;

  // Remove selection from all slots
  document.querySelectorAll('.time-slot').forEach(btn => {
    btn.classList.remove('selected');
    btn.setAttribute('aria-pressed', 'false');
  });

  // Select clicked slot
  slotElement.classList.add('selected');
  slotElement.setAttribute('aria-pressed', 'true');
  timeInput.value = slot;

  // Validate and calculate cost
  validateBookingField('bookingTime');
  calculateBookingCost();
}

// Calculate booking cost in real-time
function calculateBookingCost() {
  if (!currentBookingArena) return;

  const durationSelect = document.getElementById('bookingDuration');
  const equipmentCheckbox = document.getElementById('bookingEquipment');
  const baseCostSpan = document.getElementById('bookingBaseCost');
  const equipmentCostSpan = document.getElementById('bookingEquipmentCost');
  const totalCostSpan = document.getElementById('bookingTotalCost');
  const equipmentCostRow = document.getElementById('equipmentCostRow');

  if (!durationSelect || !totalCostSpan) return;

  const duration = parseInt(durationSelect.value) || 1;
  const pricePerHour = currentBookingArena.pricePerHour || 0;
  const baseCost = pricePerHour * duration;

  // Equipment rental cost (₹200 flat fee)
  const equipmentCost = (equipmentCheckbox && equipmentCheckbox.checked) ? 200 : 0;

  const totalCost = baseCost + equipmentCost;

  // Update display
  if (baseCostSpan) {
    baseCostSpan.textContent = baseCost.toLocaleString('en-IN');
  }

  if (equipmentCostSpan) {
    equipmentCostSpan.textContent = equipmentCost.toLocaleString('en-IN');
  }

  if (equipmentCostRow) {
    equipmentCostRow.style.display = equipmentCost > 0 ? 'flex' : 'none';
  }

  totalCostSpan.textContent = totalCost.toLocaleString('en-IN');
}

// Validate individual booking field
function validateBookingField(fieldId) {
  const field = document.getElementById(fieldId);
  const errorSpan = document.getElementById(`${fieldId}Error`);

  if (!field || !errorSpan) return true;

  let isValid = true;
  let errorMessage = '';

  switch (fieldId) {
    case 'bookingSport':
      if (!field.value) {
        isValid = false;
        errorMessage = 'Please select a sport';
      }
      break;

    case 'bookingDate':
      if (!field.value) {
        isValid = false;
        errorMessage = 'Please select a date';
      } else {
        const selectedDate = new Date(field.value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (selectedDate < today) {
          isValid = false;
          errorMessage = 'Please select a future date';
        }
      }
      break;

    case 'bookingTime':
      if (!field.value) {
        isValid = false;
        errorMessage = 'Please select a time slot';
      }
      break;

    case 'bookingDuration':
      const duration = parseInt(field.value);
      if (!duration || duration < 1 || duration > 3) {
        isValid = false;
        errorMessage = 'Duration must be between 1 and 3 hours';
      }
      break;

    case 'bookingPlayers':
      const players = parseInt(field.value);
      if (!players || players < 1 || players > 20) {
        isValid = false;
        errorMessage = 'Number of players must be between 1 and 20';
      }
      break;
  }

  // Update UI
  if (isValid) {
    field.classList.remove('invalid');
    field.classList.add('valid');
    errorSpan.textContent = '';
  } else {
    field.classList.remove('valid');
    field.classList.add('invalid');
    errorSpan.textContent = errorMessage;
  }

  return isValid;
}

// Validate all booking form fields
function validateBookingForm() {
  const fields = ['bookingSport', 'bookingDate', 'bookingTime', 'bookingDuration', 'bookingPlayers'];
  let isValid = true;

  fields.forEach(fieldId => {
    if (!validateBookingField(fieldId)) {
      isValid = false;
    }
  });

  return isValid;
}

// Handle booking form submission
function handleBookingSubmit(e) {
  e.preventDefault();

  // Validate form
  if (!validateBookingForm()) {
    showToast('Please fill in all required fields correctly', 'error');
    return;
  }

  if (!currentBookingArena) {
    showToast('Arena information not found', 'error');
    return;
  }

  // Get form values
  const sportId = document.getElementById('bookingSport').value;
  const date = document.getElementById('bookingDate').value;
  const timeSlot = document.getElementById('bookingTime').value;
  const duration = parseInt(document.getElementById('bookingDuration').value);
  const players = parseInt(document.getElementById('bookingPlayers').value);
  const equipmentRental = document.getElementById('bookingEquipment').checked;

  // Check if this is a trial booking and if user has already tried this sport
  if (currentBookingIsTrial) {
    const existingBookings = loadBookings();
    const hasTriedSport = existingBookings.some(b => b.isTrial && b.sport === sportId);
    
    if (hasTriedSport) {
      showToast('You have already used a trial session for this sport. Please book a regular session.', 'warning');
      return;
    }
  }

  // Calculate cost (apply 50% discount for trial sessions)
  let baseCost = currentBookingArena.pricePerHour * duration;
  if (currentBookingIsTrial) {
    baseCost = Math.round(baseCost * 0.5); // 50% off for trial
  }
  const equipmentCost = (equipmentRental && !currentBookingIsTrial) ? 200 : 0; // Free equipment for trials
  const totalCost = baseCost + equipmentCost;

  // Get sport name
  const sport = sports.find(s => s.id === sportId);
  const sportName = sport ? sport.name : sportId;

  // Create booking object
  const booking = {
    id: generateId('booking'),
    userId: 'user_001',
    arenaId: currentBookingArena.id,
    arenaName: currentBookingArena.name,
    arenaLocation: currentBookingArena.location,
    arenaCity: currentBookingArena.city,
    sport: sportId,
    sportName: sportName,
    date: date,
    timeSlot: timeSlot,
    duration: duration,
    players: players,
    equipmentRental: equipmentRental,
    isTrial: currentBookingIsTrial,
    baseCost: baseCost,
    equipmentCost: equipmentCost,
    totalCost: totalCost,
    status: 'confirmed',
    createdAt: Date.now()
  };

  // Save booking
  if (saveBooking(booking)) {
    // Show success message
    showBookingConfirmation(booking);
    
    // Close modal and reset form
    closeModal('bookingModal');
    resetBookingForm();
    
    // Award points for booking
    awardPointsForBooking(booking);
  } else {
    showToast('Failed to save booking. Please try again.', 'error');
  }
}

// Show booking confirmation
function showBookingConfirmation(booking) {
  // Show detailed confirmation toast
  const trialText = booking.isTrial ? '🎁 Trial Session • ' : '';
  const message = `✓ Booking Confirmed!\n${trialText}${booking.sportName} at ${booking.arenaName}\n${formatDate(booking.date)} at ${booking.timeSlot}\nTotal: ₹${booking.totalCost.toLocaleString('en-IN')}`;
  showToast(message, 'success');
  
  // Log booking details
  console.log('Booking created:', booking);
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-IN', options);
}

// Reset booking form
function resetBookingForm() {
  const bookingForm = document.getElementById('bookingForm');
  if (bookingForm) {
    bookingForm.reset();
  }
  
  // Reset trial flag
  currentBookingIsTrial = false;

  // Clear validation states
  const fields = ['bookingSport', 'bookingDate', 'bookingTime', 'bookingDuration', 'bookingPlayers'];
  fields.forEach(fieldId => {
    const field = document.getElementById(fieldId);
    const errorSpan = document.getElementById(`${fieldId}Error`);
    
    if (field) {
      field.classList.remove('valid', 'invalid');
    }
    
    if (errorSpan) {
      errorSpan.textContent = '';
    }
  });

  // Clear time slots and show initial message
  const timeSlotsContainer = document.getElementById('bookingTimeSlots');
  if (timeSlotsContainer) {
    timeSlotsContainer.innerHTML = '<p class="text-secondary text-small">Please select a date first</p>';
  }

  // Reset cost display
  const baseCostSpan = document.getElementById('bookingBaseCost');
  const totalCostSpan = document.getElementById('bookingTotalCost');
  const equipmentCostRow = document.getElementById('equipmentCostRow');

  if (baseCostSpan) baseCostSpan.textContent = '0';
  if (totalCostSpan) totalCostSpan.textContent = '0';
  if (equipmentCostRow) equipmentCostRow.style.display = 'none';

  // DON'T clear currentBookingArena here - it will be set by openBookingModal
}

// Award points for booking
function awardPointsForBooking() {
  const rewardsData = loadRewards();
  rewardsData.points += 50; // Award 50 points for each booking

  // Check for first booking achievement
  const bookings = loadBookings();
  if (bookings.length === 1 && !rewardsData.achievements.includes('first_booking')) {
    rewardsData.achievements.push('first_booking');
    rewardsData.points += 50; // Bonus points for achievement
    showToast('Achievement unlocked: First Step! +50 bonus points', 'success');
  }

  // Update tier
  rewardsData.tier = calculateTier(rewardsData.points);

  // Save rewards
  saveRewards(rewardsData);

  // Update rewards display if on rewards section
  updateRewardsDisplay();
}

// Calculate tier based on points
function calculateTier(points) {
  for (let i = tiers.length - 1; i >= 0; i--) {
    if (points >= tiers[i].minPoints) {
      return tiers[i].name;
    }
  }
  return 'Bronze';
}

// Update rewards display
function updateRewardsDisplay() {
  const rewardsData = loadRewards();
  const pointsValue = document.getElementById('pointsValue');
  const tierValue = document.getElementById('tierValue');

  if (pointsValue) {
    pointsValue.textContent = rewardsData.points;
  }

  if (tierValue) {
    tierValue.textContent = rewardsData.tier;
  }

  // Update tier progress bar
  updateTierProgress(rewardsData.points, rewardsData.tier);
}

// Update tier progress bar
function updateTierProgress(points, currentTier) {
  const tierProgressBar = document.getElementById('tierProgressBar');
  if (!tierProgressBar) return;

  // Find current and next tier
  const currentTierIndex = tiers.findIndex(t => t.name === currentTier);
  const nextTierIndex = currentTierIndex + 1;

  if (nextTierIndex >= tiers.length) {
    // Max tier reached
    tierProgressBar.style.width = '100%';
    return;
  }

  const currentTierMinPoints = tiers[currentTierIndex].minPoints;
  const nextTierMinPoints = tiers[nextTierIndex].minPoints;
  const pointsInCurrentTier = points - currentTierMinPoints;
  const pointsNeededForNextTier = nextTierMinPoints - currentTierMinPoints;
  const progress = (pointsInCurrentTier / pointsNeededForNextTier) * 100;

  tierProgressBar.style.width = `${Math.min(progress, 100)}%`;
}


// ===================================
// My Bookings Feature
// ===================================

// Initialize My Bookings view
function initMyBookings() {
  renderMyBookings();
}

// Render My Bookings list
function renderMyBookings() {
  const bookingsList = document.getElementById('myBookingsList');
  if (!bookingsList) return;

  const bookings = loadBookings();

  // Clear existing content
  bookingsList.innerHTML = '';

  if (bookings.length === 0) {
    bookingsList.innerHTML = `
      <div class="no-bookings">
        <div class="no-bookings-icon">📅</div>
        <p class="no-bookings-text">No bookings yet</p>
        <p class="no-bookings-subtext">Book your first arena to get started!</p>
        <button class="btn-primary" onclick="scrollToDiscover()">Discover Arenas</button>
      </div>
    `;
    return;
  }

  // Sort bookings by date (newest first)
  const sortedBookings = [...bookings].sort((a, b) => {
    const dateA = new Date(a.date + ' ' + a.timeSlot.split('-')[0]);
    const dateB = new Date(b.date + ' ' + b.timeSlot.split('-')[0]);
    return dateB - dateA;
  });

  // Render each booking
  sortedBookings.forEach(booking => {
    const bookingCard = createBookingCard(booking);
    bookingsList.appendChild(bookingCard);
  });
}

// Create booking card HTML
function createBookingCard(booking) {
  const card = document.createElement('div');
  card.className = 'booking-card';
  card.dataset.bookingId = booking.id;

  // Determine if booking is upcoming or past
  const bookingDateTime = new Date(booking.date + ' ' + booking.timeSlot.split('-')[0]);
  const now = new Date();
  const isUpcoming = bookingDateTime > now;
  const isPast = bookingDateTime < now;
  const isCancelled = booking.status === 'cancelled';

  // Status badge
  let statusBadge = '';
  if (isCancelled) {
    statusBadge = '<span class="booking-status cancelled">Cancelled</span>';
  } else if (isPast) {
    statusBadge = '<span class="booking-status completed">Completed</span>';
  } else {
    statusBadge = '<span class="booking-status confirmed">Confirmed</span>';
  }

  // Trial session badge
  const trialBadge = booking.isTrial 
    ? '<span class="booking-badge trial">🎁 Trial Session</span>' 
    : '';

  // Equipment rental badge
  const equipmentBadge = booking.equipmentRental 
    ? '<span class="booking-badge">🎾 Equipment Included</span>' 
    : '';

  card.innerHTML = `
    <div class="booking-card-header">
      <div class="booking-card-title">
        <h4>${booking.arenaName}</h4>
        ${statusBadge}
      </div>
      <div class="booking-card-location">${booking.arenaLocation}, ${booking.arenaCity}</div>
    </div>
    <div class="booking-card-body">
      ${trialBadge}
      <div class="booking-detail">
        <span class="booking-detail-label">Sport:</span>
        <span class="booking-detail-value">${booking.sportName}</span>
      </div>
      <div class="booking-detail">
        <span class="booking-detail-label">Date:</span>
        <span class="booking-detail-value">${formatDate(booking.date)}</span>
      </div>
      <div class="booking-detail">
        <span class="booking-detail-label">Time:</span>
        <span class="booking-detail-value">${booking.timeSlot}</span>
      </div>
      <div class="booking-detail">
        <span class="booking-detail-label">Duration:</span>
        <span class="booking-detail-value">${booking.duration} hour${booking.duration > 1 ? 's' : ''}</span>
      </div>
      <div class="booking-detail">
        <span class="booking-detail-label">Players:</span>
        <span class="booking-detail-value">${booking.players}</span>
      </div>
      ${equipmentBadge}
    </div>
    <div class="booking-card-footer">
      <div class="booking-cost">
        <span class="booking-cost-label">Total Cost:</span>
        <span class="booking-cost-value">₹${booking.totalCost.toLocaleString('en-IN')}</span>
      </div>
      ${isUpcoming && !isCancelled ? `
        <button class="btn-outline-secondary btn-sm" onclick="cancelBooking('${booking.id}')">
          Cancel Booking
        </button>
      ` : ''}
    </div>
  `;

  return card;
}

// Cancel booking
function cancelBooking(bookingId) {
  // Confirm cancellation
  if (!confirm('Are you sure you want to cancel this booking?')) {
    return;
  }

  const bookings = loadBookings();
  const bookingIndex = bookings.findIndex(b => b.id === bookingId);

  if (bookingIndex === -1) {
    showToast('Booking not found', 'error');
    return;
  }

  // Update booking status
  bookings[bookingIndex].status = 'cancelled';
  bookings[bookingIndex].cancelledAt = Date.now();

  // Save updated bookings
  if (StateManager.set('bookings', bookings)) {
    showToast('Booking cancelled successfully', 'success');
    
    // Re-render bookings list
    renderMyBookings();
  } else {
    showToast('Failed to cancel booking. Please try again.', 'error');
  }
}

// Scroll to discover section
function scrollToDiscover() {
  const discoverSection = document.getElementById('discover');
  if (discoverSection) {
    discoverSection.scrollIntoView({ behavior: 'smooth' });
  }
}

// Initialize profile section
function initProfile() {
  const profileForm = document.getElementById('profileForm');
  const profileCityInput = document.getElementById('profileCityInput');
  const profileSportsCheckboxes = document.getElementById('profileSportsCheckboxes');

  // Load user profile
  const userProfile = loadUserProfile();

  // Populate city dropdown
  if (profileCityInput) {
    profileCityInput.innerHTML = '<option value="">Select city</option>';
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      if (city === userProfile.city) {
        option.selected = true;
      }
      profileCityInput.appendChild(option);
    });
  }

  // Populate sports checkboxes
  if (profileSportsCheckboxes) {
    profileSportsCheckboxes.innerHTML = '';
    sports.forEach(sport => {
      const label = document.createElement('label');
      label.className = 'checkbox-label';
      
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'form-checkbox';
      checkbox.value = sport.id;
      checkbox.checked = userProfile.favoriteSports.includes(sport.id);
      
      const span = document.createElement('span');
      span.textContent = `${sport.icon} ${sport.name}`;
      
      label.appendChild(checkbox);
      label.appendChild(span);
      profileSportsCheckboxes.appendChild(label);
    });
  }

  // Populate name input
  const profileNameInput = document.getElementById('profileNameInput');
  if (profileNameInput) {
    profileNameInput.value = userProfile.name;
  }

  // Populate skill level
  const profileSkillLevel = document.getElementById('profileSkillLevel');
  if (profileSkillLevel && userProfile.skillLevel) {
    profileSkillLevel.value = userProfile.skillLevel;
  }

  // Populate preferred time slots
  const timeSlotMorning = document.getElementById('timeSlotMorning');
  const timeSlotAfternoon = document.getElementById('timeSlotAfternoon');
  const timeSlotEvening = document.getElementById('timeSlotEvening');
  
  if (userProfile.preferredTimeSlots) {
    if (timeSlotMorning) timeSlotMorning.checked = userProfile.preferredTimeSlots.includes('morning');
    if (timeSlotAfternoon) timeSlotAfternoon.checked = userProfile.preferredTimeSlots.includes('afternoon');
    if (timeSlotEvening) timeSlotEvening.checked = userProfile.preferredTimeSlots.includes('evening');
  }

  // Populate budget range
  const profileBudget = document.getElementById('profileBudget');
  if (profileBudget && userProfile.budgetRange) {
    profileBudget.value = userProfile.budgetRange;
  }

  // Update profile display
  updateProfileDisplay(userProfile);

  // Update activity summary
  updateActivitySummary();

  // Handle form submission
  if (profileForm) {
    profileForm.addEventListener('submit', handleProfileSubmit);
  }

  // Initialize My Bookings
  initMyBookings();
}

// Update profile display
function updateProfileDisplay(userProfile) {
  const profileName = document.getElementById('profileName');
  const profileCity = document.getElementById('profileCity');
  const profileAvatar = document.getElementById('profileAvatar');
  const profileMemberSince = document.getElementById('profileMemberSince');

  if (profileName) {
    profileName.textContent = userProfile.name;
  }

  if (profileCity) {
    profileCity.textContent = userProfile.city;
  }

  if (profileAvatar) {
    // Show first letter of name
    const initial = userProfile.name.charAt(0).toUpperCase();
    profileAvatar.textContent = initial;
  }

  if (profileMemberSince && userProfile.joinedDate) {
    const joinedDate = new Date(userProfile.joinedDate);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${monthNames[joinedDate.getMonth()]} ${joinedDate.getFullYear()}`;
    profileMemberSince.textContent = `Member since ${formattedDate}`;
  }
}

// Update activity summary
function updateActivitySummary() {
  const bookings = loadBookings();
  const rewardsData = loadRewards();
  
  // Count total bookings
  const bookingsCount = bookings.length;
  const bookingsCountEl = document.getElementById('activityBookingsCount');
  if (bookingsCountEl) {
    bookingsCountEl.textContent = bookingsCount;
  }

  // Count unique sports tried
  const uniqueSports = new Set(bookings.map(b => b.sport));
  const sportsCount = uniqueSports.size;
  const sportsCountEl = document.getElementById('activitySportsCount');
  if (sportsCountEl) {
    sportsCountEl.textContent = sportsCount;
  }

  // Show reward points
  const pointsCount = rewardsData.points || 0;
  const pointsCountEl = document.getElementById('activityPointsCount');
  if (pointsCountEl) {
    pointsCountEl.textContent = pointsCount;
  }
}

// Handle profile form submission
function handleProfileSubmit(e) {
  e.preventDefault();

  const nameInput = document.getElementById('profileNameInput');
  const cityInput = document.getElementById('profileCityInput');
  const sportsCheckboxes = document.querySelectorAll('#profileSportsCheckboxes input[type="checkbox"]:checked');
  const skillLevelInput = document.getElementById('profileSkillLevel');
  const budgetInput = document.getElementById('profileBudget');

  // Get selected sports
  const favoriteSports = Array.from(sportsCheckboxes).map(cb => cb.value);

  // Get selected time slots
  const timeSlots = [];
  if (document.getElementById('timeSlotMorning')?.checked) timeSlots.push('morning');
  if (document.getElementById('timeSlotAfternoon')?.checked) timeSlots.push('afternoon');
  if (document.getElementById('timeSlotEvening')?.checked) timeSlots.push('evening');

  // Load current profile
  const userProfile = loadUserProfile();

  // Update profile
  userProfile.name = nameInput.value.trim() || 'Guest User';
  userProfile.city = cityInput.value || 'Bangalore';
  userProfile.favoriteSports = favoriteSports;
  userProfile.skillLevel = skillLevelInput.value || 'intermediate';
  userProfile.preferredTimeSlots = timeSlots;
  userProfile.budgetRange = budgetInput.value || '500-1000';

  // Save profile
  if (saveUserProfile(userProfile)) {
    showToast('Profile updated successfully!', 'success');
    updateProfileDisplay(userProfile);
    updateActivitySummary();
  } else {
    showToast('Failed to update profile. Please try again.', 'error');
  }
}

// ===================================
// Community Feature
// ===================================

// State for community filters
let communityFilters = {
  sport: '',
  city: ''
};

// Initialize Community Feature
function initCommunity() {
  populateCommunitySportFilter();
  populateCommunityCityFilter();
  initCommunityFilters();
  initCreatePostModal();
  
  // Render initial posts
  renderCommunityPosts();
}

// Populate sport filter dropdown
function populateCommunitySportFilter() {
  const sportSelect = document.getElementById('communityFilterSport');
  if (!sportSelect) return;

  // Clear existing options except the first one
  sportSelect.innerHTML = '<option value="">All Sports</option>';

  // Add sport options
  sports.forEach(sport => {
    const option = document.createElement('option');
    option.value = sport.id;
    option.textContent = sport.name;
    sportSelect.appendChild(option);
  });
}

// Populate city filter dropdown
function populateCommunityCityFilter() {
  const citySelect = document.getElementById('communityFilterCity');
  if (!citySelect) return;

  // Clear existing options except the first one
  citySelect.innerHTML = '<option value="">All Cities</option>';

  // Add city options
  cities.forEach(city => {
    const option = document.createElement('option');
    option.value = city;
    option.textContent = city;
    citySelect.appendChild(option);
  });
}

// Initialize community filter event listeners
function initCommunityFilters() {
  const sportSelect = document.getElementById('communityFilterSport');
  const citySelect = document.getElementById('communityFilterCity');

  if (sportSelect) {
    sportSelect.addEventListener('change', (e) => {
      communityFilters.sport = e.target.value;
      renderCommunityPosts();
    });
  }

  if (citySelect) {
    citySelect.addEventListener('change', (e) => {
      communityFilters.city = e.target.value;
      renderCommunityPosts();
    });
  }
}

// Filter posts by sport
function filterPostsBySport(posts, sportId) {
  if (!sportId) return posts;
  return posts.filter(post => post.sport === sportId);
}

// Filter posts by city
function filterPostsByCity(posts, city) {
  if (!city) return posts;
  return posts.filter(post => post.userCity === city);
}

// Apply all community filters
function applyCommunityFilters(posts) {
  let filteredPosts = [...posts];
  
  // Apply sport filter
  filteredPosts = filterPostsBySport(filteredPosts, communityFilters.sport);
  
  // Apply city filter
  filteredPosts = filterPostsByCity(filteredPosts, communityFilters.city);
  
  return filteredPosts;
}

// Render community posts
function renderCommunityPosts() {
  const communityFeed = document.getElementById('communityFeed');
  if (!communityFeed) return;

  // Load posts from local storage
  const allPosts = loadPosts();
  
  // Apply filters
  const filteredPosts = applyCommunityFilters(allPosts);

  // Clear existing posts
  communityFeed.innerHTML = '';

  // Check if no posts found
  if (filteredPosts.length === 0) {
    renderNoPostsMessage(communityFeed);
    return;
  }

  // Render each post card
  filteredPosts.forEach((post, index) => {
    const postCard = createPostCard(post, index);
    communityFeed.appendChild(postCard);
  });

  // Re-initialize scroll animations
  setTimeout(() => initScrollAnimations(), 100);
}

// Create post card HTML
function createPostCard(post, index) {
  const card = document.createElement('div');
  card.className = 'card community-post-card animate-on-scroll';
  card.style.setProperty('--stagger-delay', `${index * 100}ms`);
  card.dataset.postId = post.id;

  // Get sport info
  const sport = sports.find(s => s.id === post.sport);
  const sportIcon = sport ? sport.icon : '🏃';
  const sportName = sport ? sport.name : post.sport;

  // Get user initials for avatar
  const initials = post.userName
    .split(' ')
    .map(name => name.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);

  // Format timestamp
  const timeAgo = formatRelativeTime(post.timestamp);

  card.innerHTML = `
    <div class="community-post-header">
      <div class="community-post-user">
        <div class="community-post-avatar">${initials}</div>
        <div class="community-post-user-info">
          <div class="community-post-user-name">${post.userName}</div>
          <div class="community-post-meta">
            <span class="community-post-city">${post.userCity}</span>
            <span class="community-post-separator">•</span>
            <span class="community-post-time">${timeAgo}</span>
          </div>
        </div>
      </div>
      <div class="community-post-sport-badge">
        <span class="community-post-sport-icon">${sportIcon}</span>
        <span class="community-post-sport-name">${sportName}</span>
      </div>
    </div>
    <div class="community-post-body">
      <p class="community-post-content">${post.content}</p>
    </div>
    <div class="community-post-footer">
      <button class="community-post-action" onclick="likePost('${post.id}')">
        <span class="community-post-action-icon">👍</span>
        <span class="community-post-action-count">${post.likes}</span>
      </button>
      <button class="community-post-action">
        <span class="community-post-action-icon">💬</span>
        <span class="community-post-action-count">${post.comments}</span>
      </button>
    </div>
  `;

  return card;
}

// Render "No posts found" message
function renderNoPostsMessage(container) {
  const noResultsDiv = document.createElement('div');
  noResultsDiv.className = 'no-results';
  
  let message = 'No community posts yet. Be the first to share!';
  
  if (communityFilters.sport && communityFilters.city) {
    const sportName = getSportName(communityFilters.sport);
    message = `No posts found for ${sportName} in ${communityFilters.city}. Try different filters or create a post!`;
  } else if (communityFilters.sport) {
    const sportName = getSportName(communityFilters.sport);
    message = `No posts found for ${sportName}. Try a different sport or create a post!`;
  } else if (communityFilters.city) {
    message = `No posts found in ${communityFilters.city}. Try a different city or create a post!`;
  }
  
  noResultsDiv.innerHTML = `
    <div class="no-results-icon">📭</div>
    <h3 class="no-results-title">No Posts Found</h3>
    <p class="no-results-message">${message}</p>
    <button class="btn-primary" onclick="openCreatePostModal()">Create Post</button>
  `;
  
  container.appendChild(noResultsDiv);
}

// Like a post
function likePost(postId) {
  const posts = loadPosts();
  const post = posts.find(p => p.id === postId);
  
  if (post) {
    post.likes += 1;
    StateManager.set('community_posts', posts);
    renderCommunityPosts();
    showToast('Post liked!', 'success');
  }
}

// Initialize create post modal
function initCreatePostModal() {
  const btnCreatePost = document.getElementById('btnCreatePost');
  const closePostModal = document.getElementById('closePostModal');
  const createPostForm = document.getElementById('createPostForm');
  const postSport = document.getElementById('postSport');
  const postContent = document.getElementById('postContent');
  const postCharCount = document.getElementById('postCharCount');

  // Populate sport dropdown
  if (postSport) {
    postSport.innerHTML = '<option value="">Select sport</option>';
    sports.forEach(sport => {
      const option = document.createElement('option');
      option.value = sport.id;
      option.textContent = `${sport.icon} ${sport.name}`;
      postSport.appendChild(option);
    });
  }

  // Open modal
  if (btnCreatePost) {
    btnCreatePost.addEventListener('click', openCreatePostModal);
  }

  // Close modal
  if (closePostModal) {
    closePostModal.addEventListener('click', () => {
      closeModal('createPostModal');
      resetCreatePostForm();
    });
  }

  // Character count
  if (postContent && postCharCount) {
    postContent.addEventListener('input', () => {
      const count = postContent.value.length;
      postCharCount.textContent = count;
      
      if (count > 500) {
        postCharCount.style.color = 'var(--color-error)';
      } else if (count > 450) {
        postCharCount.style.color = 'var(--color-warning)';
      } else {
        postCharCount.style.color = 'var(--color-text-secondary)';
      }
    });
  }

  // Form submission
  if (createPostForm) {
    createPostForm.addEventListener('submit', handleCreatePost);
  }
}

// Open create post modal
function openCreatePostModal() {
  openModal('createPostModal');
}

// Handle create post form submission
function handleCreatePost(e) {
  e.preventDefault();

  const postSport = document.getElementById('postSport');
  const postContent = document.getElementById('postContent');

  // Validate form
  if (!postSport.value) {
    showToast('Please select a sport', 'error');
    return;
  }

  if (!postContent.value.trim()) {
    showToast('Please enter your message', 'error');
    return;
  }

  if (postContent.value.length > 500) {
    showToast('Message must be under 500 characters', 'error');
    return;
  }

  // Get user profile
  const userProfile = loadUserProfile();

  // Create new post
  const newPost = {
    id: generateId('post'),
    userId: userProfile.id,
    userName: userProfile.name,
    userCity: userProfile.city,
    sport: postSport.value,
    content: postContent.value.trim(),
    timestamp: Date.now(),
    likes: 0,
    comments: 0
  };

  // Save post
  if (savePost(newPost)) {
    showToast('Post shared with community!', 'success');
    closeModal('createPostModal');
    resetCreatePostForm();
    renderCommunityPosts();
    
    // Award points for community engagement
    awardPoints(5, 'Community post created');
    
    // Check for community achievements
    checkCommunityAchievements();
  } else {
    showToast('Failed to create post. Please try again.', 'error');
  }
}

// Reset create post form
function resetCreatePostForm() {
  const createPostForm = document.getElementById('createPostForm');
  if (createPostForm) {
    createPostForm.reset();
  }
  
  const postCharCount = document.getElementById('postCharCount');
  if (postCharCount) {
    postCharCount.textContent = '0';
    postCharCount.style.color = 'var(--color-text-secondary)';
  }
}

// ===================================
// Rewards and Gamification Feature
// ===================================

// Initialize Rewards Feature
function initRewards() {
  renderRewardsSection();
}

// Render the entire rewards section
function renderRewardsSection() {
  const rewardsData = loadRewards();
  
  // Update points balance
  updatePointsDisplay(rewardsData.points);
  
  // Update tier indicator
  updateTierDisplay(rewardsData.tier, rewardsData.points);
  
  // Render available rewards
  renderRewardsGrid(rewardsData);
  
  // Render achievements
  renderAchievements(rewardsData);
}

// Update points balance display
function updatePointsDisplay(points) {
  const pointsValue = document.getElementById('pointsValue');
  if (pointsValue) {
    pointsValue.textContent = points;
  }
}

// Update tier display with progress bar
function updateTierDisplay(currentTierName, points) {
  const tierValue = document.getElementById('tierValue');
  const tierProgressBar = document.getElementById('tierProgressBar');
  
  if (!tierValue || !tierProgressBar) return;
  
  // Find current tier
  const currentTierIndex = tiers.findIndex(t => t.name === currentTierName);
  const currentTier = tiers[currentTierIndex];
  
  // Update tier name
  tierValue.textContent = currentTierName;
  tierValue.style.color = currentTier.color;
  
  // Calculate progress to next tier
  let progress = 0;
  let nextTier = null;
  
  if (currentTierIndex < tiers.length - 1) {
    nextTier = tiers[currentTierIndex + 1];
    const pointsInCurrentTier = points - currentTier.minPoints;
    const pointsNeededForNextTier = nextTier.minPoints - currentTier.minPoints;
    progress = (pointsInCurrentTier / pointsNeededForNextTier) * 100;
    progress = Math.min(Math.max(progress, 0), 100); // Clamp between 0 and 100
  } else {
    // Max tier reached
    progress = 100;
  }
  
  // Update progress bar
  tierProgressBar.style.width = `${progress}%`;
  tierProgressBar.style.background = `linear-gradient(90deg, ${currentTier.color} 0%, ${nextTier ? nextTier.color : currentTier.color} 100%)`;
  
  // Add tooltip or text showing progress
  const tierIndicator = document.querySelector('.tier-indicator');
  if (tierIndicator) {
    let progressText = '';
    if (nextTier) {
      const pointsNeeded = nextTier.minPoints - points;
      progressText = `${pointsNeeded} points to ${nextTier.name}`;
    } else {
      progressText = 'Max tier reached!';
    }
    
    // Check if progress text element exists, if not create it
    let progressTextElement = tierIndicator.querySelector('.tier-progress-text');
    if (!progressTextElement) {
      progressTextElement = document.createElement('div');
      progressTextElement.className = 'tier-progress-text';
      tierIndicator.appendChild(progressTextElement);
    }
    progressTextElement.textContent = progressText;
  }
}

// Render rewards grid
function renderRewardsGrid(rewardsData) {
  const rewardsGrid = document.getElementById('rewardsGrid');
  if (!rewardsGrid) return;
  
  rewardsGrid.innerHTML = '';
  
  rewards.forEach((reward, index) => {
    const rewardCard = createRewardCard(reward, rewardsData, index);
    rewardsGrid.appendChild(rewardCard);
  });
  
  // Re-initialize scroll animations
  setTimeout(() => initScrollAnimations(), 100);
}

// Create reward card HTML
function createRewardCard(reward, rewardsData, index) {
  const card = document.createElement('div');
  card.className = 'card reward-card animate-on-scroll';
  card.style.setProperty('--stagger-delay', `${index * 100}ms`);
  card.dataset.rewardId = reward.id;
  
  // Check if reward is already redeemed
  const isRedeemed = rewardsData.redeemedRewards.includes(reward.id);
  
  // Check if user has enough points
  const hasEnoughPoints = rewardsData.points >= reward.pointsCost;
  
  // Determine button state
  let buttonHTML = '';
  if (isRedeemed) {
    buttonHTML = '<button class="btn-reward btn-reward-redeemed" disabled>Redeemed ✓</button>';
  } else if (hasEnoughPoints) {
    buttonHTML = `<button class="btn-reward btn-reward-available" onclick="redeemReward('${reward.id}')">Redeem (${reward.pointsCost} pts)</button>`;
  } else {
    buttonHTML = `<button class="btn-reward btn-reward-locked" disabled>Need ${reward.pointsCost - rewardsData.points} more pts</button>`;
  }
  
  // Add redeemed or locked class to card
  if (isRedeemed) {
    card.classList.add('reward-redeemed');
  } else if (!hasEnoughPoints) {
    card.classList.add('reward-locked');
  }
  
  card.innerHTML = `
    <div class="reward-card-icon">${reward.icon}</div>
    <div class="reward-card-body">
      <h3 class="reward-card-name">${reward.name}</h3>
      <p class="reward-card-description">${reward.description}</p>
      <div class="reward-card-cost">
        <span class="reward-cost-icon">⭐</span>
        <span class="reward-cost-value">${reward.pointsCost} points</span>
      </div>
    </div>
    <div class="reward-card-footer">
      ${buttonHTML}
    </div>
  `;
  
  return card;
}

// Render achievements
function renderAchievements(rewardsData) {
  const achievementsGrid = document.getElementById('achievementsGrid');
  if (!achievementsGrid) return;
  
  achievementsGrid.innerHTML = '';
  
  achievements.forEach((achievement, index) => {
    const achievementCard = createAchievementCard(achievement, rewardsData, index);
    achievementsGrid.appendChild(achievementCard);
  });
  
  // Re-initialize scroll animations
  setTimeout(() => initScrollAnimations(), 100);
}

// Create achievement card HTML
function createAchievementCard(achievement, rewardsData, index) {
  const card = document.createElement('div');
  card.className = 'card achievement-card animate-on-scroll';
  card.style.setProperty('--stagger-delay', `${index * 100}ms`);
  card.dataset.achievementId = achievement.id;
  
  // Check if achievement is unlocked
  const isUnlocked = rewardsData.achievements.includes(achievement.id);
  
  if (isUnlocked) {
    card.classList.add('achievement-unlocked');
  } else {
    card.classList.add('achievement-locked');
  }
  
  const statusBadge = isUnlocked 
    ? '<span class="achievement-badge achievement-badge-unlocked">Unlocked ✓</span>'
    : '<span class="achievement-badge achievement-badge-locked">🔒 Locked</span>';
  
  card.innerHTML = `
    <div class="achievement-card-header">
      <div class="achievement-card-icon">${achievement.icon}</div>
      ${statusBadge}
    </div>
    <div class="achievement-card-body">
      <h3 class="achievement-card-name">${achievement.name}</h3>
      <p class="achievement-card-description">${achievement.description}</p>
      <div class="achievement-card-points">
        <span class="achievement-points-icon">⭐</span>
        <span class="achievement-points-value">+${achievement.points} points</span>
      </div>
    </div>
  `;
  
  return card;
}

// Calculate current tier based on points
function calculateTier(points) {
  // Find the highest tier the user qualifies for
  let currentTier = tiers[0]; // Default to Bronze
  
  for (const tier of tiers) {
    if (points >= tier.minPoints) {
      currentTier = tier;
    } else {
      break;
    }
  }
  
  return currentTier.name;
}

// Award points for an action
function awardPoints(points, reason) {
  const rewardsData = loadRewards();
  
  // Add points
  rewardsData.points += points;
  
  // Recalculate tier
  const newTier = calculateTier(rewardsData.points);
  const oldTier = rewardsData.tier;
  rewardsData.tier = newTier;
  
  // Save updated rewards data
  saveRewards(rewardsData);
  
  // Show notification
  showToast(`+${points} points earned!\n${reason}`, 'success');
  
  // Check for tier upgrade
  if (newTier !== oldTier) {
    setTimeout(() => {
      showToast(`🎉 Tier upgraded to ${newTier}!`, 'success');
    }, 500);
  }
  
  // Update display
  updatePointsDisplay(rewardsData.points);
  updateTierDisplay(rewardsData.tier, rewardsData.points);
  
  // Re-render rewards grid to update button states
  renderRewardsGrid(rewardsData);
  
  return rewardsData;
}

// Award points for booking
function awardPointsForBooking(booking) {
  // Base points for booking
  let points = 10;
  
  // Bonus points for morning bookings (before 8 AM)
  const timeSlot = booking.timeSlot.split('-')[0];
  const hour = parseInt(timeSlot.split(':')[0]);
  if (hour < 8) {
    points += 5;
  }
  
  // Bonus points for weekend bookings
  const bookingDate = new Date(booking.date);
  const dayOfWeek = bookingDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    points += 5;
  }
  
  // Award the points
  awardPoints(points, 'Booking completed');
  
  // Check for achievements
  checkBookingAchievements(booking);
}

// Check and unlock booking-related achievements
function checkBookingAchievements(booking) {
  const rewardsData = loadRewards();
  const bookings = loadBookings();
  
  // First booking achievement
  if (bookings.length === 1 && !rewardsData.achievements.includes('first_booking')) {
    unlockAchievement('first_booking');
  }
  
  // Early bird achievement (5 morning bookings)
  const morningBookings = bookings.filter(b => {
    const timeSlot = b.timeSlot.split('-')[0];
    const hour = parseInt(timeSlot.split(':')[0]);
    return hour < 8;
  });
  
  if (morningBookings.length >= 5 && !rewardsData.achievements.includes('early_bird')) {
    unlockAchievement('early_bird');
  }
  
  // Weekend warrior achievement (10 weekend bookings)
  const weekendBookings = bookings.filter(b => {
    const bookingDate = new Date(b.date);
    const dayOfWeek = bookingDate.getDay();
    return dayOfWeek === 0 || dayOfWeek === 6;
  });
  
  if (weekendBookings.length >= 10 && !rewardsData.achievements.includes('weekend_warrior')) {
    unlockAchievement('weekend_warrior');
  }
  
  // Multi-sport enthusiast achievement (5 different sports)
  const uniqueSports = [...new Set(bookings.map(b => b.sport))];
  if (uniqueSports.length >= 5 && !rewardsData.achievements.includes('5_sports_tried')) {
    unlockAchievement('5_sports_tried');
  }
}

// Unlock an achievement
function unlockAchievement(achievementId) {
  const rewardsData = loadRewards();
  
  // Check if already unlocked
  if (rewardsData.achievements.includes(achievementId)) {
    return;
  }
  
  // Find achievement data
  const achievement = achievements.find(a => a.id === achievementId);
  if (!achievement) {
    return;
  }
  
  // Add to unlocked achievements
  rewardsData.achievements.push(achievementId);
  
  // Award points
  rewardsData.points += achievement.points;
  
  // Recalculate tier
  rewardsData.tier = calculateTier(rewardsData.points);
  
  // Save updated rewards data
  saveRewards(rewardsData);
  
  // Show notification
  showToast(`🏆 Achievement Unlocked: ${achievement.name}!\n+${achievement.points} points`, 'success');
  
  // Update display
  updatePointsDisplay(rewardsData.points);
  updateTierDisplay(rewardsData.tier, rewardsData.points);
  
  // Re-render achievements to show unlocked state
  renderAchievements(rewardsData);
  
  // Add animation class to newly unlocked achievement
  setTimeout(() => {
    const achievementCard = document.querySelector(`.achievement-card[data-achievement-id="${achievementId}"]`);
    if (achievementCard) {
      achievementCard.classList.add('newly-unlocked');
    }
  }, 100);
}

// Check community-related achievements
function checkCommunityAchievements() {
  const rewardsData = loadRewards();
  const posts = loadPosts();
  
  // Get user's posts (posts created by the current user)
  const userProfile = loadUserProfile();
  const userPosts = posts.filter(p => p.userId === userProfile.id);
  
  // Community builder achievement (10 posts)
  if (userPosts.length >= 10 && !rewardsData.achievements.includes('community_builder')) {
    unlockAchievement('community_builder');
  }
}

// Redeem a reward
function redeemReward(rewardId) {
  const rewardsData = loadRewards();
  
  // Find the reward
  const reward = rewards.find(r => r.id === rewardId);
  if (!reward) {
    showToast('Reward not found', 'error');
    return;
  }
  
  // Check if already redeemed
  if (rewardsData.redeemedRewards.includes(rewardId)) {
    showToast('You have already redeemed this reward', 'info');
    return;
  }
  
  // Check if user has enough points
  if (rewardsData.points < reward.pointsCost) {
    const pointsNeeded = reward.pointsCost - rewardsData.points;
    showToast(`You need ${pointsNeeded} more points to redeem this reward`, 'warning');
    return;
  }
  
  // Deduct points
  rewardsData.points -= reward.pointsCost;
  
  // Add to redeemed rewards
  rewardsData.redeemedRewards.push(rewardId);
  
  // Recalculate tier (in case user dropped a tier)
  rewardsData.tier = calculateTier(rewardsData.points);
  
  // Save updated rewards data
  if (saveRewards(rewardsData)) {
    // Show success message
    showToast(`🎉 ${reward.name} redeemed successfully!\nYou now have ${rewardsData.points} points remaining.`, 'success');
    
    // Update display
    updatePointsDisplay(rewardsData.points);
    updateTierDisplay(rewardsData.tier, rewardsData.points);
    
    // Re-render rewards grid to update button states
    renderRewardsGrid(rewardsData);
    
    // Add animation to the redeemed card
    setTimeout(() => {
      const rewardCard = document.querySelector(`.reward-card[data-reward-id="${rewardId}"]`);
      if (rewardCard) {
        rewardCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        rewardCard.style.animation = 'rewardRedeemed 0.8s ease-out';
      }
    }, 100);
  } else {
    showToast('Failed to redeem reward. Please try again.', 'error');
  }
}

// Animate points counter
function animatePointsCounter(targetPoints) {
  const pointsValue = document.getElementById('pointsValue');
  if (!pointsValue) return;
  
  const startPoints = parseInt(pointsValue.textContent) || 0;
  const duration = 1000; // 1 second
  const startTime = performance.now();
  
  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Easing function for smooth animation (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.floor(startPoints + (targetPoints - startPoints) * easeOut);
    
    pointsValue.textContent = currentValue;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      pointsValue.textContent = targetPoints;
    }
  }
  
  requestAnimationFrame(updateCounter);
}

// Animate progress bar fill
function animateProgressBar(targetProgress) {
  const tierProgressBar = document.getElementById('tierProgressBar');
  if (!tierProgressBar) return;
  
  // Set initial width to 0 for animation
  tierProgressBar.style.width = '0%';
  
  // Trigger animation after a short delay
  setTimeout(() => {
    tierProgressBar.style.width = `${targetProgress}%`;
  }, 100);
}

// Update points display with animation
function updatePointsDisplayAnimated(newPoints) {
  animatePointsCounter(newPoints);
}

// Update tier display with animation
function updateTierDisplayAnimated(currentTierName, points) {
  const tierValue = document.getElementById('tierValue');
  const tierProgressBar = document.getElementById('tierProgressBar');
  
  if (!tierValue || !tierProgressBar) return;
  
  // Find current tier
  const currentTierIndex = tiers.findIndex(t => t.name === currentTierName);
  const currentTier = tiers[currentTierIndex];
  
  // Update tier name with fade effect
  tierValue.style.opacity = '0';
  setTimeout(() => {
    tierValue.textContent = currentTierName;
    tierValue.style.color = currentTier.color;
    tierValue.style.opacity = '1';
  }, 150);
  
  // Calculate progress to next tier
  let progress = 0;
  let nextTier = null;
  
  if (currentTierIndex < tiers.length - 1) {
    nextTier = tiers[currentTierIndex + 1];
    const pointsInCurrentTier = points - currentTier.minPoints;
    const pointsNeededForNextTier = nextTier.minPoints - currentTier.minPoints;
    progress = (pointsInCurrentTier / pointsNeededForNextTier) * 100;
    progress = Math.min(Math.max(progress, 0), 100);
  } else {
    progress = 100;
  }
  
  // Animate progress bar
  animateProgressBar(progress);
  
  // Update progress bar color
  tierProgressBar.style.background = `linear-gradient(90deg, ${currentTier.color} 0%, ${nextTier ? nextTier.color : currentTier.color} 100%)`;
  
  // Update progress text
  const tierIndicator = document.querySelector('.tier-indicator');
  if (tierIndicator) {
    let progressText = '';
    if (nextTier) {
      const pointsNeeded = nextTier.minPoints - points;
      progressText = `${pointsNeeded} points to ${nextTier.name}`;
    } else {
      progressText = 'Max tier reached!';
    }
    
    let progressTextElement = tierIndicator.querySelector('.tier-progress-text');
    if (!progressTextElement) {
      progressTextElement = document.createElement('div');
      progressTextElement.className = 'tier-progress-text';
      tierIndicator.appendChild(progressTextElement);
    }
    progressTextElement.textContent = progressText;
  }
}

// Show notification animation for points earned
function showPointsNotification(points, reason) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'points-notification';
  notification.innerHTML = `
    <div class="points-notification-icon">⭐</div>
    <div class="points-notification-content">
      <div class="points-notification-points">+${points} points</div>
      <div class="points-notification-reason">${reason}</div>
    </div>
  `;
  
  // Add to rewards section
  const rewardsSection = document.getElementById('rewards');
  if (rewardsSection) {
    rewardsSection.appendChild(notification);
    
    // Trigger animation
    setTimeout(() => {
      notification.classList.add('show');
    }, 10);
    
    // Remove after animation
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => {
        if (rewardsSection.contains(notification)) {
          rewardsSection.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Enhanced award points function with animations
function awardPointsAnimated(points, reason) {
  const rewardsData = loadRewards();
  
  // Add points
  rewardsData.points += points;
  
  // Recalculate tier
  const newTier = calculateTier(rewardsData.points);
  const oldTier = rewardsData.tier;
  rewardsData.tier = newTier;
  
  // Save updated rewards data
  saveRewards(rewardsData);
  
  // Show notification
  showToast(`+${points} points earned!\n${reason}`, 'success');
  
  // Check for tier upgrade
  if (newTier !== oldTier) {
    setTimeout(() => {
      showToast(`🎉 Tier upgraded to ${newTier}!`, 'success');
      // Add celebration animation
      celebrateTierUpgrade();
    }, 500);
  }
  
  // Update display with animations
  updatePointsDisplayAnimated(rewardsData.points);
  updateTierDisplayAnimated(rewardsData.tier, rewardsData.points);
  
  // Re-render rewards grid to update button states
  renderRewardsGrid(rewardsData);
  
  return rewardsData;
}

// Celebration animation for tier upgrade
function celebrateTierUpgrade() {
  const tierIndicator = document.querySelector('.tier-indicator');
  if (tierIndicator) {
    tierIndicator.style.animation = 'tierUpgrade 1s ease-out';
    setTimeout(() => {
      tierIndicator.style.animation = '';
    }, 1000);
  }
}


// ===================================
// Touch Feedback Enhancement
// ===================================

function initTouchFeedback() {
  // Add tap animation to all buttons
  const buttons = document.querySelectorAll('button, .btn, .card-interactive');
  
  buttons.forEach(button => {
    button.addEventListener('touchstart', function() {
      this.classList.add('tap-animate');
    });
    
    button.addEventListener('touchend', function() {
      setTimeout(() => {
        this.classList.remove('tap-animate');
      }, 300);
    });
  });
  
  // Add ripple effect to primary buttons
  const primaryButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
  
  primaryButtons.forEach(button => {
    if (!button.classList.contains('ripple')) {
      button.classList.add('ripple');
    }
  });
  
  // Prevent double-tap zoom on buttons
  const interactiveElements = document.querySelectorAll('button, a, .btn, .card-interactive');
  
  interactiveElements.forEach(element => {
    element.addEventListener('touchend', function(e) {
      e.preventDefault();
      // Trigger click event manually
      this.click();
    }, { passive: false });
  });
}


// ===================================
// Mobile Booking Flow Optimization
// ===================================

function optimizeMobileBookingFlow() {
  // Detect if user is on mobile
  const isMobile = window.innerWidth <= 768;
  
  if (!isMobile) return;
  
  // Add swipe-to-close for modals on mobile
  const modals = document.querySelectorAll('.modal-content');
  
  modals.forEach(modalContent => {
    let startY = 0;
    let currentY = 0;
    let isDragging = false;
    
    modalContent.addEventListener('touchstart', (e) => {
      // Only allow swipe from top area
      if (e.target.closest('.modal-close') || e.target === modalContent) {
        startY = e.touches[0].clientY;
        isDragging = true;
      }
    });
    
    modalContent.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      
      currentY = e.touches[0].clientY;
      const diff = currentY - startY;
      
      // Only allow downward swipe
      if (diff > 0) {
        modalContent.style.transform = `translateY(${diff}px)`;
      }
    });
    
    modalContent.addEventListener('touchend', () => {
      if (!isDragging) return;
      
      const diff = currentY - startY;
      
      // Close modal if swiped down more than 100px
      if (diff > 100) {
        const modal = modalContent.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
          document.body.style.overflow = 'auto';
        }
      }
      
      // Reset transform
      modalContent.style.transform = '';
      isDragging = false;
    });
  });
  
  // Optimize form field focus for mobile
  const formInputs = document.querySelectorAll('input, select, textarea');
  
  formInputs.forEach(input => {
    input.addEventListener('focus', function() {
      // Scroll input into view with some padding
      setTimeout(() => {
        this.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });
  });
  
  // Add haptic feedback for mobile (if supported)
  if ('vibrate' in navigator) {
    const buttons = document.querySelectorAll('button, .btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        // Short vibration for button press
        navigator.vibrate(10);
      });
    });
  }
  
  // Optimize modal positioning for mobile keyboard
  const modalForms = document.querySelectorAll('.modal form');
  
  modalForms.forEach(form => {
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('focus', () => {
        // Add class to modal when keyboard is open
        const modal = form.closest('.modal-content');
        if (modal) {
          modal.classList.add('keyboard-open');
        }
      });
      
      input.addEventListener('blur', () => {
        // Remove class when keyboard closes
        const modal = form.closest('.modal-content');
        if (modal) {
          setTimeout(() => {
            modal.classList.remove('keyboard-open');
          }, 100);
        }
      });
    });
  });
}

// Re-optimize on window resize
let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    optimizeMobileBookingFlow();
  }, 250);
});
