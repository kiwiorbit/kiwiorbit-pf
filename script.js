document.addEventListener('DOMContentLoaded', () => {
    // Initialize Navbar Scroll Effect
    initNavbarScroll();

    // Initialize Navbar Glow Effect
    initNavbarGlow();

    // Initialize Orbital Navigation
    initOrbitalNav();

    // Initialize Particle Canvas - Commented out for now
    // initParticleCanvas();

    // Initialize Typing Effect
    initTypingEffect();

    // Mobile Menu Toggle
    initMobileMenu();

    // Contact Form Handling
    initContactForm();

    // Set Current Year in Footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Smooth Scrolling for Navigation Links
    initSmoothScrolling();

    // Initialize Project Modal
    initProjectModal();
});

// Particle Canvas Animation
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Particle settings
    const particleCount = 100;
    const particles = [];

    // Colors
    const colors = ['#8CBF3F', '#5A7D26', '#F59E0B', '#DEE2E6'];

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: Math.random() * 1 - 0.5,
            speedY: Math.random() * 1 - 0.5,
            opacity: Math.random() * 0.5 + 0.1
        });
    }

    // Draw particles
    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Update and draw each particle
        particles.forEach(particle => {
            // Move particle
            particle.x += particle.speedX;
            particle.y += particle.speedY;

            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;

            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;

            // Draw connections
            connectParticles(particle);
        });

        requestAnimationFrame(drawParticles);
    }

    // Connect particles with lines if they're close enough
    function connectParticles(p1) {
        particles.forEach(p2 => {
            // Skip self
            if (p1 === p2) return;

            // Calculate distance
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Connect if close enough
            if (distance < 100) {
                // Opacity based on distance
                const opacity = 1 - (distance / 100);

                ctx.beginPath();
                ctx.strokeStyle = p1.color;
                ctx.globalAlpha = opacity * 0.2;
                ctx.lineWidth = 1;
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        });
    }

    // Start animation
    drawParticles();

    // Resize canvas when window is resized
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// Typing Effect
function initTypingEffect() {
    const typingElement = document.getElementById('typing-text');
    const phrases = [
        'responsive websites.',
        'engaging user interfaces.',
        'creative web applications.',
        'unique digital designs.',
        'seamless user experiences.',
        'modern landing pages.'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            // Deleting text
            typingElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Faster when deleting
        } else {
            // Typing text
            typingElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Normal typing speed
        }

        // If word is complete
        if (!isDeleting && charIndex === currentPhrase.length) {
            // Pause at the end of phrase
            isDeleting = true;
            typingSpeed = 1500; // Pause before deleting
        } else if (isDeleting && charIndex === 0) {
            // Move to next phrase after deleting
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before typing new phrase
        }

        setTimeout(type, typingSpeed);
    }

    // Start typing effect
    setTimeout(type, 1000);
}

// Mobile Menu Toggle
function initMobileMenu() {
    const menuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');

        // Change icon based on menu state
        const icon = menuButton.querySelector('i');
        if (mobileMenu.classList.contains('hidden')) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        } else {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    });

    // Close menu when clicking on a link
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
            const icon = menuButton.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// Project Filtering function removed

// Contact Form Handling
function initContactForm() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form data
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());

            // Simple validation
            let isValid = true;
            const inputs = contactForm.querySelectorAll('input, textarea');

            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = '#ff00ff'; // Highlight empty fields
                } else {
                    input.style.borderColor = ''; // Reset border
                }
            });

            if (!isValid) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formValues.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Message sent successfully!', 'success');

            // Reset form
            contactForm.reset();
        });
    }
}

