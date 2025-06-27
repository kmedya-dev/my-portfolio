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
  // --- Element Selections ---
  const header = document.querySelector('.header');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const sections = document.querySelectorAll('section'); // Select all sections
  const blogList = document.getElementById('blog-posts'); // Blog posts container

  // --- Data ---
  // List of Markdown files for blog posts.
  const postFiles = ['sample.md', 'web-dev-tools.md', 'ai-vs-coding.md'];

  // ===================================================================
  // =================== INTERACTIVE UI FEATURES =======================
  // ===================================================================

  // --- Sticky Header on Scroll ---
  // Adds a background color to the header when the user scrolls down.
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

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
  // A simple parser to extract metadata (like title, date) from the top of a Markdown file.
  // Metadata is expected to be in YAML format, enclosed by '---'.
  const parseFrontMatter = (text) => {
    const [meta, ...body] = text.split('---').filter(Boolean);
    const lines = meta.trim().split('\n');
    const metadata = {};
    lines.forEach(line => {
      const [key, ...rest] = line.split(':');
      metadata[key.trim()] = rest.join(':').trim();
    });
    return { metadata, content: body.join('---').trim() };
  };

  // --- Blog Post Loader ---
  // Asynchronously fetches and displays all blog posts.
  const loadBlogPosts = async () => {
    let posts = [];

    for (const file of postFiles) {
      const res = await fetch(`blog/${file}`);
      const text = await res.text();
      const { metadata, content } = parseFrontMatter(text);
      posts.push({ ...metadata, content });
    }

    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    blogList.innerHTML = posts.map(post => `
      <div class="blog-post-card" data-title="${post.title}">
        <img src="https://via.placeholder.com/300x200" alt="${post.title}" />
        <h3>${post.title}</h3>
        <p>${post.content.substring(0, 100)}...</p>
      </div>
    `).join('');

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
