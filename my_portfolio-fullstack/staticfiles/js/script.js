// ===============================
// ========== script.js ==========
// ===============================

// This script enhances the portfolio with interactive features:
// 1.  A sticky header that changes background on scroll.
// 2.  A mobile-friendly navigation menu toggle.
// 3.  A simple contact form handler.
// 4.  Dynamic blog post loading and display.



document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded event fired.');
  // --- Splash Screen Logic ---
  const splashScreen = document.getElementById('splash-screen');
  if (splashScreen) {
    setTimeout(() => {
      splashScreen.style.opacity = '0';
      setTimeout(() => {
        splashScreen.style.display = 'none';
      }, 500); // Match CSS transition duration
    }, 2000); // Display for 2 seconds
  }

  // --- Element Selections ---
  const header = document.querySelector('.header');
  const menuToggle = document.getElementById('menu-toggle');
  const nav = document.querySelector('.nav');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const sections = document.querySelectorAll('section'); // Select all sections

  console.log('menuToggle:', menuToggle);
  console.log('nav:', nav);
  console.log('closeMenuBtn:', closeMenuBtn);

  // ===================================================================
  // =================== INTERACTIVE UI FEATURES =======================
  // ===================================================================

  // --- Section Title Display on Scroll ---
  // Removed section title display logic as the element is no longer present.

  const backToTopButton = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      backToTopButton.style.display = 'block'; // Show back to top button
    } else {
      header.classList.remove('scrolled');
      backToTopButton.style.display = 'none'; // Hide back to top button
    }
  });

  // Back to top button click event
  if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Mobile Navigation Toggle ---
  // Toggles the 'active' class on the navigation menu to show/hide it.
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      console.log('menuToggle clicked.');
      if (nav.classList.contains('active')) {
        nav.classList.remove('active');
        console.log('nav active class removed. Current classes:', nav.classList);
      } else {
        nav.classList.add('active');
        console.log('nav active class added. Current classes:', nav.classList);
      }
    });
  }

  if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', () => {
      console.log('closeMenuBtn clicked.');
      nav.classList.remove('active'); // Close the menu
      console.log('nav active class removed. Current classes:', nav.classList);
    });
  }

  // --- Section Animation on Scroll ---
  // Uses IntersectionObserver to add a 'visible' class to sections when they enter the viewport.
  // This triggers a fade-in animation defined in style.css.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) {
        target.classList.add('visible');
        observer.unobserve(target); // Stop observing once visible
      }
    });
  }, {
    threshold: 0.1 // Trigger when 10% of the section is visible
  });
  sections.forEach(section => observer.observe(section));

  // ===================================================================
  // ======================= CONTACT FORM ============================
  // ===================================================================

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault(); // Prevent the default form submission

      formStatus.textContent = 'Sending...';
      formStatus.style.color = '#ff8c00'; // Orange for sending

      const formData = new FormData(contactForm);

      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method,
          body: formData,
          headers: {
              'Accept': 'application/json'
          }
        });

        if (response.ok) {
          formStatus.textContent = 'Your message has been sent successfully!';
          formStatus.style.color = '#03dac6'; // Green for success
          contactForm.reset(); // Clear the form
        } else {
          const data = await response.json();
          if (Object.hasOwnProperty.call(data, 'errors')) {
            formStatus.textContent = data["errors"].map(error => error["message"]).join(", ");
          } else {
            formStatus.textContent = 'Oops! There was a problem submitting your form.';
          }
          formStatus.style.color = '#ff0000'; // Red for error
        }
      } catch (error) {
        formStatus.textContent = 'Oops! There was a network error.';
        formStatus.style.color = '#ff0000'; // Red for error
        
      }
    });
  }
});