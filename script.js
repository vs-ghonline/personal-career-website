// ============================================
// Theme: System / Light / Dark cycle
// Initial theme is applied by inline <script> in <head> (avoids FOUC).
// This block adds the click cycle + reacts to OS theme changes.
// ============================================
const STATES = ['system', 'light', 'dark'];
const themeToggle = document.getElementById('theme-toggle');
const mq = window.matchMedia('(prefers-color-scheme: dark)');

function resolveEffective(mode) {
    return mode === 'system' ? (mq.matches ? 'dark' : 'light') : mode;
}

function applyMode(mode) {
    document.documentElement.setAttribute('data-theme-mode', mode);
    document.documentElement.setAttribute('data-theme', resolveEffective(mode));
    const next = STATES[(STATES.indexOf(mode) + 1) % STATES.length];
    const label = `Theme: ${mode} — click for ${next}`;
    themeToggle.setAttribute('aria-label', label);
    themeToggle.setAttribute('title', label);
    if (mode === 'system') localStorage.removeItem('theme');
    else localStorage.setItem('theme', mode);
}

// Sync the aria-label with whatever mode the inline init script set
applyMode(document.documentElement.getAttribute('data-theme-mode') || 'system');

// Cycle on click: system → light → dark → system → ...
themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme-mode');
    applyMode(STATES[(STATES.indexOf(current) + 1) % STATES.length]);
});

// React to OS theme changes — only while user is in system mode
mq.addEventListener('change', () => {
    if (document.documentElement.getAttribute('data-theme-mode') === 'system') {
        document.documentElement.setAttribute('data-theme', resolveEffective('system'));
    }
});

// ============================================
// Navigation: scroll styling & mobile toggle
// ============================================
const nav = document.getElementById('nav');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile nav when a link is clicked
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// ============================================
// Scroll-triggered fade-in animations
// ============================================
const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-up').forEach(el => {
    observer.observe(el);
});

// ============================================
// Smooth scroll for anchor links (fallback)
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            const navHeight = nav.offsetHeight;
            const targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
            window.scrollTo({ top: targetPos, behavior: 'smooth' });
        }
    });
});

// ============================================
// Active nav link highlighting on scroll
// ============================================
const sections = document.querySelectorAll('section[id]');

function highlightNav() {
    const scrollPos = window.scrollY + nav.offsetHeight + 100;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = navLinks.querySelector(`a[href="#${id}"]`);

        if (link) {
            if (scrollPos >= top && scrollPos < top + height) {
                link.style.color = 'var(--color-accent)';
            } else if (!link.classList.contains('nav-cta')) {
                link.style.color = '';
            }
        }
    });
}

window.addEventListener('scroll', highlightNav);
highlightNav();
