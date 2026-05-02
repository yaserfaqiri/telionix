const state = {
  categories: [],
  headers: [],
  banners: [],
  boxBanners: [],
  products: [],
  currentPanel: "categories",
};

const elements = {
  authGate: document.getElementById("authGate"),
  loginForm: document.getElementById("loginForm"),
  loginUsername: document.getElementById("loginUsername"),
  loginPassword: document.getElementById("loginPassword"),
  logoutButton: document.getElementById("logoutButton"),
  currentUserChip: document.getElementById("currentUserChip"),
  sidebarUserAvatar: document.getElementById("sidebarUserAvatar"),
  topbarAvatar: document.getElementById("topbarAvatar"),
  globalAddButton: document.getElementById("globalAddButton"),
  statusBadge: document.getElementById("statusBadge"),
  categoryForm: document.getElementById("categoryForm"),
  headerForm: document.getElementById("headerForm"),
  bannerForm: document.getElementById("bannerForm"),
  boxBannerForm: document.getElementById("boxBannerForm"),
  productForm: document.getElementById("productForm"),
  categoryList: document.getElementById("categoryList"),
  headerList: document.getElementById("headerList"),
  bannerList: document.getElementById("bannerList"),
  boxBannerList: document.getElementById("boxBannerList"),
  productList: document.getElementById("productList"),
  categoryCount: document.getElementById("categoryCount"),
  headerCount: document.getElementById("headerCount"),
  bannerCount: document.getElementById("bannerCount"),
  boxBannerCount: document.getElementById("boxBannerCount"),
  productCount: document.getElementById("productCount"),
  categorySearch: document.getElementById("categorySearch"),
  headerSearch: document.getElementById("headerSearch"),
  bannerSearch: document.getElementById("bannerSearch"),
  boxBannerSearch: document.getElementById("boxBannerSearch"),
  productSearch: document.getElementById("productSearch"),
  productCategorySelect: document.getElementById("productCategorySelect"),
  detailModalTitle: document.getElementById("detailModalTitle"),
  detailModalBody: document.getElementById("detailModalBody"),
};

document.querySelectorAll(".sidebar-link").forEach((button) => {
  button.addEventListener("click", () => {
    setActivePanel(button.dataset.panel);
  });
});

document.querySelectorAll(".panel-add-button").forEach((button) => {
  button.addEventListener("click", () => {
    openModal(button.dataset.modal);
  });
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => {
    closeModal(button.dataset.closeModal);
  });
});

document.querySelectorAll(".modal-shell").forEach((modal) => {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      modal.classList.remove("open");
    }
  });
});

elements.globalAddButton.addEventListener("click", () => {
  const modalMap = {
    categories: "categoryModal",
    headers: "headerModal",
    banners: "bannerModal",
    "box-banners": "boxBannerModal",
    products: "productModal",
  };
  openModal(modalMap[state.currentPanel]);
});

elements.categoryForm.addEventListener("submit", (event) =>
  submitJsonForm(event, "/api/categories", elements.categoryForm, loadCategories, "categoryModal")
);
elements.headerForm.addEventListener("submit", (event) =>
  submitMultipartForm(event, "/api/header-slides", elements.headerForm, loadHeaders, "headerModal")
);
elements.bannerForm.addEventListener("submit", (event) =>
  submitMultipartForm(event, "/api/banners", elements.bannerForm, loadBanners, "bannerModal")
);
elements.boxBannerForm.addEventListener("submit", (event) =>
  submitMultipartForm(event, "/api/box-banners", elements.boxBannerForm, loadBoxBanners, "boxBannerModal")
);
elements.productForm.addEventListener("submit", (event) =>
  submitMultipartForm(event, "/api/products", elements.productForm, loadProducts, "productModal")
);
elements.loginForm.addEventListener("submit", handleLoginSubmit);
elements.logoutButton.addEventListener("click", handleLogout);
elements.categorySearch.addEventListener("input", renderCategories);
elements.headerSearch.addEventListener("input", renderHeaders);
elements.bannerSearch.addEventListener("input", renderBanners);
elements.boxBannerSearch.addEventListener("input", renderBoxBanners);
elements.productSearch.addEventListener("input", renderProducts);

await bootstrap();

async function bootstrap() {
  const session = await checkSession();
  await checkHealth();

  if (session?.authenticated) {
    unlockAdmin(session.username);
    await initializeDashboard();
    return;
  }

  lockAdmin();
}

