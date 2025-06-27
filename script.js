// ===============================
// ========== script.js ==========
// ===============================

// This script enhances the portfolio with interactive features:
// 1.  A "Back to Top" button that appears on scroll.
// 2.  Smooth animations for sections as they scroll into view.
// 3.  A dynamic blog loader that fetches, parses, and displays posts from Markdown files.
// 4.  A mobile-friendly navigation menu toggle.

console.log("Hello from script.js 👋");

document.addEventListener('DOMContentLoaded', () => {
  // --- Element Selections ---
  const sections = document.querySelectorAll('section');
  const topBtn = document.getElementById('backToTop');
  const blogList = document.getElementById('blog-posts');
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  // --- Data ---
  // List of Markdown files for blog posts.
  const postFiles = ['sample.md', 'web-dev-tools.md', 'ai-vs-coding.md'];

  // ===================================================================
  // =================== INTERACTIVE UI FEATURES =======================
  // ===================================================================

  // --- Back to Top Button ---
  // Shows the button when the user scrolls down 200px.
  window.addEventListener('scroll', () => {
    topBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
  });

  // Scrolls the page to the top smoothly when the button is clicked.
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // --- Section Animation on Scroll ---
  // Uses IntersectionObserver to add a 'visible' class to sections when they enter the viewport.
  // This triggers a fade-in animation defined in style.css.
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) target.classList.add('visible');
    });
  });
  sections.forEach(section => observer.observe(section));

  // --- Mobile Navigation Toggle ---
  // Toggles the 'active' class on the navigation menu to show/hide it.
  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });

  // ===================================================================
  // ======================= BLOG POST LOADER ==========================
  // ===================================================================

  // --- Front Matter Parser ---
  // A simple parser to extract metadata (like title, date) from the top of a Markdown file.
  // Metadata is expected to be in YAML format, enclosed by '---'.
  const parseFrontMatter = (text) => {
    // Splits the file into metadata and content parts.
    const [meta, ...body] = text.split('---').filter(Boolean);
    const lines = meta.trim().split('\n');
    const metadata = {};
    // Parses each line of the metadata.
    lines.forEach(line => {
      const [key, ...rest] = line.split(':');
      metadata[key.trim()] = rest.join(':').trim();
    });
    // Returns the parsed metadata and the main content.
    return { metadata, content: body.join('---').trim() };
  };

  // --- Blog Post Loader ---
  // Asynchronously fetches and displays all blog posts.
  const loadBlogPosts = async () => {
    let posts = [];

    // 1. Fetch each Markdown file from the 'blog/' directory.
    for (const file of postFiles) {
      const res = await fetch(`blog/${file}`);
      const text = await res.text();
      // 2. Parse the front matter and content from the file.
      const { metadata, content } = parseFrontMatter(text);
      posts.push({ ...metadata, content });
    }

    // 3. Sort posts by date in descending order (newest first).
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));

    // 4. Generate HTML for each post and inject it into the #blog-posts container.
    // It uses the 'marked' library (loaded in index.html) to convert Markdown to HTML.
    // A snippet of the content (first 200 chars) is shown as a preview.
    blogList.innerHTML = posts.map(post => `
      <article class="project">
        <h3>${post.title}</h3>
        <small>${post.date}</small>
        <div>${marked.parse(post.content.substring(0, 200))}...</div>
      </article>
    `).join('');
  };

  // --- Initial Load ---
  // Load the blog posts as soon as the page is ready.
  loadBlogPosts();

  // ===================================================================
  // ======================= CONTACT FORM ============================
  // ===================================================================

  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent the default form submission

    // Simulate form submission
    formStatus.textContent = 'Sending...';

    setTimeout(() => {
      formStatus.textContent = 'Your message has been sent successfully!';
      contactForm.reset(); // Clear the form
    }, 2000); // Simulate a 2-second delay
  });
});
