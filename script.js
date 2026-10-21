// All functions are local to the page. No analytics, forms, or data collection.
document.documentElement.classList.add('js');

const header = document.getElementById('siteHeader');
const progress = document.getElementById('scrollProgress');
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
const printButton = document.getElementById('printButton');

function updateScroll() {
  const scrolled = window.scrollY;
  header.classList.toggle('is-fixed', scrolled > 80);
  const total = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  progress.style.width = `${Math.min(100, scrolled / total * 100)}%`;
}
let ticking = false;
window.addEventListener('scroll', () => {
  if (!ticking) {
    requestAnimationFrame(() => { updateScroll(); ticking = false; });
    ticking = true;
  }
}, { passive: true });
updateScroll();

menuToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Закрыть меню' : 'Открыть меню');
});
mainNav.querySelectorAll('a').forEach(anchor => anchor.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
}));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealElements = document.querySelectorAll('.reveal');
if (!('IntersectionObserver' in window) || reducedMotion) {
  revealElements.forEach(element => element.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px 70px 0px', threshold: 0.02 });
  revealElements.forEach(element => revealObserver.observe(element));
}

const navLinks = [...document.querySelectorAll('.main-nav a[href^="#"]')];
const sections = [...document.querySelectorAll('main section[id]')];
if ('IntersectionObserver' in window) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === `#${entry.target.id}`;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      }
    });
  }, { rootMargin: '-25% 0px -60% 0px' });
  sections.forEach(section => navObserver.observe(section));
}

printButton.addEventListener('click', () => {
  document.querySelectorAll('.job-details').forEach(details => { details.open = true; });
  setTimeout(() => window.print(), 80);
});
window.addEventListener('beforeprint', () => document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible')));
