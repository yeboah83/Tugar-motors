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
    carId = "nissan-z9-2026";
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
  const galleryViewport = document.getElementById("gallery-main-viewport");
  const previousButton = document.getElementById("gallery-previous");
  const nextButton = document.getElementById("gallery-next");
  const galleryCounter = document.getElementById("gallery-counter");
  
  // Main slider = exterior gallery + real interior photos
  const interiorPhotos = Array.isArray(car.interiorGallery) ? car.interiorGallery : [];
  const allPhotos = [...(car.gallery || []), ...interiorPhotos];
  const photoSrc = (path) => encodeURI(path); // local folders contain spaces / brackets
  let jumpToPhoto = null;

  if (mainImg && allPhotos.length > 0) {
    let currentImageIndex = 0;
    let pointerStart = null;

    const showImage = (index) => {
      currentImageIndex = (index + allPhotos.length) % allPhotos.length;
      mainImg.style.opacity = "0.4";
      setTimeout(() => {
        mainImg.src = photoSrc(allPhotos[currentImageIndex]);
        mainImg.alt = `${car.name} photo ${currentImageIndex + 1} of ${allPhotos.length}`;
        mainImg.style.opacity = "1";
        if (galleryCounter) {
          galleryCounter.textContent = `${currentImageIndex + 1} / ${allPhotos.length}`;
        }
      }, 150);
    };
    jumpToPhoto = showImage;

    mainImg.src = photoSrc(allPhotos[0]);
    mainImg.alt = `${car.name} photo 1 of ${allPhotos.length}`;
    if (galleryCounter) {
      galleryCounter.textContent = `1 / ${allPhotos.length}`;
    }

    if (previousButton) {
      previousButton.addEventListener("click", () => showImage(currentImageIndex - 1));
    }
    if (nextButton) {
      nextButton.addEventListener("click", () => showImage(currentImageIndex + 1));
    }

    if (galleryViewport) {
      galleryViewport.addEventListener("pointerdown", (event) => {
        pointerStart = { x: event.clientX, y: event.clientY };
      });

      galleryViewport.addEventListener("pointerup", (event) => {
        if (!pointerStart) return;
        const deltaX = event.clientX - pointerStart.x;
        const deltaY = event.clientY - pointerStart.y;
        pointerStart = null;

        if (Math.abs(deltaX) < 40 || Math.abs(deltaX) <= Math.abs(deltaY)) return;
        showImage(currentImageIndex + (deltaX < 0 ? 1 : -1));
      });

      galleryViewport.addEventListener("pointercancel", () => {
        pointerStart = null;
      });

      galleryViewport.addEventListener("keydown", (event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          showImage(currentImageIndex - 1);
        } else if (event.key === "ArrowRight") {
          event.preventDefault();
          showImage(currentImageIndex + 1);
        }
      });
    }
  }

  // 4b. Real Interior Photos section
  const interiorSection = document.getElementById("detail-interior-section");
  const interiorGrid = document.getElementById("detail-interior-grid");
  if (interiorSection && interiorGrid) {
    if (interiorPhotos.length === 0) {
      interiorSection.classList.add("d-none");
    } else {
      interiorSection.classList.remove("d-none");
      const countBadge = document.getElementById("detail-interior-count");
      if (countBadge) countBadge.textContent = `${interiorPhotos.length} Photos`;
      const exteriorCount = (car.gallery || []).length;

      interiorGrid.innerHTML = interiorPhotos.map((path, i) => `
        <div class="col-6 col-md-4">
          <button type="button" class="interior-thumb" data-photo-index="${exteriorCount + i}" aria-label="View ${car.model} interior photo ${i + 1} in the main gallery">
            <img src="${photoSrc(path)}" alt="${car.model} interior photo ${i + 1}" loading="lazy">
            <span class="interior-thumb-zoom"><i class="bi bi-arrows-fullscreen"></i></span>
          </button>
        </div>
      `).join("");

      interiorGrid.querySelectorAll(".interior-thumb").forEach(btn => {
        btn.addEventListener("click", () => {
          if (!jumpToPhoto) return;
          jumpToPhoto(parseInt(btn.getAttribute("data-photo-index"), 10));
          const viewport = document.getElementById("gallery-main-viewport");
          if (viewport) viewport.scrollIntoView({ behavior: "smooth", block: "center" });
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
