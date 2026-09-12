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

const esc = (v) =>
  String(v == null ? "" : v).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

// ნაწილს შეიძლება ჰქონდეს images: [...] (ახალი) ან image: "..." (ძველი)
const imagesOf = (item) =>
  Array.isArray(item.images)
    ? item.images.filter(Boolean)
    : item.image
    ? [item.image]
    : [];

// ფასდაკლება მაშინაა, როცა sale დადებითია და ჩვეულებრივზე ნაკლები
function priceBlock(p) {
  const price = Number(p.price) || 0;
  const sale = Number(p.sale) || 0;
  const on = sale > 0 && sale < price;

  if (!on) return `<span class="card-price">${price} ₾</span>`;

  const off = Math.round((1 - sale / price) * 100);
  return `<span class="card-price is-sale">
            <span class="price-now">${sale} ₾</span>
            <s class="price-was">${price} ₾</s>
            <span class="price-off">−${off}%</span>
          </span>`;
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
        ${(() => {
          const photos = imagesOf(p);
          if (!photos.length) {
            return `<div class="card-media">
                      <img src="${fallback}" alt="" loading="lazy">
                    </div>`;
          }
          return `<button class="card-media is-zoomable" type="button"
                          data-zoom="${encodeURIComponent(JSON.stringify(photos))}"
                          data-name="${esc(p.name)}"
                          aria-label="${esc(p.name)} — სურათების ნახვა">
                    <img src="${esc(photos[0])}" alt="${esc(p.name)}" loading="lazy"
                         onerror="this.onerror=null; this.src='${fallback}'">
                    ${photos.length > 1
                      ? `<span class="photo-count">🖼 ${photos.length}</span>`
                      : ""}
                    ${Number(p.sale) > 0 && Number(p.sale) < Number(p.price)
                      ? `<span class="sale-flag">ფასდაკლება</span>`
                      : ""}
                  </button>`;
        })()}
        <div class="card-body">
          <span class="card-cat">${esc(categoryName(p.category))}</span>
          <h2 class="card-title">${esc(p.name)}</h2>
          <p class="card-desc">${esc(p.description || "")}</p>
          ${priceBlock(p)}
        </div>
      </article>`
    )
    .join("");

  emptyEl.hidden = visible.length > 0;
  countEl.textContent = visible.length
    ? `ნაპოვნია ${visible.length} ნაწილი`
    : "";
}


// ── სურათების გალერეა ────────────────────────────────
// <dialog> Escape-სა და ფოკუსს თავად უვლის; ფონზე დაჭერას ვამოწმებთ.
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxCaption = document.getElementById("lightbox-caption");
const lightboxPrev = document.getElementById("lightbox-prev");
const lightboxNext = document.getElementById("lightbox-next");
const lightboxCounter = document.getElementById("lightbox-counter");

let gallery = [];
let galleryIndex = 0;
let galleryName = "";

function showPhoto(i) {
  galleryIndex = (i + gallery.length) % gallery.length;
  lightboxImg.src = gallery[galleryIndex];
  lightboxImg.alt = galleryName;

  const many = gallery.length > 1;
  lightboxPrev.hidden = !many;
  lightboxNext.hidden = !many;
  lightboxCounter.hidden = !many;
  lightboxCounter.textContent = `${galleryIndex + 1} / ${gallery.length}`;
  lightboxCaption.textContent = galleryName;
}

grid.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-zoom]");
  if (!btn) return;
  try {
    gallery = JSON.parse(decodeURIComponent(btn.dataset.zoom));
  } catch (err) {
    return;
  }
  if (!gallery.length) return;
  galleryName = btn.dataset.name || "";
  showPhoto(0);
  lightbox.showModal();
});

lightboxPrev.addEventListener("click", () => showPhoto(galleryIndex - 1));
lightboxNext.addEventListener("click", () => showPhoto(galleryIndex + 1));

document.getElementById("lightbox-close").addEventListener("click", () => lightbox.close());

// ფონზე დაჭერით დახურვა — სურათზე ან ღილაკზე დაჭერამ არ უნდა დახუროს
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.close();
});

// ისრებით გადათვალიერება
lightbox.addEventListener("keydown", (e) => {
  if (gallery.length < 2) return;
  if (e.key === "ArrowLeft") { e.preventDefault(); showPhoto(galleryIndex - 1); }
  if (e.key === "ArrowRight") { e.preventDefault(); showPhoto(galleryIndex + 1); }
});

// დახურვისას src ვიცლით, რომ მეხსიერებაში დიდი სურათი არ დარჩეს
lightbox.addEventListener("close", () => {
  lightboxImg.removeAttribute("src");
  gallery = [];
});

// ── სლაიდერი ─────────────────────────────────────────
const slider = document.getElementById("slider");
const sliderTrack = document.getElementById("slider-track");
const sliderDots = document.getElementById("slider-dots");
const sliderPrev = document.getElementById("slider-prev");
const sliderNext = document.getElementById("slider-next");

const slides =
  typeof SLIDES !== "undefined" && Array.isArray(SLIDES)
    ? SLIDES.filter((s) => s && s.image)
    : [];

let slideIndex = 0;
let slideTimer = null;

function showSlide(i) {
  slideIndex = (i + slides.length) % slides.length;
  sliderTrack.style.transform = `translateX(-${slideIndex * 100}%)`;
  for (const [n, dot] of [...sliderDots.children].entries()) {
    dot.setAttribute("aria-current", String(n === slideIndex));
  }
}

function startAuto() {
  stopAuto();
  if (slides.length < 2) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  slideTimer = setInterval(() => showSlide(slideIndex + 1), 6000);
}

function stopAuto() {
  if (slideTimer) clearInterval(slideTimer);
  slideTimer = null;
}

function renderSlider() {
  if (!slides.length) return; // სლაიდი არ არის — სექცია დამალული რჩება

  slider.hidden = false;
  sliderTrack.innerHTML = slides
    .map((sl) => {
      const align = ["top", "center", "bottom"].includes(sl.align) ? sl.align : "center";
      const size = ["s", "m", "l"].includes(sl.size) ? sl.size : "m";
      const color = /^#[0-9a-f]{3,8}$/i.test(sl.color || "") ? sl.color : "#ffffff";
      const overlay = Math.min(90, Math.max(0, Number(sl.overlay) || 0)) / 100;

      const caption = sl.title
        ? `<div class="slide-overlay" style="background: rgba(0,0,0,${overlay})"></div>
           <div class="slide-caption align-${align} size-${size}"
                style="color: ${esc(color)}"><span>${esc(sl.title)}</span></div>`
        : "";

      const inner = `<img src="${esc(sl.image)}" alt="${esc(sl.title || "")}" loading="lazy">${caption}`;
      return sl.link
        ? `<a class="slide" href="${esc(sl.link)}" rel="noopener">${inner}</a>`
        : `<div class="slide">${inner}</div>`;
    })
    .join("");

  const many = slides.length > 1;
  sliderPrev.hidden = !many;
  sliderNext.hidden = !many;
  sliderDots.innerHTML = many
    ? slides
        .map((_, i) => `<button class="slider-dot" type="button"
                                data-slide="${i}" aria-label="ბანერი ${i + 1}"></button>`)
        .join("")
    : "";

  showSlide(0);
  startAuto();
}

sliderPrev.addEventListener("click", () => { showSlide(slideIndex - 1); startAuto(); });
sliderNext.addEventListener("click", () => { showSlide(slideIndex + 1); startAuto(); });
sliderDots.addEventListener("click", (e) => {
  const dot = e.target.closest("[data-slide]");
  if (!dot) return;
  showSlide(Number(dot.dataset.slide));
  startAuto();
});

// მაუსის ან ფოკუსის დროს ავტომატური გადასვლა ჩერდება
slider.addEventListener("mouseenter", stopAuto);
slider.addEventListener("mouseleave", startAuto);
slider.addEventListener("focusin", stopAuto);
slider.addEventListener("focusout", startAuto);

renderSlider();

window.addEventListener("themechange", render);

document.getElementById("year").textContent = new Date().getFullYear();
renderFilters();
render();