async function checkHealth() {
  try {
    const response = await fetch("/api/health");
    if (!response.ok) {
      throw new Error("Server is not ready.");
    }
    elements.statusBadge.textContent = "Online";
  } catch (error) {
    elements.statusBadge.textContent = "Offline";
    elements.statusBadge.style.color = "#9a2525";
    elements.statusBadge.style.background = "#fff4f4";
    elements.statusBadge.style.borderColor = "#efc1c1";
    showGlobalMessage(error.message, "error");
  }
}

async function checkSession() {
  try {
    const response = await fetch("/api/auth/session");
    if (!response.ok) {
      return { authenticated: false };
    }
    return await response.json();
  } catch {
    return { authenticated: false };
  }
}

async function initializeDashboard() {
  await Promise.all([loadCategories(), loadHeaders(), loadBanners(), loadBoxBanners(), loadProducts()]);
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  clearMessages(elements.authGate);

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: elements.loginUsername.value,
        password: elements.loginPassword.value,
      }),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.message || "Login failed.");
    }

    unlockAdmin(payload.username);
    elements.loginForm.reset();
    await initializeDashboard();
  } catch (error) {
    insertMessage(elements.authGate, error.message, "error");
  }
}

async function handleLogout() {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
  } finally {
    state.categories = [];
    state.headers = [];
    state.banners = [];
    state.boxBanners = [];
    state.products = [];
    renderCategories();
    renderHeaders();
    renderBanners();
    renderBoxBanners();
    renderProducts();
    updateCounts();
    lockAdmin();
  }
}

function lockAdmin() {
  document.body.classList.add("auth-locked");
  elements.authGate.classList.add("active");
  setUserDisplay("Guest");
  window.setTimeout(() => elements.loginUsername.focus(), 60);
}

function unlockAdmin(username) {
  document.body.classList.remove("auth-locked");
  elements.authGate.classList.remove("active");
  setUserDisplay(username || "Admin");
}

function setUserDisplay(username) {
  const safeName = username || "Admin";
  const initials = safeName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "AD";

  elements.currentUserChip.textContent = safeName;
  elements.sidebarUserAvatar.textContent = initials;
  elements.topbarAvatar.textContent = initials;
}

function setActivePanel(panel) {
  state.currentPanel = panel;

  document.querySelectorAll(".sidebar-link").forEach((item) => {
    item.classList.toggle("active", item.dataset.panel === panel);
  });

  document.querySelectorAll(".panel-section").forEach((section) => {
    section.classList.toggle("active", section.id === `panel-${panel}`);
  });

  const labels = {
    categories: "+ New Category",
    headers: "+ New Header",
    banners: "+ New Banner",
    "box-banners": "+ New Box Banner",
    products: "+ New Product",
  };

  elements.globalAddButton.textContent = labels[panel] || "+ New Item";
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add("open");
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove("open");
    clearMessages(modal);
  }
}

async function loadCategories() {
  const response = await fetch("/api/categories");
  state.categories = await response.json();
  renderCategories();
  populateCategorySelect();
  updateCounts();
}

async function loadHeaders() {
  const response = await fetch("/api/header-slides");
  state.headers = await response.json();
  renderHeaders();
  updateCounts();
}

async function loadBanners() {
  const response = await fetch("/api/banners");
  state.banners = await response.json();
  renderBanners();
  updateCounts();
}

async function loadBoxBanners() {
  const response = await fetch("/api/box-banners");
  state.boxBanners = await response.json();
  renderBoxBanners();
  updateCounts();
}

async function loadProducts() {
  const response = await fetch("/api/products");
  state.products = await response.json();
  renderProducts();
  updateCounts();
}

async function submitJsonForm(event, url, form, refreshFn, modalId) {
  event.preventDefault();

  const modal = form.closest(".modal-shell");
  clearMessages(modal || form.parentElement);

  try {
    const formData = new FormData(form);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(Object.fromEntries(formData.entries())),
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.message || "Failed to save record.");
    }

    form.reset();
    await refreshFn();
    closeModal(modalId);
  } catch (error) {
    insertMessage(modal || form.parentElement, error.message, "error");
  }
}

async function submitMultipartForm(event, url, form, refreshFn, modalId) {
  event.preventDefault();

  const formData = new FormData(form);
  const modal = form.closest(".modal-shell");
  clearMessages(modal || form.parentElement);

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.message || "Failed to save record.");
    }

    form.reset();
    if (form === elements.productForm) {
      elements.productCategorySelect.value = "";
    }
    await refreshFn();
    closeModal(modalId);
  } catch (error) {
    insertMessage(modal || form.parentElement, error.message, "error");
  }
}

