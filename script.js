const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
const year = document.getElementById('year');
const revealItems = document.querySelectorAll('.reveal');

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12
});

revealItems.forEach((item) => {
  revealObserver.observe(item);
});

const sectorCards = document.querySelectorAll('.sector-card');

if (sectorCards.length > 1) {
  let currentSector = 0;

  setInterval(() => {
    sectorCards[currentSector].classList.remove('is-active');
    currentSector = (currentSector + 1) % sectorCards.length;
    sectorCards[currentSector].classList.add('is-active');
  }, 2600);
}

const portfolioCards = document.querySelectorAll('.portfolio-card');
const portfolioLightbox = document.getElementById('portfolioLightbox');
const portfolioLightboxImage = document.getElementById('portfolioLightboxImage');
const portfolioLightboxCounter = document.getElementById('portfolioLightboxCounter');
const portfolioLightboxClose = document.querySelector('.portfolio-lightbox-close');
const portfolioLightboxPrev = document.querySelector('.portfolio-lightbox-prev');
const portfolioLightboxNext = document.querySelector('.portfolio-lightbox-next');
const portfolioLightboxBackdrop = document.querySelector('.portfolio-lightbox-backdrop');

let currentGallery = [];
let currentGalleryIndex = 0;

function updatePortfolioLightbox() {
  if (!currentGallery.length) return;

  portfolioLightboxImage.src = currentGallery[currentGalleryIndex];
  portfolioLightboxCounter.textContent = `${currentGalleryIndex + 1} / ${currentGallery.length}`;
}

function openPortfolioLightbox(gallery, startIndex = 0) {
  currentGallery = gallery;
  currentGalleryIndex = startIndex;
  updatePortfolioLightbox();
  portfolioLightbox.classList.add('is-open');
  portfolioLightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePortfolioLightbox() {
  portfolioLightbox.classList.remove('is-open');
  portfolioLightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

function prevPortfolioImage() {
  if (!currentGallery.length) return;
  currentGalleryIndex = (currentGalleryIndex - 1 + currentGallery.length) % currentGallery.length;
  updatePortfolioLightbox();
}

function nextPortfolioImage() {
  if (!currentGallery.length) return;
  currentGalleryIndex = (currentGalleryIndex + 1) % currentGallery.length;
  updatePortfolioLightbox();
}

portfolioCards.forEach((card) => {
  const button = card.querySelector('.portfolio-open');
  const gallery = JSON.parse(card.dataset.gallery || '[]');

  if (button && gallery.length) {
    button.addEventListener('click', (event) => {
      event.stopPropagation();
      openPortfolioLightbox(gallery, 0);
    });
  }

  if (gallery.length) {
    card.addEventListener('click', (event) => {
      if (event.target.closest('.portfolio-open')) return;
      openPortfolioLightbox(gallery, 0);
    });
  }
});

if (portfolioLightboxClose) {
  portfolioLightboxClose.addEventListener('click', closePortfolioLightbox);
}

if (portfolioLightboxBackdrop) {
  portfolioLightboxBackdrop.addEventListener('click', closePortfolioLightbox);
}

if (portfolioLightboxPrev) {
  portfolioLightboxPrev.addEventListener('click', prevPortfolioImage);
}

if (portfolioLightboxNext) {
  portfolioLightboxNext.addEventListener('click', nextPortfolioImage);
}

document.addEventListener('keydown', (event) => {
  if (!portfolioLightbox || !portfolioLightbox.classList.contains('is-open')) return;

  if (event.key === 'Escape') closePortfolioLightbox();
  if (event.key === 'ArrowLeft') prevPortfolioImage();
  if (event.key === 'ArrowRight') nextPortfolioImage();
});

const cookieBanner = document.getElementById("cookie-banner");
const acceptBtn = document.getElementById("cookie-accept");
const rejectBtn = document.getElementById("cookie-reject");

function setCookieConsent(value) {
  localStorage.setItem("cookieConsent", value);
}

function getCookieConsent() {
  return localStorage.getItem("cookieConsent");
}

function updateWhatsappOffset() {
  const floatingWhatsapp = document.querySelector(".floating-whatsapp");

  if (!floatingWhatsapp) return;

  if (cookieBanner && cookieBanner.style.display === "block") {
    const extraSpace = window.innerWidth <= 760 ? 12 : 16;
    const offset = cookieBanner.offsetHeight + extraSpace;
    document.documentElement.style.setProperty("--cookie-offset", `${offset}px`);
  } else {
    document.documentElement.style.setProperty("--cookie-offset", "0px");
  }
}

function hideCookieBanner() {
  if (cookieBanner) {
    cookieBanner.style.display = "none";
  }

  updateWhatsappOffset();
}

function showCookieBanner() {
  if (cookieBanner) {
    cookieBanner.style.display = "block";
  }

  updateWhatsappOffset();
}

function loadAnalytics() {
  if (window.__gaLoaded) return;
  window.__gaLoaded = true;

  const script = document.createElement("script");
  script.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX";
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", "G-XXXXXXXXXX");
}

if (!getCookieConsent()) {
  showCookieBanner();
}

if (acceptBtn) {
  acceptBtn.addEventListener("click", () => {
    setCookieConsent("accepted");
    hideCookieBanner();
    loadAnalytics();
  });
}

if (rejectBtn) {
  rejectBtn.addEventListener("click", () => {
    setCookieConsent("rejected");
    hideCookieBanner();
  });
}

if (getCookieConsent() === "accepted") {
  loadAnalytics();
}

window.addEventListener("resize", updateWhatsappOffset);
window.addEventListener("load", updateWhatsappOffset);