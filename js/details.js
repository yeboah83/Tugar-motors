/**
 * Tugar Motors - Vehicle Details Controller
 * Affiliated with Bowin Dawin Motors
 * Location: Tema Community 4, Roundabouts, Ghana
 * Handles interactive gallery, spec tables, dynamic WhatsApp pre-fill, and test drive scheduler
 */

document.addEventListener("DOMContentLoaded", () => {
  initCarDetailsPage();
});

function initCarDetailsPage() {
  const urlParams = new URLSearchParams(window.location.search);
  let carId = urlParams.get("id");

  // Default to flagship Z9 if no param or not found
  if (!carId) {
    carId = "nissan-z9-2025";
  }

  let car = findCarById(carId);
  if (!car) {
    car = TUGAR_CARS[0];
  }

  window.currentLoadedCar = car;

  // 1. Page Title & Meta
  document.title = `${car.name} | Tugar Motors - Beyond the Drive`;

  // 2. Breadcrumb & Basic Info
  const carTitleElem = document.getElementById("detail-car-title");
  const carTaglineElem = document.getElementById("detail-car-tagline");
  const carStatusBadge = document.getElementById("detail-car-status");
  const carConditionBadge = document.getElementById("detail-car-condition");
  const carBreadcrumb = document.getElementById("detail-breadcrumb-name");

  if (carTitleElem) carTitleElem.textContent = car.name;
  if (carTaglineElem) carTaglineElem.textContent = car.tagline;
  if (carBreadcrumb) carBreadcrumb.textContent = car.name;

  if (carStatusBadge) {
    carStatusBadge.textContent = car.status;
    let badgeClass = "badge-in-stock";
    if (car.status === "Incoming") badgeClass = "badge-incoming";
    if (car.status === "Reserved") badgeClass = "badge-reserved";
    carStatusBadge.className = `badge-status ${badgeClass}`;
  }

  if (carConditionBadge) {
    carConditionBadge.textContent = car.condition;
  }

  // 3. Quick Specs Badges
  const specYear = document.getElementById("spec-quick-year");
  const specMileage = document.getElementById("spec-quick-mileage");
  const specTrans = document.getElementById("spec-quick-trans");
  const specFuel = document.getElementById("spec-quick-fuel");
  const specDrive = document.getElementById("spec-quick-drive");

  if (specYear) specYear.textContent = car.year;
  if (specMileage) specMileage.textContent = car.mileage;
  if (specTrans) specTrans.textContent = car.transmission;
  if (specFuel) specFuel.textContent = car.fuelType;
  if (specDrive) specDrive.textContent = car.drivetrain;

  // 4. Interactive Gallery
  const mainImg = document.getElementById("gallery-main-img");
  const thumbsContainer = document.getElementById("gallery-thumbs-container");
  
  if (mainImg && car.gallery && car.gallery.length > 0) {
    mainImg.src = car.gallery[0];
    mainImg.alt = car.name;

    if (thumbsContainer) {
      thumbsContainer.innerHTML = car.gallery.map((imgSrc, index) => `
        <div class="gallery-thumb ${index === 0 ? 'active' : ''}" data-index="${index}">
          <img src="${imgSrc}" alt="${car.name} thumb ${index + 1}">
        </div>
      `).join("");

      const thumbs = thumbsContainer.querySelectorAll(".gallery-thumb");
      thumbs.forEach(thumb => {
        thumb.addEventListener("click", () => {
          const idx = parseInt(thumb.getAttribute("data-index"));
          thumbs.forEach(t => t.classList.remove("active"));
          thumb.classList.add("active");
          mainImg.style.opacity = "0.4";
          setTimeout(() => {
            mainImg.src = car.gallery[idx];
            mainImg.style.opacity = "1";
          }, 150);
        });
      });
    }
  }

  // 5. Description & Verified Inspection Note
  const descElem = document.getElementById("detail-description");
  if (descElem) {
    descElem.textContent = car.description;
  }

  // 6. Detailed Specs Table
  const specsTableBody = document.getElementById("detail-specs-table-body");
  if (specsTableBody && car.specs) {
    specsTableBody.innerHTML = Object.entries(car.specs).map(([key, val]) => `
      <tr>
        <td class="spec-name"><i class="bi bi-check2-circle text-primary me-2"></i>${key}</td>
        <td class="spec-val">${val}</td>
      </tr>
    `).join("");
  }

  // 7. Key Features Checklist
  const featuresList = document.getElementById("detail-features-list");
  if (featuresList && car.features) {
    featuresList.innerHTML = car.features.map(feat => `
      <div class="col-md-6 mb-2">
        <div class="d-flex align-items-center gap-2 p-2 rounded bg-light border">
          <i class="bi bi-shield-check text-primary fs-5"></i>
          <span class="fw-semibold small">${feat}</span>
        </div>
      </div>
    `).join("");
  }

  // 8. CTAs: Direct WhatsApp & Call & Viewing Modal
  const btnWhatsApp = document.getElementById("detail-btn-whatsapp");
  if (btnWhatsApp) {
    btnWhatsApp.href = getWhatsAppCarLink(car, "inquiring");
  }

  const viewingModalCarInput = document.getElementById("viewing-modal-car-name");
  if (viewingModalCarInput) {
    viewingModalCarInput.value = `${car.year} ${car.name}`;
  }

  // 9. Other Nissan Models in Showroom
  const similarContainer = document.getElementById("similar-cars-container");
  if (similarContainer) {
    const otherCars = TUGAR_CARS.filter(c => c.id !== car.id);
    similarContainer.innerHTML = otherCars.map(c => createCarCardHTML(c)).join("");
  }
}
