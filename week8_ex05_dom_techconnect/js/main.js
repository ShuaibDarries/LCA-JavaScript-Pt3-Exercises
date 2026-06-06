/**
 * TechConnect Developer Hub - Main JavaScript
 * Vanilla JavaScript, no frameworks
 */

// ============================================
// State Management
// ============================================
const state = {
  developers: [],
  filteredDevelopers: [],
  currentView: "card", // 'card' or 'table'
  searchTerm: "",
};

// ============================================
// DOM Element References
// ============================================
const elements = {
  directoryContainer: document.getElementById("directory-container"),
  searchInput: document.getElementById("search-input"),
  clearSearchBtn: document.getElementById("clear-search"),
  viewCardBtn: document.getElementById("view-card"),
  viewTableBtn: document.getElementById("view-table"),
  developerCount: document.getElementById("developer-count"),
  resultsInfo: document.getElementById("results-info"),
  noResults: document.getElementById("no-results"),
  resetFiltersBtn: document.getElementById("reset-filters"),
  developerForm: document.getElementById("developer-form"),
  addDeveloperCollapse: document.getElementById("add-developer-form"),
};

// ============================================
// Initialize Application
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  loadDevelopers();
  setupEventListeners();
});

// ============================================
// Data Loading
// ============================================
async function loadDevelopers() {
  try {
    const response = await fetch("developers.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    // Normalize data to ensure consistent structure
    state.developers = data.map((dev) => ({
      id: dev.id,
      name: dev.name,
      role: dev.role,
      skills: dev.skills || [],
      avatar: dev.avatar || "https://placehold.co/100x100/6c757d/ffffff",
      availableForHire: dev.availableForHire || false,
      location: dev.location || "Unknown",
      email:
        dev.email ||
        `${dev.name.toLowerCase().replace(/\s+/g, ".")}@techconnect.africa`,
    }));

    state.filteredDevelopers = [...state.developers];
    renderDirectory();
    updateCount();
  } catch (error) {
    console.error("Error loading developers:", error);
    elements.directoryContainer.innerHTML = `
            <div class="alert alert-danger" role="alert">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>
                Failed to load developer data. Please ensure <code>developers.json</code> is in the same directory.
            </div>
        `;
  }
}

// ============================================
// Event Listeners Setup
// ============================================
function setupEventListeners() {
  // Live Search
  elements.searchInput.addEventListener("input", handleSearch);

  // Clear Search
  elements.clearSearchBtn.addEventListener("click", clearSearch);

  // View Toggle
  elements.viewCardBtn.addEventListener("click", () => switchView("card"));
  elements.viewTableBtn.addEventListener("click", () => switchView("table"));

  // Reset Filters (No Results)
  elements.resetFiltersBtn.addEventListener("click", clearSearch);

  // Form Submission
  elements.developerForm.addEventListener("submit", handleFormSubmit);

  // Form Reset
  elements.developerForm.addEventListener("reset", () => {
    elements.developerForm.classList.remove("was-validated");
  });
}

// ============================================
// Search & Filter Functionality
// ============================================
function handleSearch(event) {
  state.searchTerm = event.target.value.toLowerCase().trim();
  filterDevelopers();
}

function clearSearch() {
  state.searchTerm = "";
  elements.searchInput.value = "";
  filterDevelopers();
}

function filterDevelopers() {
  if (!state.searchTerm) {
    state.filteredDevelopers = [...state.developers];
  } else {
    state.filteredDevelopers = state.developers.filter((dev) => {
      const nameMatch = dev.name.toLowerCase().includes(state.searchTerm);
      const roleMatch = dev.role.toLowerCase().includes(state.searchTerm);
      const skillMatch = dev.skills.some((skill) =>
        skill.toLowerCase().includes(state.searchTerm),
      );
      const locationMatch = dev.location
        .toLowerCase()
        .includes(state.searchTerm);

      return nameMatch || roleMatch || skillMatch || locationMatch;
    });
  }

  renderDirectory();
  updateCount();
  updateResultsInfo();
}

// ============================================
// View Toggle Functionality
// ============================================
function switchView(view) {
  state.currentView = view;

  // Update button states
  elements.viewCardBtn.classList.toggle("active", view === "card");
  elements.viewCardBtn.setAttribute("aria-pressed", view === "card");
  elements.viewTableBtn.classList.toggle("active", view === "table");
  elements.viewTableBtn.setAttribute("aria-pressed", view === "table");

  renderDirectory();
}

// ============================================
// Rendering Functions
// ============================================
function renderDirectory() {
  if (state.filteredDevelopers.length === 0) {
    elements.directoryContainer.classList.add("d-none");
    elements.noResults.classList.remove("d-none");
    return;
  }

  elements.directoryContainer.classList.remove("d-none");
  elements.noResults.classList.add("d-none");

  if (state.currentView === "card") {
    renderCardView();
  } else {
    renderTableView();
  }
}

function renderCardView() {
  const row = document.createElement("div");
  row.className = "row g-4";

  state.filteredDevelopers.forEach((dev, index) => {
    const col = document.createElement("div");
    col.className = "col-lg-4 col-md-6 fade-in";
    col.style.animationDelay = `${index * 0.05}s`;

    col.innerHTML = `
            <article class="developer-card" data-id="${dev.id}">
                <div class="card-image-wrapper">
                    <img src="${dev.avatar}" alt="${dev.name}" loading="lazy">
                    <div class="card-badge-overlay">
                        ${
                          dev.availableForHire
                            ? `<span class="badge badge-hire"><i class="bi bi-briefcase-fill"></i>Available</span>`
                            : ""
                        }
                    </div>
                </div>
                <div class="card-body">
                    <h3 class="card-title h5">${escapeHtml(dev.name)}</h3>
                    <p class="card-role">${escapeHtml(dev.role)}</p>
                    <div class="card-meta">
                        <i class="bi bi-geo-alt-fill"></i>
                        <span>${escapeHtml(dev.location)}</span>
                    </div>
                    <div class="card-meta">
                        <i class="bi bi-envelope-fill"></i>
                        <span>${escapeHtml(dev.email)}</span>
                    </div>
                    <div class="card-skills">
                        ${dev.skills.map((skill) => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join("")}
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-outline-primary btn-sm toggle-hire-btn" 
                                data-id="${dev.id}" 
                                aria-label="Toggle hire status for ${escapeHtml(dev.name)}">
                            <i class="bi ${dev.availableForHire ? "bi-briefcase-fill" : "bi-briefcase"}"></i>
                            ${dev.availableForHire ? "Hired" : "Hire"}
                        </button>
                        <button class="btn btn-outline-danger btn-sm delete-btn" 
                                data-id="${dev.id}"
                                aria-label="Delete ${escapeHtml(dev.name)}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
            </article>
        `;

    row.appendChild(col);
  });

  elements.directoryContainer.innerHTML = "";
  elements.directoryContainer.appendChild(row);

  attachCardEventListeners();
}

function renderTableView() {
  const tableWrapper = document.createElement("div");
  tableWrapper.className = "table-view-container table-responsive fade-in";

  tableWrapper.innerHTML = `
        <table class="table table-hover align-middle">
            <thead>
                <tr>
                    <th scope="col">Developer</th>
                    <th scope="col">Role</th>
                    <th scope="col">Location</th>
                    <th scope="col">Skills</th>
                    <th scope="col">Status</th>
                    <th scope="col" class="text-end">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${state.filteredDevelopers
                  .map(
                    (dev) => `
                    <tr data-id="${dev.id}">
                        <td>
                            <div class="table-developer-info">
                                <img src="${dev.avatar}" alt="${dev.name}" class="table-developer-img">
                                <div>
                                    <div class="table-developer-name">${escapeHtml(dev.name)}</div>
                                    <div class="table-developer-role">${escapeHtml(dev.email)}</div>
                                </div>
                            </div>
                        </td>
                        <td>${escapeHtml(dev.role)}</td>
                        <td><i class="bi bi-geo-alt text-muted me-1"></i>${escapeHtml(dev.location)}</td>
                        <td>
                            <div class="table-skills">
                                ${dev.skills
                                  .slice(0, 3)
                                  .map(
                                    (skill) =>
                                      `<span class="skill-tag">${escapeHtml(skill)}</span>`,
                                  )
                                  .join("")}
                                ${dev.skills.length > 3 ? `<span class="skill-tag">+${dev.skills.length - 3}</span>` : ""}
                            </div>
                        </td>
                        <td>
                            ${
                              dev.availableForHire
                                ? `<span class="badge bg-success"><i class="bi bi-briefcase-fill me-1"></i>Available</span>`
                                : `<span class="badge bg-secondary"><i class="bi bi-briefcase me-1"></i>Not Available</span>`
                            }
                        </td>
                        <td class="text-end">
                            <div class="table-actions">
                                <button class="btn btn-outline-primary btn-sm toggle-hire-btn" 
                                        data-id="${dev.id}"
                                        aria-label="Toggle hire status for ${escapeHtml(dev.name)}">
                                    <i class="bi ${dev.availableForHire ? "bi-briefcase-fill" : "bi-briefcase"}"></i>
                                </button>
                                <button class="btn btn-outline-danger btn-sm delete-btn" 
                                        data-id="${dev.id}"
                                        aria-label="Delete ${escapeHtml(dev.name)}">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </div>
                        </td>
                    </tr>
                `,
                  )
                  .join("")}
            </tbody>
        </table>
    `;

  elements.directoryContainer.innerHTML = "";
  elements.directoryContainer.appendChild(tableWrapper);

  attachTableEventListeners();
}

// ============================================
// Event Attachment for Dynamic Elements
// ============================================
function attachCardEventListeners() {
  // Toggle Hire buttons
  document.querySelectorAll(".toggle-hire-btn").forEach((btn) => {
    btn.addEventListener("click", handleToggleHire);
  });

  // Delete buttons
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });
}

