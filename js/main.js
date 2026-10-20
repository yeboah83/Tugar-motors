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
  if (car.status === "Order on Request") badgeClass = "badge-order";

  const waLink = getWhatsAppCarLink(car, "inquiring");
  const hasImage = Boolean(car.image && car.image.trim());

  let imageHTML = "";
  if (hasImage) {
    imageHTML = `
      <a href="car-details.html?id=${car.id}" class="w-100 h-100 d-block">
        <img src="${car.image}" alt="${car.name}" class="car-card-img" loading="lazy">
      </a>
    `;
  } else {
    // Elegant branded vector card banner with NO car image
    const isByd = car.make.toUpperCase() === "BYD";
    const brandGradient = isByd
      ? "linear-gradient(135deg, #06182E 0%, #0D3B66 50%, #1565C0 100%)"
      : "linear-gradient(135deg, #1C1917 0%, #292524 50%, #44403C 100%)";
    const brandIcon = isByd ? "bi-lightning-charge-fill text-warning" : "bi-compass-fill text-warning";
    const brandBadgeText = isByd ? "BYD Innovation" : "Jetour Adventure";

    imageHTML = `
      <a href="car-details.html?id=${car.id}" class="car-card-no-img" style="background: ${brandGradient};">
        <span class="badge bg-white bg-opacity-15 text-white mb-2 px-2.5 py-1 border border-white border-opacity-20 small">
          ${brandBadgeText} &bull; Brand New
        </span>
        <div class="car-card-no-img-brand">${car.make}</div>
        <div class="car-card-no-img-icon"><i class="bi ${brandIcon}"></i></div>
        <div class="car-card-no-img-model">${car.model}</div>
        <span class="badge bg-light bg-opacity-20 text-white border border-white border-opacity-25 small mt-1">
          <i class="bi bi-file-earmark-text me-1"></i>Official Specifications
        </span>
      </a>
    `;
  }

  return `
    <div class="col-lg-6 col-md-6 mb-4" data-car-id="${car.id}">
      <div class="car-card">
        <div class="car-card-img-wrap">
          <span class="badge-status ${badgeClass} car-card-badge-top">${car.status}</span>
          <span class="car-card-condition-badge"><i class="bi bi-patch-check-fill text-warning me-1"></i>${car.condition}</span>
          ${imageHTML}
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
  const brandFilter = document.getElementById("filter-brand");
  const modelFilter = document.getElementById("filter-model");
  const bodyFilter = document.getElementById("filter-body");
  const fuelFilter = document.getElementById("filter-fuel");
  const sortSelect = document.getElementById("inventory-sort");
  const countBadge = document.getElementById("inventory-count");
  const resetBtn = document.getElementById("filter-reset-btn");
  const chipContainer = document.getElementById("filter-chips-wrapper");

  // Check URL params for pre-filter (e.g. from home search)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("brand") && brandFilter) brandFilter.value = urlParams.get("brand");
  if (urlParams.get("model") && modelFilter) modelFilter.value = urlParams.get("model");
  if (urlParams.get("body") && bodyFilter) bodyFilter.value = urlParams.get("body");
  if (urlParams.get("fuel") && fuelFilter) fuelFilter.value = urlParams.get("fuel");
  if (urlParams.get("search") && searchInput) searchInput.value = urlParams.get("search");

  // Sync active chip if pre-filtered
  if (chipContainer) {
    if (urlParams.get("brand")) {
      const target = chipContainer.querySelector(`.filter-chip[data-filter-type="brand"][data-filter-value="${urlParams.get("brand")}"]`);
      if (target) {
        chipContainer.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
        target.classList.add("active");
      }
    } else if (urlParams.get("body")) {
      const target = chipContainer.querySelector(`.filter-chip[data-filter-type="body"][data-filter-value="${urlParams.get("body")}"]`);
      if (target) {
        chipContainer.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
        target.classList.add("active");
      }
    } else if (urlParams.get("fuel")) {
      const target = chipContainer.querySelector(`.filter-chip[data-filter-type="fuel"][data-filter-value="${urlParams.get("fuel")}"]`);
      if (target) {
        chipContainer.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
        target.classList.add("active");
      }
    }
  }

  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : "";
    const selectedBrand = brandFilter ? brandFilter.value : "all";
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
      // Brand
      if (selectedBrand !== "all" && car.make.toLowerCase() !== selectedBrand.toLowerCase()) {
        return false;
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
      countBadge.textContent = `${filtered.length} Brand New Vehicles Available`;
    }

    // Render Cards
    if (filtered.length === 0) {
      inventoryContainer.innerHTML = `
        <div class="col-12 py-5 text-center">
          <div class="p-5 bg-white rounded-4 border">
            <i class="bi bi-car-front text-muted" style="font-size: 3.5rem;"></i>
            <h4 class="mt-3 fw-bold">No Vehicles Match Your Criteria</h4>
            <p class="text-muted">We offer Brand New Zhengzhou Nissan, BYD, and Jetour vehicles.</p>
            <button class="btn btn-tm-primary mt-2" onclick="document.getElementById('filter-reset-btn').click()">
              Reset All Filters
            </button>
            <a href="${getWhatsAppGeneralLink('Vehicle Catalog Inquiry')}" target="_blank" class="btn btn-tm-whatsapp mt-2 ms-2">
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
  if (brandFilter) brandFilter.addEventListener("change", applyFilters);
  if (modelFilter) modelFilter.addEventListener("change", applyFilters);
  if (bodyFilter) bodyFilter.addEventListener("change", applyFilters);
  if (fuelFilter) fuelFilter.addEventListener("change", applyFilters);
  if (sortSelect) sortSelect.addEventListener("change", applyFilters);

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (searchInput) searchInput.value = "";
      if (brandFilter) brandFilter.value = "all";
      if (modelFilter) modelFilter.value = "all";
      if (bodyFilter) bodyFilter.value = "all";
      if (fuelFilter) fuelFilter.value = "all";
      if (sortSelect) sortSelect.value = "featured";
      document.querySelectorAll(".filter-chip").forEach(c => c.classList.remove("active"));
      const allChip = document.querySelector('.filter-chip[data-filter-type="all"]');
      if (allChip) allChip.classList.add("active");
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
          if (brandFilter) brandFilter.value = "all";
          if (modelFilter) modelFilter.value = "all";
          if (bodyFilter) bodyFilter.value = "all";
          if (fuelFilter) fuelFilter.value = "all";
        } else if (filterType === "brand" && brandFilter) {
          brandFilter.value = filterValue;
          if (modelFilter) modelFilter.value = "all";
        } else if (filterType === "model" && modelFilter) {
          modelFilter.value = filterValue;
        } else if (filterType === "body" && bodyFilter) {
          bodyFilter.value = filterValue;
        } else if (filterType === "fuel" && fuelFilter) {
          fuelFilter.value = filterValue;
        }
        applyFilters();
      });
    });
  }

  // Initial render
  applyFilters();
}

