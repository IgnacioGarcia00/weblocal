const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const year = document.getElementById("year");
const revealItems = document.querySelectorAll(".reveal");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

if (year) {
  year.textContent = new Date().getFullYear();
}

function syncHeaderState() {
  document.body.classList.toggle("has-scrolled", window.scrollY > 12);
}

syncHeaderState();
window.addEventListener("scroll", syncHeaderState, { passive: true });

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

if (!prefersReducedMotion.matches && revealItems.length) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.14,
    rootMargin: "0px 0px -6% 0px"
  });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const sectorCards = document.querySelectorAll(".sector-card");

if (!prefersReducedMotion.matches && sectorCards.length > 1) {
  let currentSector = 0;

  window.setInterval(() => {
    sectorCards[currentSector].classList.remove("is-active");
    currentSector = (currentSector + 1) % sectorCards.length;
    sectorCards[currentSector].classList.add("is-active");
  }, 2600);
}

const portfolioCards = document.querySelectorAll(".portfolio-card");
const portfolioLightbox = document.getElementById("portfolioLightbox");
const portfolioLightboxImage = document.getElementById("portfolioLightboxImage");
const portfolioLightboxCounter = document.getElementById("portfolioLightboxCounter");
const portfolioLightboxClose = document.querySelector(".portfolio-lightbox-close");
const portfolioLightboxPrev = document.querySelector(".portfolio-lightbox-prev");
const portfolioLightboxNext = document.querySelector(".portfolio-lightbox-next");
const portfolioLightboxBackdrop = document.querySelector(".portfolio-lightbox-backdrop");

let currentGallery = [];
let currentGalleryIndex = 0;
let currentGalleryAlt = "Captura del proyecto";

function updatePortfolioLightbox() {
  if (!portfolioLightboxImage || !portfolioLightboxCounter || !currentGallery.length) return;

  portfolioLightboxImage.src = currentGallery[currentGalleryIndex];
  portfolioLightboxImage.alt = currentGalleryAlt;
  portfolioLightboxCounter.textContent = `${currentGalleryIndex + 1} / ${currentGallery.length}`;
}

function openPortfolioLightbox(gallery, altText, startIndex = 0) {
  if (!portfolioLightbox || !gallery.length) return;

  currentGallery = gallery;
  currentGalleryIndex = startIndex;
  currentGalleryAlt = altText || "Captura del proyecto";

  updatePortfolioLightbox();
  portfolioLightbox.classList.add("is-open");
  portfolioLightbox.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closePortfolioLightbox() {
  if (!portfolioLightbox) return;

  portfolioLightbox.classList.remove("is-open");
  portfolioLightbox.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
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
  const button = card.querySelector(".portfolio-open");
  const previewImage = card.querySelector("img");
  const gallery = JSON.parse(card.dataset.gallery || "[]");
  const altText = previewImage?.getAttribute("alt") || "Captura del proyecto";

  if (button && gallery.length) {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      openPortfolioLightbox(gallery, altText, 0);
    });
  }

  if (gallery.length) {
    card.addEventListener("click", (event) => {
      if (event.target.closest(".portfolio-open")) return;
      openPortfolioLightbox(gallery, altText, 0);
    });
  }
});

portfolioLightboxClose?.addEventListener("click", closePortfolioLightbox);
portfolioLightboxBackdrop?.addEventListener("click", closePortfolioLightbox);
portfolioLightboxPrev?.addEventListener("click", prevPortfolioImage);
portfolioLightboxNext?.addEventListener("click", nextPortfolioImage);

document.addEventListener("keydown", (event) => {
  if (!portfolioLightbox || !portfolioLightbox.classList.contains("is-open")) return;

  if (event.key === "Escape") closePortfolioLightbox();
  if (event.key === "ArrowLeft") prevPortfolioImage();
  if (event.key === "ArrowRight") nextPortfolioImage();
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

  const analyticsScript = document.createElement("script");
  analyticsScript.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX";
  analyticsScript.async = true;
  document.head.appendChild(analyticsScript);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", "G-XXXXXXXXXX");
}

if (!getCookieConsent()) {
  showCookieBanner();
}

acceptBtn?.addEventListener("click", () => {
  setCookieConsent("accepted");
  hideCookieBanner();
  loadAnalytics();
});

rejectBtn?.addEventListener("click", () => {
  setCookieConsent("rejected");
  hideCookieBanner();
});

if (getCookieConsent() === "accepted") {
  loadAnalytics();
}

window.addEventListener("resize", updateWhatsappOffset);
window.addEventListener("load", updateWhatsappOffset);