function attachTableEventListeners() {
  // Toggle Hire buttons
  document.querySelectorAll(".toggle-hire-btn").forEach((btn) => {
    btn.addEventListener("click", handleToggleHire);
  });

  // Delete buttons
  document.querySelectorAll(".delete-btn").forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });
}

// ============================================
// Hire Badge Toggle (DOM Manipulation)
// ============================================
function handleToggleHire(event) {
  const btn = event.currentTarget;
  const id = parseInt(btn.getAttribute("data-id"));
  const dev = state.developers.find((d) => d.id === id);

  if (!dev) return;

  // Toggle the state
  dev.availableForHire = !dev.availableForHire;

  // Update DOM directly without full re-render for smooth UX
  if (state.currentView === "card") {
    updateCardHireStatus(btn, dev);
  } else {
    updateTableHireStatus(btn, dev);
  }

  updateCount();
}

function updateCardHireStatus(btn, dev) {
  const card = btn.closest(".developer-card");
  const badgeOverlay = card.querySelector(".card-badge-overlay");

  if (dev.availableForHire) {
    // Add badge
    if (!badgeOverlay.innerHTML.trim()) {
      badgeOverlay.innerHTML = `<span class="badge badge-hire"><i class="bi bi-briefcase-fill"></i>Available</span>`;
    }
    btn.innerHTML = `<i class="bi bi-briefcase-fill"></i>Hired`;
    btn.classList.remove("btn-outline-primary");
    btn.classList.add("btn-primary");
  } else {
    // Remove badge
    badgeOverlay.innerHTML = "";
    btn.innerHTML = `<i class="bi bi-briefcase"></i>Hire`;
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline-primary");
  }
}