/* ==========================================================================
   5. MODALS, VIEWING APPOINTMENTS & ENQUIRY FORMS -> WHATSAPP
   Every booking / enquiry form is sent straight to the showroom WhatsApp
   (0535978264) as a pre-filled, formatted message.
   ========================================================================== */
const TUGAR_WHATSAPP_NUMBER = "233535978264";

function tmFieldValue(form, name) {
  const el = form.querySelector(`[name='${name}']`);
  return el && el.value ? el.value.trim() : "";
}

function tmFormatDate(value) {
  if (!value) return "";
  const d = new Date(`${value}T00:00:00`);
  if (isNaN(d)) return value;
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function buildBookingWhatsAppMessage(form) {
  const name = tmFieldValue(form, "client_name");
  const phone = tmFieldValue(form, "client_phone");
  const email = tmFieldValue(form, "client_email");
  const inquiryType = tmFieldValue(form, "inquiry_type");
  const vehicle = tmFieldValue(form, "car_model");
  const date = tmFormatDate(tmFieldValue(form, "preferred_date"));
  const time = tmFieldValue(form, "preferred_time");
  const message = tmFieldValue(form, "client_message");

  const isAppointment = !!(date || time || form.closest("#requestViewingModal") || !inquiryType);
  const title = isAppointment ? "NEW SHOWROOM APPOINTMENT REQUEST" : "NEW WEBSITE ENQUIRY";

  const lines = [
    `*${title}*`,
    "Tugar Motors - Tema Community 4",
    "",
  ];
  if (name) lines.push(`*Name:* ${name}`);
  if (phone) lines.push(`*Phone:* ${phone}`);
  if (email) lines.push(`*Email:* ${email}`);
  if (inquiryType) lines.push(`*Enquiry Type:* ${inquiryType}`);
  if (vehicle) lines.push(`*Vehicle:* Brand New ${vehicle}`);
  if (date) lines.push(`*Preferred Date:* ${date}`);
  if (time) lines.push(`*Preferred Time:* ${time}`);
  if (message) lines.push(`*Notes:* ${message}`);
  lines.push("", `_Sent from the Tugar Motors website (${document.title.split("|")[0].trim()})_`);

  return lines.join("\n");
}

function initModalsAndForms() {
  // Prevent booking dates in the past
  const today = new Date();
  const isoToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];
  document.querySelectorAll("input[type='date'][name='preferred_date']").forEach(input => {
    input.min = isoToday;
  });

  const forms = document.querySelectorAll(".tugar-enquiry-form");
  forms.forEach(form => {
    // Small hint so clients know the booking opens WhatsApp
    const submitBtn = form.querySelector("button[type='submit']");
    if (submitBtn && !form.querySelector(".tm-wa-hint")) {
      const hint = document.createElement("div");
      hint.className = "tm-wa-hint small mt-2 mb-0 text-center";
      hint.style.opacity = "0.8";
      hint.innerHTML = `<i class="bi bi-whatsapp text-success me-1"></i> Your details will be sent directly to our WhatsApp (0535978264).`;
      submitBtn.insertAdjacentElement("afterend", hint);
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const esc = s => s.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
      const name = esc(tmFieldValue(form, "client_name") || "Client");
      const vehicle = esc(tmFieldValue(form, "car_model") || "Nissan vehicle");
      const waUrl = `https://wa.me/${TUGAR_WHATSAPP_NUMBER}?text=${encodeURIComponent(buildBookingWhatsAppMessage(form))}`;

      // Open WhatsApp synchronously (inside the click) so pop-up blockers allow it
      const win = window.open(waUrl, "_blank");
      if (!win) window.location.href = waUrl;

      const originalBtnText = submitBtn ? submitBtn.innerHTML : "";
      if (submitBtn) {
        submitBtn.innerHTML = `<i class="bi bi-check-circle-fill me-2 text-white"></i> Opening WhatsApp...`;
      }

      form.parentNode.querySelectorAll(".tm-wa-success").forEach(el => el.remove());
      const successBox = document.createElement("div");
      successBox.className = "alert alert-success mt-3 alert-dismissible fade show shadow-sm tm-wa-success";
      successBox.innerHTML = `
        <strong>Thank you, ${name}!</strong> Your request for the Brand New <strong>${vehicle}</strong> has been prepared in WhatsApp.
        Please tap <strong>Send</strong> in WhatsApp to deliver it to our showroom team.
        <hr>
        <p class="mb-0 small">WhatsApp didn't open?
          <a href="${waUrl}" target="_blank" class="fw-bold text-success text-decoration-underline">
            <i class="bi bi-whatsapp"></i> Click here to send your booking (0535978264)
          </a>
        </p>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      `;
      form.parentNode.insertBefore(successBox, form.nextSibling);

      // Reset the form but keep read-only fields (e.g. vehicle name in the modal)
      const keep = Array.from(form.querySelectorAll("[readonly]")).map(el => [el, el.value]);
      form.reset();
      keep.forEach(([el, val]) => { el.value = val; });

      setTimeout(() => {
        if (submitBtn) submitBtn.innerHTML = originalBtnText;
      }, 4000);
    });
  });
}
