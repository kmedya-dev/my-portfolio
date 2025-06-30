// ===============================
// ========== script.js ==========
// ===============================

// This script enhances the portfolio with interactive features:
// 1.  A sticky header that changes background on scroll.
// 2.  A mobile-friendly navigation menu toggle.
// 3.  A simple contact form handler.
// 4.  Dynamic blog post loading and display.

console.log("Hello from script.js 👋");

document.addEventListener('DOMContentLoaded', () => {
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
  console.log('menuToggle element:', menuToggle);
  console.log('nav element:', nav);
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const sections = document.querySelectorAll('section'); // Select all sections
  const blogList = document.getElementById('blog-posts'); // Blog posts container
  const achievementsGrid = document.getElementById('achievements-grid'); // Achievements container

  // --- Data ---
  // List of Markdown files for blog posts.
  const postFiles = ['sample-blog.md', 'web-dev-tools.md', 'ai-vs-coding.md'];

  // ===================================================================
  // =================== INTERACTIVE UI FEATURES =======================
  // ===================================================================

  // --- Section Title Display on Scroll ---
  // Removed section title display logic as the element is no longer present.

  // --- Sticky Header on Scroll & Autohide ---
  let lastScrollY = window.scrollY;
  let hideHeaderTimeout; // Variable to store the timeout ID
  const backToTopButton = document.getElementById('backToTop');

  const hideHeader = () => {
    header.classList.add('hidden');
  };

  window.addEventListener('scroll', () => {
    // Clear any existing auto-hide timeout
    clearTimeout(hideHeaderTimeout);

    if (window.scrollY > 50) {
      header.classList.add('scrolled');
      backToTopButton.style.display = 'block'; // Show back to top button
    } else {
      header.classList.remove('scrolled');
      backToTopButton.style.display = 'none'; // Hide back to top button
    }

    // Logic for showing/hiding based on scroll direction
    if (window.scrollY < lastScrollY) {
      // Scrolling up: always show header
      header.classList.remove('hidden');
    } else if (window.scrollY > lastScrollY && window.scrollY > header.offsetHeight) {
      // Scrolling down and past header height: hide header
      header.classList.add('hidden');
    }

    // If header is currently visible, set a timeout to hide it after 3 seconds
    // This applies whether scrolling up (to make it visible) or just being idle
    if (!header.classList.contains('hidden')) {
      hideHeaderTimeout = setTimeout(hideHeader, 3000); // 3 seconds
    }

    lastScrollY = window.scrollY;
  });

  // Initial auto-hide if no scroll happens immediately
  hideHeaderTimeout = setTimeout(hideHeader, 3000); // Hide after 3 seconds on initial load if no scroll

  // Back to top button click event
  if (backToTopButton) {
    backToTopButton.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Mobile Navigation Toggle ---
  // Toggles the 'active' class on the navigation menu to show/hide it.
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

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
  // ======================= BLOG POST LOADER ==========================
  // ===================================================================

  // --- Front Matter Parser ---
  // A robust parser to extract metadata (like title, date) from the top of a Markdown file.
  // Metadata is expected to be in YAML format, enclosed by '---'.
  const parseFrontMatter = (text) => {
    const match = text.match(/^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/);
    if (!match) {
      return { metadata: {}, content: text };
    }

    const [, meta, content] = match;
    const lines = meta.trim().split('\n');
    const metadata = {};
    lines.forEach(line => {
      const i = line.indexOf(':');
      if (i > 0) {
        const key = line.slice(0, i).trim();
        const value = line.slice(i + 1).trim();
        metadata[key] = value;
      }
    });
    return { metadata, content: content.trim() };
  };

  // --- Blog Post Loader ---
  // Asynchronously fetches and displays all blog posts.
  const loadBlogPosts = async () => {
    let posts = [];
    console.log("Attempting to load blog posts...");

    for (const file of postFiles) {
      try {
        console.log(`Fetching blog post: blog/${file}`);
        const res = await fetch(`blogs/${file}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch ${file}: ${res.statusText}`);
        }
        const text = await res.text();
        console.log(`Successfully fetched ${file}. Content length: ${text.length}`);
        const { metadata, content } = parseFrontMatter(text);
        console.log(`Parsed metadata for ${file}:`, metadata);
        posts.push({ ...metadata, content });
      } catch (error) {
        console.error(`Error loading blog post ${file}:`, error);
      }
    }

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log("Sorted posts:", posts);

    blogList.innerHTML = posts.map(post => `
      <div class="blog-post-card" data-title="${post.title}" data-category="${post.category}">
        <img src="https://via.placeholder.com/300x200" alt="${post.title}" />
        <h3>${post.title}</h3>
        <p>${post.content.substring(0, 100)}...</p>
      </div>
    `).join('');
    console.log("Blog posts rendered to DOM.");

    // Add click listener for expandable blog posts
    document.querySelectorAll('.blog-post-card').forEach(card => {
      card.addEventListener('click', (e) => {
        const title = e.currentTarget.dataset.title;
        console.log(`Clicked on blog post: ${title}. Full content would be displayed here.`);
        // In a real implementation, you would open a modal or navigate to a new page
        // to display the full blog post content.
      });
    });
  };

  // --- Initial Load ---
  loadBlogPosts();

  // ===================================================================
  // ======================= CERTIFICATIONS LOADER =====================
  // ===================================================================

  const loadCertifications = async () => {
    try {
      const res = await fetch('assets/js/certifications.json');
      if (!res.ok) {
        const errorText = `Failed to fetch certifications: ${res.status} ${res.statusText}`;
        console.error(errorText);
        throw new Error(errorText);
      }
      const certifications = await res.json();
      console.log("Successfully fetched certifications:", certifications);

      achievementsGrid.innerHTML = certifications.map(cert => `
        <div class="achievement-item">
          <h3>${cert.title}</h3>
          <p><strong>Issuer:</strong> ${cert.issuer}</p>
          <p><strong>Issued:</strong> ${cert.issuedDate}</p>
          ${cert.credentialId ? `<p><strong>Credential ID:</strong> ${cert.credentialId}</p>` : ''}
          ${cert.verificationUrl ? `<p><a href="${cert.verificationUrl}" target="_blank" class="btn btn-secondary">Verify Credential</a></p>` : ''}
          ${cert.skills && cert.skills.length > 0 ? `<p><strong>Skills:</strong> ${cert.skills.join(', ')}</p>` : ''}
        </div>
      `).join('');
      console.log("Certifications rendered to DOM.");

    } catch (error) {
      console.error("Error loading certifications:", error);
    }
  };

  loadCertifications();

  // --- Blog Post Filtering ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      const category = button.dataset.category;
      
      // Set active class on button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');
      
      // Filter posts
      const blogPosts = document.querySelectorAll('.blog-post-card');
      blogPosts.forEach(post => {
        if (category === 'all' || post.dataset.category === category) {
          post.style.display = 'block';
        } else {
          post.style.display = 'none';
        }
      });
    });
  });

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
        console.error('Network error:', error);
      }
    });
  }
});