function updateTableHireStatus(btn, dev) {
  const row = btn.closest("tr");
  const statusCell = row.querySelector("td:nth-child(5)");

  if (dev.availableForHire) {
    statusCell.innerHTML = `<span class="badge bg-success"><i class="bi bi-briefcase-fill me-1"></i>Available</span>`;
    btn.innerHTML = `<i class="bi bi-briefcase-fill"></i>`;
    btn.classList.remove("btn-outline-primary");
    btn.classList.add("btn-primary");
  } else {
    statusCell.innerHTML = `<span class="badge bg-secondary"><i class="bi bi-briefcase me-1"></i>Not Available</span>`;
    btn.innerHTML = `<i class="bi bi-briefcase"></i>`;
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline-primary");
  }
}

// ============================================
// Delete Developer
// ============================================
function handleDelete(event) {
  const btn = event.currentTarget;
  const id = parseInt(btn.getAttribute("data-id"));
  const dev = state.developers.find((d) => d.id === id);

  if (!dev) return;

  if (
    confirm(`Are you sure you want to remove ${dev.name} from the directory?`)
  ) {
    // Remove from state
    state.developers = state.developers.filter((d) => d.id !== id);
    state.filteredDevelopers = state.filteredDevelopers.filter(
      (d) => d.id !== id,
    );

    // Animate removal
    if (state.currentView === "card") {
      const card = btn.closest(".developer-card");
      card.style.transition = "all 0.3s ease";
      card.style.opacity = "0";
      card.style.transform = "scale(0.9)";
      setTimeout(() => renderDirectory(), 300);
    } else {
      const row = btn.closest("tr");
      row.style.transition = "all 0.3s ease";
      row.style.opacity = "0";
      setTimeout(() => renderDirectory(), 300);
    }

    updateCount();
    updateResultsInfo();
  }
}