// Show notification
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg z-50 ${type === 'error' ? 'bg-cyber-pink/90' : 'bg-cyber-green/90'}`;
    notification.innerHTML = `
        <div class="flex items-center">
            <i class="fas ${type === 'error' ? 'fa-exclamation-circle' : 'fa-check-circle'} mr-2"></i>
            <p>${message}</p>
        </div>
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Navbar Scroll Effect
function initNavbarScroll() {
  const navbar = document.getElementById('main-navbar');
  const aboutSection = document.getElementById('about');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const navLinks = document.querySelector('.nav-links');

  // Set initial state immediately
  if (window.scrollY === 0) {
    navbar.classList.add('navbar-transparent');
    navbar.classList.remove('navbar-scrolled');

    // Hide nav links initially
    if (navLinks) {
      navLinks.style.opacity = '0';
      navLinks.style.visibility = 'hidden';
    }
  }

  // Function to handle scroll
  function handleScroll() {
    // Get the position of the about section
    const aboutPosition = aboutSection.getBoundingClientRect().top;

    // If we've scrolled to or past the about section
    if (aboutPosition <= 0) {
      navbar.classList.add('navbar-scrolled');
      navbar.classList.remove('navbar-transparent');

      // Show nav links
      if (navLinks) {
        navLinks.style.opacity = '1';
        navLinks.style.visibility = 'visible';
      }

      // Show mobile menu button on mobile
      if (window.innerWidth <= 768 && mobileMenuButton) {
        mobileMenuButton.style.opacity = '1';
      }
    } else {
      navbar.classList.add('navbar-transparent');
      navbar.classList.remove('navbar-scrolled');

      // Hide nav links
      if (navLinks) {
        navLinks.style.opacity = '0';
        navLinks.style.visibility = 'hidden';
      }

      // Hide mobile menu button on mobile when at top
      if (window.innerWidth <= 768 && mobileMenuButton) {
        mobileMenuButton.style.opacity = '1'; // Always visible on mobile
      }
    }
  }

  // Initial check
  handleScroll();

  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);

  // Handle window resize
  window.addEventListener('resize', handleScroll);
}

// Navbar Glow Effect
function initNavbarGlow() {
  const navbar = document.querySelector('nav');
  const navLinks = document.querySelectorAll('.nav-link');

  // Add pulse animation to navbar on page load
  setTimeout(() => {
    navbar.classList.add('pulse-border');
    setTimeout(() => {
      navbar.classList.remove('pulse-border');
    }, 1500);
  }, 1000);

  // Add glow effect when hovering over nav links
  navLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      navbar.classList.add('active-glow');
    });

    link.addEventListener('mouseleave', () => {
      navbar.classList.remove('active-glow');
    });
  });
}