async function deleteItem(url, refreshFn) {
  if (!window.confirm("Delete this item?")) {
    return;
  }

  try {
    const response = await fetch(url, { method: "DELETE" });
    const payload = await response.json();

    if (!response.ok) {
      throw new Error(payload.message || "Failed to delete record.");
    }

    await refreshFn();
  } catch (error) {
    showGlobalMessage(error.message, "error");
  }
}

function updateCounts() {
  elements.categoryCount.textContent = state.categories.length;
  elements.headerCount.textContent = state.headers.length;
  elements.bannerCount.textContent = state.banners.length;
  elements.boxBannerCount.textContent = state.boxBanners.length;
  elements.productCount.textContent = state.products.length;
}

function renderCategories() {
  const query = elements.categorySearch.value.trim().toLowerCase();
  const items = state.categories.filter((item) =>
    matchesQuery([item.name, item.slug, item.description], query)
  );

  renderTable({
    target: elements.categoryList,
    items,
    emptyMessage: "No categories found.",
    rowClass: "table-head-categories",
    buildRow: (item) =>
      createTableRow({
        rowClass: "table-head-categories",
        onClick: () => showDetailModal(`Category: ${item.name}`, buildCategoryDetail(item)),
        columns: [
          createCategoryColumn(item.name, item.description || "No description"),
          wrapText(item.slug),
          wrapStatus("Active"),
          wrapText(formatDate(item.created_at)),
          createDeleteAction(() => deleteItem(`/api/categories/${item.id}`, async () => {
            await loadCategories();
            await loadProducts();
          })),
        ],
      }),
  });
}

function renderHeaders() {
  const query = elements.headerSearch.value.trim().toLowerCase();
  const items = state.headers.filter((item) =>
    matchesQuery([item.title, item.subtitle, item.cta_label, item.cta_link], query)
  );

  renderTable({
    target: elements.headerList,
    items,
    emptyMessage: "No header slides found.",
    rowClass: "table-head-headers",
    buildRow: (item) =>
      createTableRow({
        rowClass: "table-head-headers",
        onClick: () => showDetailModal(`Header: ${item.title || "Untitled"}`, buildHeaderDetail(item)),
        columns: [
          createMainColumn(item.title, item.subtitle, item.desktop_image),
          wrapText(item.cta_label || item.cta_link || "No CTA"),
          wrapText(String(item.display_order ?? 0)),
          wrapResponsive(item.mobile_image),
          wrapText(formatDate(item.created_at)),
          createDeleteAction(() => deleteItem(`/api/header-slides/${item.id}`, loadHeaders)),
        ],
      }),
  });
}

function renderBanners() {
  const query = elements.bannerSearch.value.trim().toLowerCase();
  const items = state.banners.filter((item) =>
    matchesQuery([item.title, item.subtitle, item.target_link], query)
  );

  renderTable({
    target: elements.bannerList,
    items,
    emptyMessage: "No banners found.",
    rowClass: "table-head-banners",
    buildRow: (item) =>
      createTableRow({
        rowClass: "table-head-banners",
        onClick: () => showDetailModal(`Banner: ${item.title || "Untitled"}`, buildBannerDetail(item)),
        columns: [
          createMainColumn(item.title, item.subtitle, item.desktop_image),
          wrapText(item.target_link || "No target"),
          wrapText(String(item.display_order ?? 0)),
          wrapResponsive(item.mobile_image),
          wrapText(formatDate(item.created_at)),
          createDeleteAction(() => deleteItem(`/api/banners/${item.id}`, loadBanners)),
        ],
      }),
  });
}

function renderBoxBanners() {
  const query = elements.boxBannerSearch.value.trim().toLowerCase();
  const items = state.boxBanners.filter((item) =>
    matchesQuery([item.title, item.subtitle, item.target_link], query)
  );

  renderTable({
    target: elements.boxBannerList,
    items,
    emptyMessage: "No box banners found.",
    rowClass: "table-head-box-banners",
    buildRow: (item) =>
      createTableRow({
        rowClass: "table-head-box-banners",
        onClick: () => showDetailModal(`Box Banner: ${item.title || "Untitled"}`, buildBoxBannerDetail(item)),
        columns: [
          createMainColumn(item.title, item.subtitle || "No subtitle", item.desktop_image),
          wrapText(item.target_link || "No target"),
          wrapResponsive(item.mobile_image),
          wrapText(formatDate(item.created_at)),
          createDeleteAction(() => deleteItem(`/api/box-banners/${item.id}`, loadBoxBanners)),
        ],
      }),
  });
}