// ============================================
// Form Handling & Validation
// ============================================
function handleFormSubmit(event) {
  event.preventDefault();
  event.stopPropagation();

  const form = event.target;

  // Bootstrap validation
  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  // Custom validation
  const name = document.getElementById("dev-name").value.trim();
  const role = document.getElementById("dev-role").value;
  const email = document.getElementById("dev-email").value.trim();
  const location = document.getElementById("dev-location").value.trim();
  const experience = parseInt(document.getElementById("dev-experience").value);
  const skillsInput = document.getElementById("dev-skills").value.trim();
  const available = document.getElementById("dev-available").checked;

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    document.getElementById("dev-email").setCustomValidity("Invalid email");
    form.classList.add("was-validated");
    return;
  }

  // Parse skills
  const skills = skillsInput
    .split(",")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  if (skills.length === 0) {
    document
      .getElementById("dev-skills")
      .setCustomValidity("At least one skill required");
    form.classList.add("was-validated");
    return;
  }

  // Generate new ID
  const newId = Math.max(...state.developers.map((d) => d.id), 0) + 1;

  // Generate avatar color based on role
  const roleColors = {
    "Frontend Developer": "4F81BD",
    "Backend Developer": "9BBB59",
    "Full Stack Developer": "C0504D",
    "UI/UX Designer": "F79646",
    "DevOps Engineer": "8064A2",
    "Mobile Developer": "17375E",
    "Data Scientist": "538135",
    "QA Engineer": "833C00",
    "Cloud Architect": "31849B",
    "Security Engineer": "7F7F7F",
    "AI Engineer": "1F3864",
    "Blockchain Developer": "375623",
  };
  const color = roleColors[role] || "6c757d";

  // Create new developer object
  const newDeveloper = {
    id: newId,
    name: name,
    role: role,
    skills: skills,
    avatar: `https://placehold.co/100x100/${color}/ffffff`,
    availableForHire: available,
    location: location,
    email: email,
  };

  // Add to state
  state.developers.unshift(newDeveloper);

  // Reset form and collapse
  form.reset();
  form.classList.remove("was-validated");

  // Hide collapse using Bootstrap API
  const bsCollapse = bootstrap.Collapse.getInstance(
    elements.addDeveloperCollapse,
  );
  if (bsCollapse) {
    bsCollapse.hide();
  }

  // Apply current search filter
  filterDevelopers();

  // Show success message
  showToast(`Successfully added ${name} to the directory!`, "success");
}

// ============================================
// UI Update Functions
// ============================================
function updateCount() {
  const count = state.filteredDevelopers.length;
  elements.developerCount.textContent = count;

  // Animate the count change
  elements.developerCount.parentElement.style.transform = "scale(1.2)";
  setTimeout(() => {
    elements.developerCount.parentElement.style.transform = "scale(1)";
  }, 200);
}

function updateResultsInfo() {
  const total = state.developers.length;
  const filtered = state.filteredDevelopers.length;

  if (state.searchTerm) {
    elements.resultsInfo.innerHTML = `Showing <strong>${filtered}</strong> of ${total} developers matching "<em>${escapeHtml(state.searchTerm)}</em>"`;
  } else {
    elements.resultsInfo.textContent = `Showing all ${total} developers`;
  }
}

function showToast(message, type = "success") {
  // Create toast element
  const toast = document.createElement("div");
  toast.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
  toast.style.cssText =
    "top: 20px; right: 20px; z-index: 9999; min-width: 300px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);";
  toast.setAttribute("role", "alert");
  toast.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

  document.body.appendChild(toast);

  // Auto dismiss after 3 seconds
  setTimeout(() => {
    const bsAlert = bootstrap.Alert.getOrCreateInstance(toast);
    if (bsAlert) bsAlert.close();
  }, 3000);
}

// ============================================
// Utility Functions
// ============================================
function escapeHtml(text) {
  if (!text) return "";
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// Expose for potential testing
window.TechConnectApp = {
  state,
  elements,
  loadDevelopers,
  filterDevelopers,
  switchView,
};
