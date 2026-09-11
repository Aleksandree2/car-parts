// ავტონაწილების კატალოგი — ფილტრაცია და ძებნა

const grid     = document.getElementById("grid");
const filters  = document.getElementById("filters");
const search   = document.getElementById("search");
const countEl  = document.getElementById("count");
const emptyEl  = document.getElementById("empty");

// სურათის ჩანაცვლება, თუ ფაილი ვერ მოიძებნა
const PLACEHOLDER =
  "data:image/svg+xml;charset=UTF-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
       <rect width="400" height="300" fill="#eef0f3"/>
       <g fill="#b9bec7">
         <circle cx="200" cy="140" r="46" fill="none" stroke="#b9bec7" stroke-width="12"/>
         <circle cx="200" cy="140" r="14"/>
       </g>
       <text x="200" y="228" text-anchor="middle" font-family="sans-serif"
             font-size="18" fill="#9aa0aa">სურათი არ არის</text>
     </svg>`
  );

const categoryName = (id) =>
  (CATEGORIES.find((c) => c.id === id) || {}).name || id;

let activeCategory = "all";
let query = "";

// ── ფილტრების ღილაკები ───────────────────────────────
function renderFilters() {
  const all = [{ id: "all", name: "ყველა" }, ...CATEGORIES];

  filters.innerHTML = all
    .map(
      (c) =>
        `<button class="chip" type="button" data-category="${c.id}"
                 aria-pressed="${c.id === activeCategory}">${c.name}</button>`
    )
    .join("");
}

filters.addEventListener("click", (e) => {
  const btn = e.target.closest(".chip");
  if (!btn) return;
  activeCategory = btn.dataset.category;
  renderFilters();
  render();
});

// ── ძებნა ────────────────────────────────────────────
search.addEventListener("input", () => {
  query = search.value.trim().toLowerCase();
  render();
});

// ── ბარათების დახატვა ────────────────────────────────
function render() {
  const visible = PARTS.filter((p) => {
    const byCategory = activeCategory === "all" || p.category === activeCategory;
    const bySearch =
      !query ||
      p.name.toLowerCase().includes(query) ||
      (p.description || "").toLowerCase().includes(query) ||
      categoryName(p.category).toLowerCase().includes(query);
    return byCategory && bySearch;
  });

  grid.innerHTML = visible
    .map(
      (p) => `
      <article class="card">
        <div class="card-media">
          <img src="${p.image}" alt="${p.name}" loading="lazy"
               onerror="this.onerror=null; this.src='${PLACEHOLDER}'">
        </div>
        <div class="card-body">
          <span class="card-cat">${categoryName(p.category)}</span>
          <h2 class="card-title">${p.name}</h2>
          <p class="card-desc">${p.description || ""}</p>
          <span class="card-price">${p.price} ₾</span>
        </div>
      </article>`
    )
    .join("");

  emptyEl.hidden = visible.length > 0;
  countEl.textContent = visible.length
    ? `ნაპოვნია ${visible.length} ნაწილი`
    : "";
}

document.getElementById("year").textContent = new Date().getFullYear();
renderFilters();
render();