function renderProducts() {
  const query = elements.productSearch.value.trim().toLowerCase();
  const items = state.products.filter((item) =>
    matchesQuery([item.title, item.short_description, item.category, item.sku], query)
  );

  renderTable({
    target: elements.productList,
    items,
    emptyMessage: "No products found.",
    rowClass: "table-head-products",
    buildRow: (item) =>
      createTableRow({
        rowClass: "table-head-products",
        onClick: () => showDetailModal(`Product: ${item.title || "Untitled"}`, buildProductDetail(item)),
        columns: [
          createMainColumn(
            item.title,
            item.short_description || `${item.sku}${item.gallery_images?.length ? ` - ${item.gallery_images.length} gallery images` : ""}`,
            item.desktop_image
          ),
          wrapTag(item.category || "General"),
          wrapStatus("Active"),
          wrapPrice(item.price),
          wrapText(formatDate(item.created_at)),
          createDeleteAction(() => deleteItem(`/api/products/${item.id}`, loadProducts)),
        ],
      }),
  });
}

function populateCategorySelect() {
  const currentValue = elements.productCategorySelect.value;
  const hasCategories = state.categories.length > 0;
  elements.productCategorySelect.innerHTML = hasCategories
    ? `<option value="">Select category</option>`
    : `<option value="">Add a category first</option>`;
  elements.productCategorySelect.disabled = !hasCategories;

  for (const category of state.categories) {
    const option = document.createElement("option");
    option.value = String(category.id);
    option.textContent = category.name;
    elements.productCategorySelect.appendChild(option);
  }

  if (currentValue && hasCategories) {
    elements.productCategorySelect.value = currentValue;
  }
}

function renderTable({ target, items, emptyMessage, buildRow }) {
  target.innerHTML = "";

  if (!items.length) {
    target.innerHTML = `<div class="empty-state">${escapeHtml(emptyMessage)}</div>`;
    return;
  }

  for (const item of items) {
    target.appendChild(buildRow(item));
  }
}

function createTableRow({ rowClass, columns, onClick }) {
  const row = document.createElement("article");
  row.className = `table-row ${rowClass}`;
  if (onClick) {
    row.classList.add("table-row-clickable");
    row.addEventListener("click", onClick);
  }
  columns.forEach((column) => row.appendChild(column));
  return row;
}

