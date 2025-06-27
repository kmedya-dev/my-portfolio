// ===============================
// ========== script.js =========
// ===============================

console.log("Hello from script.js 👋");

document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('section');
  const topBtn = document.getElementById('backToTop');
  const blogList = document.getElementById('blog-posts');
  const postFiles = ['sample.md', 'web-dev-tools.md', 'ai-vs-coding.md'];

  // Back to top button
  window.addEventListener('scroll', () => {
    topBtn.style.display = window.scrollY > 200 ? 'flex' : 'none';
  });
  topBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Section animation
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ isIntersecting, target }) => {
      if (isIntersecting) target.classList.add('visible');
    });
  });
  sections.forEach(section => observer.observe(section));

  // Blog loader
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
      <article class="project">
        <h3>${post.title}</h3>
        <small>${post.date}</small>
        <div>${marked.parse(post.content.substring(0, 200))}...</div>
      </article>
    `).join('');
  };

  loadBlogPosts();

  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav');

  menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
  });
});
