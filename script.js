console.log("Hello from script.js 👋");

document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('section');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  });

  sections.forEach((section) => {
    observer.observe(section);
  });
});
