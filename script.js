// Set this to the email address that should receive new inquiries.
const BUSINESS_EMAIL = "your-email@example.com";

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
const contactForm = document.querySelector("#contact-form");
const formNote = document.querySelector("#form-note");
const serviceCards = [...document.querySelectorAll(".marketplace-service-card")];
const filterButtons = [...document.querySelectorAll(".filter-chip")];
const searchResults = document.querySelector("#search-results");
const noResults = document.querySelector("#no-results");

document.querySelector("#year").textContent = new Date().getFullYear();

function filterServices(query = "", category = "all") {
  const normalizedQuery = query
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\bcafes\b/g, "cafe");
  const ignoredWords = new Set(["the", "and", "for", "my", "a", "an", "to", "with", "me"]);
  const terms = normalizedQuery.split(/\s+/).filter((term) => term.length > 1 && !ignoredWords.has(term));
  let visibleCount = 0;

  serviceCards.forEach((card) => {
    const searchableText = `${card.dataset.search} ${card.textContent}`.toLowerCase();
    const matchesCategory = category === "all" || card.dataset.category.split(" ").includes(category);
    const matchesQuery = terms.every((term) => searchableText.includes(term));
    const isVisible = matchesCategory && matchesQuery;
    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  noResults.hidden = visibleCount > 0;
  searchResults.textContent = query
    ? `${visibleCount} ${visibleCount === 1 ? "match" : "matches"} for “${query.trim()}”`
    : "";
}

function submitServiceSearch(query) {
  const services = document.querySelector("#services");
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === "all";
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  filterServices(query);
  services.scrollIntoView({ behavior: "smooth", block: "start" });
}

document.querySelector("#service-search").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.querySelector("#service-query").value.trim();
  document.querySelector("#hero-query").value = query;
  submitServiceSearch(query);
});

document.querySelector("#hero-search").addEventListener("submit", (event) => {
  event.preventDefault();
  const query = document.querySelector("#hero-query").value.trim();
  document.querySelector("#service-query").value = query;
  submitServiceSearch(query);
});

document.querySelectorAll("[data-search-term]").forEach((button) => {
  button.addEventListener("click", () => {
    const query = button.dataset.searchTerm;
    document.querySelector("#hero-query").value = query;
    document.querySelector("#service-query").value = query;
    submitServiceSearch(query);
  });
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    document.querySelector("#hero-query").value = "";
    document.querySelector("#service-query").value = "";
    filterServices("", button.dataset.filter);
  });
});

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  siteNav.classList.toggle("is-open", !isExpanded);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    siteNav.classList.remove("is-open");
  });
});

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  if (BUSINESS_EMAIL === "your-email@example.com") {
    formNote.textContent = "Before publishing, open script.js and replace the example address with your business email.";
    return;
  }

  const formData = new FormData(contactForm);
  const subject = `Content shoot inquiry from ${formData.get("business")}`;
  const body = [
    `Name: ${formData.get("name")}`,
    `Business: ${formData.get("business")}`,
    `Email: ${formData.get("email")}`,
    "",
    "What they'd like to create:",
    formData.get("message"),
  ].join("\n");

  window.location.href = `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
