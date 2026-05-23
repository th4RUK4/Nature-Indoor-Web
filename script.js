// ─── LOADING SCREEN ───
window.addEventListener('load', () => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 600);
  }
});

// Hide loading screen after 10 seconds even if page hasn't fully loaded
setTimeout(() => {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen && !loadingScreen.classList.contains('hidden')) {
    loadingScreen.classList.add('hidden');
    setTimeout(() => {
      loadingScreen.style.display = 'none';
    }, 600);
  }
}, 10000);

// ─── NAV SCROLL ───
const navbar = document.getElementById('navbar');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  // Add scrolled class for styling changes
  navbar.classList.toggle('scrolled', currentScrollY > 60);

  // Hide navbar on scroll down, show on scroll up
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    navbar.classList.add('hidden');
  } else {
    navbar.classList.remove('hidden');
  }

  lastScrollY = currentScrollY;
});

// ─── POP-OUT IMAGE SCROLL TOGGLE ───
const popOutImage = document.querySelector('.pop-out-image');
let lastPopOutScrollY = 0;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  if (currentScrollY > lastPopOutScrollY && currentScrollY > 200) {
    popOutImage.classList.add('hidden');
  } else {
    popOutImage.classList.remove('hidden');
  }

  lastPopOutScrollY = currentScrollY;
});

// ─── MOBILE MENU ───
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
hamburger.addEventListener('keydown', e => { if(e.key==='Enter') mobileMenu.classList.add('open'); });
mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));

document.querySelectorAll('.mm-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
  });
});

// ─── REVEAL ON SCROLL ───
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── GALLERY TABS ───
const galleryTabs = document.querySelectorAll('.gallery-tab');
const galleryMasonries = document.querySelectorAll('.gallery-masonry');

galleryTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const category = tab.dataset.category;

    galleryTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    galleryMasonries.forEach(masonry => {
      if (masonry.dataset.category === category) {
        masonry.classList.remove('hidden');
      } else {
        masonry.classList.add('hidden');
      }
    });
  });
});

// ─── FORM SUBMIT ───
function handleSubmit(e) {
  e.preventDefault();
  document.getElementById('form-success').style.display = 'block';
  e.target.reset();
}

// ─── THEME TOGGLE ───
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
  const toggleText = themeToggleBtn.querySelector('.toggle-text');

  const updateThemeToggle = () => {
    const isDarkMode = document.body.classList.contains('dark-mode');
    toggleText.textContent = isDarkMode ? 'ON' : 'OFF';
    themeToggleBtn.setAttribute('aria-label', isDarkMode ? 'Turn dark mode off' : 'Turn dark mode on');
  };
  
  themeToggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    updateThemeToggle();
  });

  updateThemeToggle();
}