function createMainColumn(title, subtitle, image) {
  const wrapper = document.createElement("div");
  wrapper.className = "row-main";
  wrapper.innerHTML = `
    <div class="row-thumb">
      ${image ? `<img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" />` : ""}
    </div>
    <div class="row-copy">
      <strong>${escapeHtml(title || "Untitled")}</strong>
      <span>${escapeHtml(subtitle || "No description")}</span>
    </div>
  `;
  return wrapper;
}

function createCategoryColumn(title, description) {
  const wrapper = document.createElement("div");
  wrapper.className = "row-copy row-copy-wide";
  wrapper.innerHTML = `
    <strong>${escapeHtml(title || "Untitled")}</strong>
    <span>${escapeHtml(description || "No description")}</span>
  `;
  return wrapper;
}

function wrapText(text) {
  const node = document.createElement("div");
  node.textContent = text || "-";
  return node;
}

function wrapTag(text) {
  const node = document.createElement("div");
  node.innerHTML = `<span class="row-tag">${escapeHtml(text || "-")}</span>`;
  return node;
}

function wrapStatus(text) {
  const node = document.createElement("div");
  node.innerHTML = `<span class="status-pill">${escapeHtml(text)}</span>`;
  return node;
}

function wrapResponsive(mobileImage) {
  const node = document.createElement("div");
  node.innerHTML = `<span class="responsive-pill">${mobileImage ? "Desktop + Mobile" : "Desktop only"}</span>`;
  return node;
}

function wrapPrice(price) {
  const node = document.createElement("div");
  node.className = "row-price";
  node.textContent =
    price !== null && price !== undefined && price !== ""
      ? `$${Number(price).toFixed(2)}`
      : "-";
  return node;
}

function createDeleteAction(onDelete) {
  const wrap = document.createElement("div");
  wrap.className = "row-actions";
  const button = document.createElement("button");
  button.type = "button";
  button.className = "danger-link";
  button.textContent = "Delete";
  button.addEventListener("click", (event) => {
    event.stopPropagation();
    onDelete();
  });
  wrap.appendChild(button);
  return wrap;
}

function showDetailModal(title, bodyHtml) {
  elements.detailModalTitle.textContent = title;
  elements.detailModalBody.innerHTML = bodyHtml;
  openModal("detailModal");
}

function buildCategoryDetail(item) {
  return `
    ${buildMetaGrid([
      ["Name", item.name],
      ["Slug", item.slug],
      ["Created", formatDate(item.created_at)],
      ["Description", item.description || "No description"],
    ])}
  `;
}

function buildHeaderDetail(item) {
  return `
    ${buildMediaSection("Images", [item.desktop_image, item.mobile_image])}
    ${buildMetaGrid([
      ["Title", item.title || "Untitled"],
      ["Subtitle", item.subtitle || "-"],
      ["CTA Label", item.cta_label || "-"],
      ["CTA Link", item.cta_link || "-"],
      ["Order", item.display_order ?? 0],
      ["Created", formatDate(item.created_at)],
    ])}
  `;
}

function buildBannerDetail(item) {
  return `
    ${buildMediaSection("Images", [item.desktop_image, item.mobile_image])}
    ${buildMetaGrid([
      ["Title", item.title || "Untitled"],
      ["Subtitle", item.subtitle || "-"],
      ["Target Link", item.target_link || "-"],
      ["Order", item.display_order ?? 0],
      ["Created", formatDate(item.created_at)],
    ])}
  `;
}

function buildBoxBannerDetail(item) {
  return `
    ${buildMediaSection("Images", [item.desktop_image, item.mobile_image])}
    ${buildMetaGrid([
      ["Title", item.title || "Untitled"],
      ["Subtitle", item.subtitle || "-"],
      ["Target Link", item.target_link || "-"],
      ["Created", formatDate(item.created_at)],
    ])}
  `;
}

function buildProductDetail(item) {
  return `
    ${buildMediaSection("Primary Images", [item.desktop_image, item.mobile_image])}
    ${buildMediaSection("Gallery Images", item.gallery_images || [])}
    ${buildMetaGrid([
      ["Title", item.title || "Untitled"],
      ["SKU", item.sku || "-"],
      ["Category", item.category || "-"],
      ["Price", item.price !== null && item.price !== undefined && item.price !== "" ? `$${Number(item.price).toFixed(2)}` : "-"],
      ["Rating", item.rating ?? 0],
      ["Reviews", item.reviews ?? 0],
      ["Views", item.views ?? 0],
      ["Badge", item.badge_text || "-"],
      ["Created", formatDate(item.created_at)],
      ["Description", item.short_description || "No description"],
    ])}
  `;
}

function buildMediaSection(title, images) {
  const list = (images || []).filter(Boolean);
  return `
    <section class="detail-section">
      <h3>${escapeHtml(title)}</h3>
      ${
        list.length
          ? `<div class="detail-gallery">${list
              .map(
                (image, index) => `
                  <a class="detail-gallery-item" href="${escapeHtml(image)}" target="_blank" rel="noreferrer">
                    <img src="${escapeHtml(image)}" alt="${escapeHtml(title)} ${index + 1}" />
                  </a>
                `
              )
              .join("")}</div>`
          : `<p class="detail-empty">No images available.</p>`
      }
    </section>
  `;
}

function buildMetaGrid(entries) {
  return `
    <section class="detail-section">
      <div class="detail-grid">
        ${entries
          .map(
            ([label, value]) => `
              <div class="detail-item">
                <span>${escapeHtml(label)}</span>
                <strong>${escapeHtml(String(value ?? "-"))}</strong>
              </div>
            `
          )
          .join("")}
      </div>
    </section>
  `;
}

function matchesQuery(values, query) {
  if (!query) {
    return true;
  }
  return values.some((value) => String(value || "").toLowerCase().includes(query));
}

function formatDate(rawValue) {
  if (!rawValue) {
    return "-";
  }

  const date = new Date(rawValue);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function showGlobalMessage(message, type) {
  clearMessages(document.body);
  insertMessage(document.body, message, type, true);
}

function insertMessage(container, message, type, prepend = false) {
  const node = document.createElement("p");
  node.className = `message ${type}`;
  node.textContent = message;

  if (prepend) {
    document.body.prepend(node);
  } else {
    container.prepend(node);
  }
}

function clearMessages(container) {
  container.querySelectorAll(".message").forEach((message) => message.remove());
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
