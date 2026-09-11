// ავტონაწილების კატალოგი — ფილტრაცია და ძებნა

const grid     = document.getElementById("grid");
const filters  = document.getElementById("filters");
const search   = document.getElementById("search");
const countEl  = document.getElementById("count");
const emptyEl  = document.getElementById("empty");

// სურათის ჩანაცვლება, თუ ფაილი ვერ მოიძებნა.
// ფერები თემას მიჰყვება, თორემ მუქ ფონზე თეთრი ლაქა გამოჩნდება.
function placeholder() {
  const dark =
    (window.Theme ? window.Theme.current() : "dark") === "dark";
  const bg = dark ? "#23272f" : "#eef0f3";
  const mark = dark ? "#4d545f" : "#b9bec7";
  const text = dark ? "#6b727e" : "#9aa0aa";

  return (
    "data:image/svg+xml;charset=UTF-8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
         <rect width="400" height="300" fill="${bg}"/>
         <g fill="${mark}">
           <circle cx="200" cy="140" r="46" fill="none" stroke="${mark}" stroke-width="12"/>
           <circle cx="200" cy="140" r="14"/>
         </g>
         <text x="200" y="228" text-anchor="middle" font-family="sans-serif"
               font-size="18" fill="${text}">სურათი არ არის</text>
       </svg>`
    )
  );
}

const categoryName = (id) =>
  (CATEGORIES.find((c) => c.id === id) || {}).name || id;

// ── საიტის სათაური ───────────────────────────────────
if (typeof SITE === "object" && SITE) {
  if (SITE.title) {
    document.getElementById("site-title").textContent = SITE.title;
    document.getElementById("site-title-footer").textContent = SITE.title;
    document.title = SITE.title;
  }
  document.getElementById("site-tagline").textContent = SITE.tagline || "";
}

let activeCategory = "all";
let query = "";

// ── ფილტრების ღილაკები ───────────────────────────────
function renderFilters() {
  const all = [{ id: "all", name: "ყველა" }, ...CATEGORIES];

  filters.innerHTML = all
    .map((c) => {
      const thumb = c.image
        ? `<img class="chip-thumb" src="${c.image}" alt=""
                onerror="this.remove()">`
        : "";
      return `<button class="chip" type="button" data-category="${c.id}"
                      aria-pressed="${c.id === activeCategory}">${thumb}${c.name}</button>`;
    })
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

  const fallback = placeholder();

  grid.innerHTML = visible
    .map(
      (p) => `
      <article class="card">
        ${p.image
          ? `<button class="card-media is-zoomable" type="button"
                     data-zoom="${p.image}" data-name="${p.name}"
                     aria-label="${p.name} — სურათის გადიდება">
               <img src="${p.image}" alt="${p.name}" loading="lazy"
                    onerror="this.onerror=null; this.src='${fallback}'">
             </button>`
          : `<div class="card-media">
               <img src="${fallback}" alt="" loading="lazy">
             </div>`}
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


// ── სურათის გადიდება ─────────────────────────────────
// <dialog> Escape-სა და ფოკუსს თავად უვლის; ფონზე დაჭერას ვამოწმებთ.
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");

grid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-zoom]");
  if (!btn) return;
  lightboxImg.src = btn.dataset.zoom;
  lightboxImg.alt = btn.dataset.name || "";
  lightboxCaption.textContent = btn.dataset.name || "";
  lightbox.showModal();
});

document.getElementById("lightbox-close").addEventListener("click", () => lightbox.close());

// ფონზე დაჭერით დახურვა — თავად სურათზე დაჭერამ არ უნდა დახუროს
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});

// დახურვისას src ვიცლით, რომ მეხსიერებაში დიდი სურათი არ დარჩეს
lightbox.addEventListener("close", () => {
  lightboxImg.removeAttribute("src");
});

window.addEventListener("themechange", render);

document.getElementById("year").textContent = new Date().getFullYear();
renderFilters();
render();
