/**
 * Tugar Motors - Core Interactive JavaScript
 * Affiliated with Bowin Dawin Motors
 * Location: Tema Community 4, Roundabouts, Ghana
 * Phone: 0243399697 | WhatsApp: 0535978264
 * Email: otoosamuel605@gmail.com
 */

document.addEventListener("DOMContentLoaded", () => {
  initNavbar();
  initHomeFeaturedCars();
  initInventoryPage();
  initModalsAndForms();
});

/* ==========================================================================
   1. NAVBAR & SCROLL EFFECTS
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector(".tm-navbar");
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
  }
}

/* ==========================================================================
   2. RENDER CAR CARDS HELPER (NO PRICE TAG)
   ========================================================================== */
function createCarCardHTML(car) {
  let badgeClass = "badge-in-stock";
  if (car.status === "Incoming") badgeClass = "badge-incoming";
  if (car.status === "Reserved") badgeClass = "badge-reserved";

  const waLink = getWhatsAppCarLink(car, "inquiring");

  return `
    <div class="col-lg-6 col-md-6 mb-4" data-car-id="${car.id}">
      <div class="car-card">
        <div class="car-card-img-wrap">
          <span class="badge-status ${badgeClass} car-card-badge-top">${car.status}</span>
          <span class="car-card-condition-badge"><i class="bi bi-patch-check-fill text-warning me-1"></i>${car.condition}</span>
          <a href="car-details.html?id=${car.id}" class="w-100 h-100 d-block">
            <img src="${car.image}" alt="${car.name}" class="car-card-img" loading="lazy">
          </a>
        </div>
        <div class="car-card-body">
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-25 px-2.5 py-1 fw-bold" style="font-size: 0.74rem;">${car.make} &bull; ${car.year}</span>
            <span class="badge bg-light text-dark border px-2.5 py-1 fw-bold" style="font-size: 0.74rem;">${car.bodyType}</span>
          </div>
          <h3 class="car-card-title">
            <a href="car-details.html?id=${car.id}">${car.name}</a>
          </h3>
          <p class="car-card-tagline">${car.tagline}</p>
          
          <div class="car-specs-grid">
            <div class="car-spec-item" title="Condition">
              <i class="bi bi-patch-check-fill text-success"></i>
              <span>${car.condition}</span>
            </div>
            <div class="car-spec-item" title="Transmission">
              <i class="bi bi-gear-wide-connected text-primary"></i>
              <span>${car.transmission.split(' ')[0]}</span>
            </div>
            <div class="car-spec-item" title="Fuel Type">
              <i class="bi bi-fuel-pump-fill text-warning"></i>
              <span>${car.fuelType.split(' ')[0]}</span>
            </div>
            <div class="car-spec-item" title="Drivetrain">
              <i class="bi bi-shield-check text-info"></i>
              <span>${car.drivetrain.split(' ')[0]}</span>
            </div>
          </div>

          <div class="car-card-footer">
            <div class="d-flex align-items-center">
              <span class="badge bg-success bg-opacity-15 text-success border border-success border-opacity-30 px-2.5 py-1.5 fw-bold" style="font-size: 0.78rem;">
                <i class="bi bi-check-circle-fill me-1"></i>Official Brand New
              </span>
            </div>
            <div class="d-flex gap-2">
              <a href="${waLink}" target="_blank" class="btn btn-sm btn-outline-success p-2 rounded-circle shadow-sm" title="Chat on WhatsApp about this car" style="width: 38px; height: 38px; display: flex; align-items: center; justify-content: center;">
                <i class="bi bi-whatsapp"></i>
              </a>
              <a href="car-details.html?id=${car.id}" class="btn btn-sm btn-tm-primary px-3 fw-bold">
                View Specs <i class="bi bi-arrow-right ms-1"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ==========================================================================
   3. HOME PAGE FEATURED CARS
   ========================================================================== */
function initHomeFeaturedCars() {
  const container = document.getElementById("featured-cars-container");
  if (!container) return;

  const featured = TUGAR_CARS.filter(c => c.featured);
  container.innerHTML = featured.map(car => createCarCardHTML(car)).join("");
}

/* ==========================================================================
   4. INVENTORY PAGE SEARCH & FILTER SYSTEM
   ========================================================================== */
function initInventoryPage() {
  const inventoryContainer = document.getElementById("inventory-grid");
  if (!inventoryContainer) return;

  const searchInput = document.getElementById("inventory-search");
  const modelFilter = document.getElementById("filter-model");
  const bodyFilter = document.getElementById("filter-body");
  const fuelFilter = document.getElementById("filter-fuel");
  const sortSelect = document.getElementById("inventory-sort");
  const countBadge = document.getElementById("inventory-count");
  const resetBtn = document.getElementById("filter-reset-btn");
  const chipContainer = document.getElementById("filter-chips-wrapper");

  // Check URL params for pre-filter (e.g. from home search)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("model") && modelFilter) modelFilter.value = urlParams.get("model");
  if (urlParams.get("body") && bodyFilter) bodyFilter.value = urlParams.get("body");
  if (urlParams.get("fuel") && fuelFilter) fuelFilter.value = urlParams.get("fuel");
  if (urlParams.get("search") && searchInput) searchInput.value = urlParams.get("search");

  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const selectedModel = modelFilter ? modelFilter.value : "all";
    const selectedBody = bodyFilter ? bodyFilter.value : "all";
    const selectedFuel = fuelFilter ? fuelFilter.value : "all";
    const selectedSort = sortSelect ? sortSelect.value : "featured";

    let filtered = TUGAR_CARS.filter(car => {
      // Search
      if (query) {
        const fullText = `${car.name} ${car.make} ${car.model} ${car.year} ${car.tagline} ${car.fuelType} ${car.engine}`.toLowerCase();
        if (!fullText.includes(query)) return false;
      }
      // Model
      if (selectedModel !== "all" && !car.model.toLowerCase().includes(selectedModel.toLowerCase())) {
        return false;
      }
      // Body
      if (selectedBody !== "all" && car.bodyType.toLowerCase() !== selectedBody.toLowerCase()) {
        return false;
      }
      // Fuel
      if (selectedFuel !== "all" && !car.fuelType.toLowerCase().includes(selectedFuel.toLowerCase())) {
        return false;
      }
      return true;
    });

    // Sorting
    if (selectedSort === "name-asc") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (selectedSort === "year-new") {
      filtered.sort((a, b) => b.year - a.year);
    } else {
      // Featured / default
      filtered.sort((a, b) => (b.featured === true ? 1 : 0) - (a.featured === true ? 1 : 0));
    }

    // Render Count
    if (countBadge) {
      countBadge.textContent = `${filtered.length} Brand New Nissan Vehicles Available`;
    }

    // Render Cards
    if (filtered.length === 0) {
      inventoryContainer.innerHTML = `
        <div class="col-12 py-5 text-center">
          <div class="p-5 bg-white rounded-4 border">
            <i class="bi bi-car-front text-muted" style="font-size: 3.5rem;"></i>
            <h4 class="mt-3 fw-bold">No Vehicles Match Your Criteria</h4>
            <p class="text-muted">We stock the official brand new Zhengzhou Nissan lineup: Z9, Rich 6, Rich 7, and Paladin.</p>
            <button class="btn btn-tm-primary mt-2" onclick="document.getElementById('filter-reset-btn').click()">
              Reset All Filters
            </button>
            <a href="${getWhatsAppGeneralLink('Nissan Vehicle Inquiry')}" target="_blank" class="btn btn-tm-whatsapp mt-2 ms-2">
              <i class="bi bi-whatsapp"></i> Chat with Samuel on WhatsApp
            </a>
          </div>
        </div>
      `;
    } else {
      inventoryContainer.innerHTML = filtered.map(car => createCarCardHTML(car)).join("");
    }
  }

  // Attach event listeners
  if (searchInput) searchInput.addEventListener("input", applyFilters);
  if (modelFilter) modelFilter.addEventListener("change", applyFilters);
  if (bodyFilter) bodyFilter.addEventListener("change", applyFilters);
  if (fuelFilter) fuelFilter.addEventListener("change", applyFilters);
  if (sortSelect) sortSelect.addEventListener("change", applyFilters);

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (modelFilter) modelFilter.value = "all";
      if (bodyFilter) bodyFilter.value = "all";
      if (fuelFilter) fuelFilter.value = "all";
      if (sortSelect) sortSelect.value = "featured";
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      applyFilters();
    });
  }

  // Quick category chips
  if (chipContainer) {
    chipContainer.querySelectorAll(".filter-chip").forEach(chip => {
      chip.addEventListener("click", () => {
        const filterType = chip.getAttribute("data-filter-type");
        const filterValue = chip.getAttribute("data-filter-value");

        chipContainer.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
        chip.classList.add("active");

        if (filterType === "all") {
          if (modelFilter) modelFilter.value = "all";
          if (bodyFilter) bodyFilter.value = "all";
        } else if (filterType === "model" && modelFilter) {
          modelFilter.value = filterValue;
        } else if (filterType === "body" && bodyFilter) {
          bodyFilter.value = filterValue;
        }
        applyFilters();
      });
    });
  }

  // Initial render
  applyFilters();
}

/* ==========================================================================
   5. MODALS, VIEWING APPOINTMENTS & ENQUIRY FORMS
   ========================================================================== */
function initModalsAndForms() {
  const forms = document.querySelectorAll(".tugar-enquiry-form");
  forms.forEach(form => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = form.querySelector("[name='client_name']") ? form.querySelector("[name='client_name']").value : "Client";
      const phone = form.querySelector("[name='client_phone']") ? form.querySelector("[name='client_phone']").value : "";
      const vehicle = form.querySelector("[name='car_model']") ? form.querySelector("[name='car_model']").value : "General Inquiry";

      const submitBtn = form.querySelector("button[type='submit']");
      const originalBtnText = submitBtn ? submitBtn.innerHTML : "Submit";
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Submitting...`;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = `<i class="bi bi-check-circle-fill me-2 text-white"></i> Enquiry Sent!`;
        }

        const successBox = document.createElement("div");
        successBox.className = "alert alert-success mt-3 alert-dismissible fade show shadow-sm";
        successBox.innerHTML = `
          <strong>Thank you, ${name}!</strong> Your request regarding the Brand New <strong>${vehicle}</strong> has been logged.
          Our team at Tema Community 4 (in partnership with Bowin Dawin Motors) will contact you at <strong>${phone}</strong> shortly.
          <hr>
          <p class="mb-0 small">Want instant confirmation? 
            <a href="${getWhatsAppGeneralLink(`Inquiry from ${name} about ${vehicle}`)}" target="_blank" class="fw-bold text-success text-decoration-underline">
              <i class="bi bi-whatsapp"></i> Chat directly with Samuel on WhatsApp (0535978264)
            </a>
          </p>
          <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        form.parentNode.insertBefore(successBox, form.nextSibling);

        form.reset();

        setTimeout(() => {
          if (submitBtn) submitBtn.innerHTML = originalBtnText;
        }, 5000);
      }, 700);
    });
  });
}