// Orbital Navigation
function initOrbitalNav() {
  // Create stars in the background
  const heroSection = document.getElementById('hero');

  // Create stars
  for (let i = 0; i < 50; i++) {
    createStar(heroSection);
  }

  // Create shooting stars
  for (let i = 0; i < 3; i++) {
    createShootingStar(heroSection);
  }

  // Comet removed

  // Ensure nav items face the right direction as they orbit
  const navItems = document.querySelectorAll('.orbital-nav-item');

  // Initial positioning of text tooltips
  positionTooltips(navItems);

  // Update tooltip positions periodically
  setInterval(() => {
    positionTooltips(navItems);
  }, 1000);

  // Handle window resize to ensure orbits stay centered
  window.addEventListener('resize', () => {
    positionTooltips(navItems);
  });

  // Smooth scrolling for navigation links
  navItems.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();

      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        // Add a visual effect when clicking a nav item
        this.classList.add('pulse');
        setTimeout(() => {
          this.classList.remove('pulse');
        }, 700);

        window.scrollTo({
          top: targetSection.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Function to create a star
function createStar(container) {
  const star = document.createElement('div');
  star.className = 'star';

  // Random size
  const size = Math.random() * 3 + 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;

  // Random position
  const posX = Math.random() * 100;
  const posY = Math.random() * 100;
  star.style.left = `${posX}%`;
  star.style.top = `${posY}%`;

  // Random animation delay
  star.style.animationDelay = `${Math.random() * 4}s`;

  container.appendChild(star);
}

// Function to create a shooting star
function createShootingStar(container) {
  const shootingStar = document.createElement('div');
  shootingStar.className = 'shooting-star';

  // Random position
  const posX = Math.random() * 70;
  const posY = Math.random() * 70;
  shootingStar.style.left = `${posX}%`;
  shootingStar.style.top = `${posY}%`;

  // Random animation delay
  shootingStar.style.animationDelay = `${Math.random() * 10 + 5}s`;

  // Random rotation
  const rotation = Math.random() * 60 + 20;
  shootingStar.style.transform = `rotate(${rotation}deg)`;

  container.appendChild(shootingStar);
}

// Function to position tooltips based on nav item position
function positionTooltips(navItems) {
  navItems.forEach(item => {
    const tooltip = item.querySelector('.nav-text');
    const rect = item.getBoundingClientRect();
    const heroRect = document.getElementById('hero').getBoundingClientRect();
    const centerX = heroRect.left + heroRect.width / 2;
    const centerY = heroRect.top + heroRect.height / 2;

    // Calculate position relative to center
    const relX = rect.left + rect.width / 2 - centerX;
    const relY = rect.top + rect.height / 2 - centerY;

    // Determine which side to place the tooltip based on quadrant
    if (relX > 0 && relY < 0) {
      // Top-right quadrant
      tooltip.style.top = '100%';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translateX(-50%)';
      tooltip.style.marginTop = '10px';
    } else if (relX > 0 && relY > 0) {
      // Bottom-right quadrant
      tooltip.style.right = '100%';
      tooltip.style.top = '50%';
      tooltip.style.transform = 'translateY(-50%)';
      tooltip.style.marginRight = '10px';
    } else if (relX < 0 && relY > 0) {
      // Bottom-left quadrant
      tooltip.style.top = '0';
      tooltip.style.left = '50%';
      tooltip.style.transform = 'translate(-50%, -100%)';
      tooltip.style.marginTop = '-10px';
    } else {
      // Top-left quadrant
      tooltip.style.left = '100%';
      tooltip.style.top = '50%';
      tooltip.style.transform = 'translateY(-50%)';
      tooltip.style.marginLeft = '10px';
    }
  });
}

// Smooth Scrolling
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    const chevronDown = document.querySelector('.fa-chevron-down').parentElement;

    // Regular nav links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Skip if it's just '#'
            if (this.getAttribute('href') === '#') return;

            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            // Special handling for chevron down icon
            if (this === chevronDown) {
                smoothScrollToElement(targetElement);
            } else {
                // Regular scroll for other links
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80, // Offset for fixed header
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Function for smooth auto-scrolling with animation
    function smoothScrollToElement(element) {
        if (!element) return;

        const startPosition = window.scrollY; // Using scrollY instead of deprecated pageYOffset
        const targetPosition = element.offsetTop - 80; // Offset for fixed header
        const distance = targetPosition - startPosition;
        const duration = 1500; // Longer duration for slower scroll (in ms)
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);

            // Easing function for smoother animation
            const ease = easeInOutCubic(progress);

            window.scrollTo(0, startPosition + distance * ease);

            if (timeElapsed < duration) {
                requestAnimationFrame(animation);
            }
        }

        // Cubic easing function - smoother start and end
        function easeInOutCubic(t) {
            return t < 0.5
                ? 4 * t * t * t
                : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        requestAnimationFrame(animation);
    }

    // Highlight active section in navigation
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;

        // Get all sections
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('text-kiwi');
                });

                // Add active class to current section link
                const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('text-kiwi');
                }
            }
        });
    });
}

// Project Modal Functionality
function initProjectModal() {
    // Only initialize on desktop
    if (window.innerWidth <= 768) return;

    const modal = document.getElementById('project-modal');
    const modalOverlay = modal.querySelector('.modal-overlay');
    const modalClose = document.getElementById('modal-close');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTechnologies = document.getElementById('modal-technologies');
    const modalLink = document.getElementById('modal-link');
    const projectItems = document.querySelectorAll('.project-item');

    // Open modal when clicking on a project
    projectItems.forEach(item => {
        item.addEventListener('click', () => {
            // Get project data from data attributes
            const title = item.getAttribute('data-title');
            const description = item.getAttribute('data-description');
            const image = item.getAttribute('data-image');
            const link = item.getAttribute('data-link');
            const technologies = item.getAttribute('data-technologies').split(',');

            // Populate modal with project data
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalImage.src = image;
            modalImage.alt = title;
            modalLink.href = link;

            // Clear and populate technologies
            modalTechnologies.innerHTML = '';
            technologies.forEach(tech => {
                const techTag = document.createElement('span');
                techTag.className = 'tech-tag';
                techTag.textContent = tech;
                modalTechnologies.appendChild(techTag);
            });

            // Show modal with animation
            document.body.classList.add('modal-open');
            modal.classList.add('active');

            // Prevent scrolling when modal is open
            document.body.style.overflow = 'hidden';
        });
    });

    // Close modal when clicking on close button or overlay
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);

    // Close modal when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Function to close the modal
    function closeModal() {
        modal.classList.remove('active');
        document.body.classList.remove('modal-open');
        document.body.style.overflow = '';
    }

    // Handle window resize
    window.addEventListener('resize', () => {
        if (window.innerWidth <= 768 && modal.classList.contains('active')) {
            closeModal();
        }
    });
}