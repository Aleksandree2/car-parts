// ბექოფისი — კატეგორიების, ნაწილებისა და საიტის სათაურის მართვა.
//
// ყველაფერი მუშაობს ბრაუზერში. ცვლილებები ინახება localStorage-ში (რომ
// შემთხვევით არ დაიკარგოს) და „data.js ჩამოტვირთვა“-ზე გენერირდება ახალი
// data.js — ის უნდა ჩაანაცვლო პროექტში და დაკომიტო.

const DRAFT_KEY = "carparts:draft";
const MAX_IMAGE_PX = 900;       // ატვირთული ფოტო ამაზე დიდი არ შეინახება
const IMAGE_QUALITY = 0.82;

// ── მდგომარეობა ──────────────────────────────────────
const fromFile = () => ({
  site: { title: SITE.title, tagline: SITE.tagline },
  categories: CATEGORIES.map((c) => ({ ...c, image: c.image || "" })),
  parts: PARTS.map((p) => ({ ...p })),
});

function loadDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw) {
      const d = JSON.parse(raw);
      if (d && d.site && Array.isArray(d.categories) && Array.isArray(d.parts)) {
        return d;
      }
    }
  } catch (e) {
    /* დაზიანებული ან მიუწვდომელი localStorage — ვიწყებთ ფაილიდან */
  }
  return null;
}

let state = loadDraft() || fromFile();
let dirty = Boolean(loadDraft());

function save() {
  dirty = true;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    setStatus("შენახულია ბრაუზერში — არ დაგავიწყდეს data.js-ის ჩამოტვირთვა");
  } catch (e) {
    setStatus("⚠ ბრაუზერში ვერ შეინახა — ადგილი ამოიწურა");
    toast("⚠ ბრაუზერის მეხსიერება ამოიწურა — დააჭირე „შენახვა საიტზე“ ახლავე");
  }
}

const $ = (id) => document.getElementById(id);
const setStatus = (t) => { $("status").textContent = t; };

let toastTimer;
function toast(msg) {
  const el = $("toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 2600);
}

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const categoryName = (id) =>
  (state.categories.find((c) => c.id === id) || {}).name || "—";

// ── ქართულიდან ლათინური id ───────────────────────────
const KA_LAT = {
  ა:"a", ბ:"b", გ:"g", დ:"d", ე:"e", ვ:"v", ზ:"z", თ:"t", ი:"i", კ:"k",
  ლ:"l", მ:"m", ნ:"n", ო:"o", პ:"p", ჟ:"zh", რ:"r", ს:"s", ტ:"t", უ:"u",
  ფ:"p", ქ:"k", ღ:"gh", ყ:"q", შ:"sh", ჩ:"ch", ც:"ts", ძ:"dz", წ:"ts",
  ჭ:"ch", ხ:"kh", ჯ:"j", ჰ:"h",
};

function slugify(text) {
  const base = [...String(text).toLowerCase()]
    .map((ch) => KA_LAT[ch] !== undefined ? KA_LAT[ch] : ch)
    .join("")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
  return base || "cat";
}

function uniqueId(text) {
  const base = slugify(text);
  let id = base;
  let n = 2;
  while (state.categories.some((c) => c.id === id)) id = `${base}-${n++}`;
  return id;
}

// ── ტაბები ───────────────────────────────────────────
$("tabs").addEventListener("click", (e) => {
  const tab = e.target.closest(".tab");
  if (!tab) return;
  for (const t of document.querySelectorAll(".tab")) {
    const on = t === tab;
    t.setAttribute("aria-pressed", String(on));
    $("panel-" + t.dataset.tab).hidden = !on;
  }
});

// ── საიტის პარამეტრები ───────────────────────────────
$("site-title").value = state.site.title || "";
$("site-tagline").value = state.site.tagline || "";

$("site-title").addEventListener("input", (e) => {
  state.site.title = e.target.value;
  save();
});
$("site-tagline").addEventListener("input", (e) => {
  state.site.tagline = e.target.value;
  save();
});

// ── ფოტოს დამუშავება ─────────────────────────────────
// დიდი ფოტო data.js-ს უსაფუძვლოდ ბერავს, ამიტომ ატვირთვისას ვამცირებთ.
function readImage(file) {
  return new Promise((resolve, reject) => {
    // iPhone-ის HEIC/HEIF-ს ბრაუზერი ვერ ხსნის — ჯობია პირდაპირ ვუთხრათ
    const heic = /\.(heic|heif)$/i.test(file.name) || /hei[cf]/i.test(file.type);
    if (heic) {
      reject(new Error(
        "HEIC ფორმატს ბრაუზერი ვერ ხსნის.\n\n" +
        "iPhone-ზე: Settings → Camera → Formats → Most Compatible, " +
        "ან გააზიარე ფოტო როგორც JPEG."
      ));
      return;
    }
    if (file.type && !file.type.startsWith("image/")) {
      reject(new Error(`ეს ფაილი სურათი არ არის (${file.type || "უცნობი ტიპი"})`));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error("ფაილი ვერ წაიკითხა"));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () =>
        reject(new Error("სურათი ვერ გაიხსნა — სცადე JPEG ან PNG ფორმატში"));
      img.onload = () => {
        if (!img.width || !img.height) {
          reject(new Error("სურათი ცარიელია"));
          return;
        }
        const scale = Math.min(1, MAX_IMAGE_PX / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
        try {
          resolve(canvas.toDataURL("image/jpeg", IMAGE_QUALITY));
        } catch (e) {
          reject(new Error("სურათის დამუშავება ვერ მოხერხდა"));
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function pickImage() {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/jpeg,image/png,image/webp,image/gif,image/*";

    // ზოგიერთ მობილურ ბრაუზერში DOM-ს გარეთ მყოფ input-ზე click() არაფერს
    // აკეთებს — ფაილის ასარჩევი ფანჯარა საერთოდ არ იხსნება
    input.style.position = "fixed";
    input.style.left = "-9999px";
    document.body.appendChild(input);

    const done = (value) => {
      input.remove();
      resolve(value);
    };

    input.addEventListener("change", async () => {
      const file = input.files && input.files[0];
      if (!file) { done(null); return; }
      try {
        const image = await readImage(file);
        toast(`ფოტო დაემატა (${file.name})`);
        done(image);
      } catch (err) {
        alert(err.message); // toast-ს ვერ დაინახავს, თუ დიალოგი ღიაა
        done(null);
      }
    });

    // არჩევის გაუქმებაზე promise დაკიდებული რომ არ დარჩეს
    input.addEventListener("cancel", () => done(null));

    input.click();
  });
}

const thumb = (src, fallback) =>
  src
    ? `<span class="row-thumb"><img src="${escapeHtml(src)}" alt=""
         onerror="this.parentNode.textContent='🖼'"></span>`
    : `<span class="row-thumb">${fallback}</span>`;

// ── კატეგორიები ──────────────────────────────────────
const categoryRows = $("category-rows");

function renderCategories() {
  if (!state.categories.length) {
    categoryRows.innerHTML =
      `<p class="rows-empty">ჯერ კატეგორია არ არის. დააჭირე „+ კატეგორია“.</p>`;
  } else {
    categoryRows.innerHTML = state.categories
      .map((c, i) => {
        const used = state.parts.filter((p) => p.category === c.id).length;
        return `
        <div class="row" data-index="${i}">
          ${thumb(c.image, "🗂")}
          <div class="row-main">
            <input type="text" value="${escapeHtml(c.name)}"
                   data-action="rename" aria-label="კატეგორიის სახელი">
            <span class="row-meta">${c.id} · ${used} ნაწილი</span>
          </div>
          <div class="row-tools">
            <button class="btn-icon" type="button" data-action="up"
                    ${i === 0 ? "disabled" : ""} title="ზემოთ">↑</button>
            <button class="btn-icon" type="button" data-action="down"
                    ${i === state.categories.length - 1 ? "disabled" : ""} title="ქვემოთ">↓</button>
            <button class="btn-icon" type="button" data-action="photo" title="ფოტო">📷</button>
            <button class="btn-icon danger" type="button" data-action="delete" title="წაშლა">✕</button>
          </div>
        </div>`;
      })
      .join("");
  }
  renderCategoryOptions();
}

categoryRows.addEventListener("click", async (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const i = Number(btn.closest(".row").dataset.index);
  const cat = state.categories[i];

  if (btn.dataset.action === "up" || btn.dataset.action === "down") {
    const j = btn.dataset.action === "up" ? i - 1 : i + 1;
    [state.categories[i], state.categories[j]] = [state.categories[j], state.categories[i]];
    save();
    renderCategories();
    return;
  }

  if (btn.dataset.action === "photo") {
    const image = await pickImage();
    if (image) {
      cat.image = image;
      save();
      renderCategories();
      toast("ფოტო დაემატა");
    }
    return;
  }

  if (btn.dataset.action === "delete") {
    const used = state.parts.filter((p) => p.category === cat.id).length;
    if (used) {
      alert(`„${cat.name}“ ვერ წაიშლება — მასში ${used} ნაწილია.\n\n` +
            `ჯერ გადაიტანე ან წაშალე ეს ნაწილები.`);
      return;
    }
    if (!confirm(`წავშალოთ კატეგორია „${cat.name}“?`)) return;
    state.categories.splice(i, 1);
    save();
    renderCategories();
  }
});

categoryRows.addEventListener("input", (e) => {
  const input = e.target.closest('input[data-action="rename"]');
  if (!input) return;
  const i = Number(input.closest(".row").dataset.index);
  state.categories[i].name = input.value;
  save();
  renderCategoryOptions();
  renderParts();
});

$("add-category").addEventListener("click", () => {
  const name = prompt("კატეგორიის სახელი:");
  if (!name || !name.trim()) return;
  state.categories.push({ id: uniqueId(name.trim()), name: name.trim(), image: "" });
  save();
  renderCategories();
});

// კატეგორიების ჩამონათვალი ორივე select-ისთვის
function renderCategoryOptions() {
  const options = state.categories
    .map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`)
    .join("");

  const filter = $("part-filter");
  const keep = filter.value;
  filter.innerHTML = `<option value="all">ყველა კატეგორია</option>` + options;
  filter.value = state.categories.some((c) => c.id === keep) ? keep : "all";

  const picker = $("p-category");
  const keepPick = picker.value;
  picker.innerHTML = options;
  if (state.categories.some((c) => c.id === keepPick)) picker.value = keepPick;
}

// ── ნაწილები ─────────────────────────────────────────
const partRows = $("part-rows");
let editingIndex = -1;

function visibleParts() {
  const q = $("part-search").value.trim().toLowerCase();
  const cat = $("part-filter").value;
  return state.parts
    .map((p, index) => ({ p, index }))
    .filter(({ p }) => {
      const byCat = cat === "all" || p.category === cat;
      const byQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.description || "").toLowerCase().includes(q);
      return byCat && byQuery;
    });
}

function renderParts() {
  const rows = visibleParts();
  $("parts-hint").textContent = `სულ ${state.parts.length} ნაწილი`;

  if (!state.parts.length) {
    partRows.innerHTML =
      `<p class="rows-empty">ჯერ ნაწილი არ არის. დააჭირე „+ ნაწილი“.</p>`;
    return;
  }
  if (!rows.length) {
    partRows.innerHTML = `<p class="rows-empty">ამ ფილტრით ვერაფერი მოიძებნა.</p>`;
    return;
  }

  partRows.innerHTML = rows
    .map(({ p, index }) => `
      <div class="row" data-index="${index}">
        ${thumb(p.image, "🔧")}
        <div class="row-main">
          <p class="row-title">${escapeHtml(p.name)}</p>
          <span class="row-meta">${escapeHtml(categoryName(p.category))}</span>
        </div>
        <span class="row-price">${Number(p.price) || 0} ₾</span>
        <div class="row-tools">
          <button class="btn-icon" type="button" data-action="edit" title="რედაქტირება">✎</button>
          <button class="btn-icon danger" type="button" data-action="delete" title="წაშლა">✕</button>
        </div>
      </div>`)
    .join("");
}

$("part-search").addEventListener("input", renderParts);
$("part-filter").addEventListener("change", renderParts);

partRows.addEventListener("click", (e) => {
  const btn = e.target.closest("button[data-action]");
  if (!btn) return;
  const index = Number(btn.closest(".row").dataset.index);

  if (btn.dataset.action === "edit") {
    openPart(index);
    return;
  }
  if (btn.dataset.action === "delete") {
    if (!confirm(`წავშალოთ „${state.parts[index].name}“?`)) return;
    state.parts.splice(index, 1);
    save();
    renderParts();
    renderCategories();
  }
});

// ── ნაწილის რედაქტორი ────────────────────────────────
const dialog = $("part-dialog");
let draftImage = "";

function setPreview(src) {
  draftImage = src || "";
  $("p-preview").innerHTML = draftImage
    ? `<img src="${escapeHtml(draftImage)}" alt=""
           onerror="this.parentNode.textContent='ვერ ჩაიტვირთა'">`
    : "ფოტო არ არის";
}

function openPart(index) {
  if (!state.categories.length) {
    alert("ჯერ დაამატე მინიმუმ ერთი კატეგორია.");
    return;
  }
  editingIndex = index;
  const p = index < 0
    ? { name: "", category: state.categories[0].id, price: "", description: "", image: "" }
    : state.parts[index];

  $("dialog-title").textContent = index < 0 ? "ახალი ნაწილი" : "ნაწილის რედაქტირება";
  $("p-name").value = p.name;
  $("p-category").value = p.category;
  $("p-price").value = p.price;
  $("p-desc").value = p.description || "";
  $("p-path").value = p.image && !p.image.startsWith("data:") ? p.image : "";
  setPreview(p.image);
  dialog.showModal();
  $("p-name").focus();
}

$("add-part").addEventListener("click", () => openPart(-1));
$("p-cancel").addEventListener("click", () => dialog.close());

$("p-upload").addEventListener("click", async () => {
  const image = await pickImage();
  if (image) {
    $("p-path").value = "";
    setPreview(image);
  }
});

$("p-clear").addEventListener("click", () => {
  $("p-path").value = "";
  setPreview("");
});

$("p-path").addEventListener("input", (e) => {
  if (e.target.value.trim()) setPreview(e.target.value.trim());
});

$("part-form").addEventListener("submit", () => {
  const part = {
    name: $("p-name").value.trim(),
    category: $("p-category").value,
    price: Number($("p-price").value) || 0,
    image: $("p-path").value.trim() || draftImage,
    description: $("p-desc").value.trim(),
  };

  if (editingIndex < 0) state.parts.push(part);
  else state.parts[editingIndex] = part;

  save();
  renderParts();
  renderCategories();
  toast(editingIndex < 0 ? "ნაწილი დაემატა" : "შენახულია");
});

// ── data.js-ის გენერაცია ─────────────────────────────
function buildDataFile() {
  const q = (s) => JSON.stringify(String(s));

  const categories = state.categories
    .map((c) => `  { id: ${q(c.id)}, name: ${q(c.name)}, image: ${q(c.image || "")} },`)
    .join("\n");

  const parts = state.parts
    .map((p) => [
      "  {",
      `    name: ${q(p.name)},`,
      `    category: ${q(p.category)},`,
      `    price: ${Number(p.price) || 0},`,
      `    image: ${q(p.image || "")},`,
      `    description: ${q(p.description || "")},`,
      "  },",
    ].join("\n"))
    .join("\n");

  return `// ავტონაწილების მონაცემები
// ────────────────────────────────────────────────────────────
// ეს ფაილი დაგენერირდა ბექოფისიდან (admin.html).
// ხელით რედაქტირებაც შეიძლება, ოღონდ სტრუქტურა შეინარჩუნე.

// საიტის ზოგადი პარამეტრები
const SITE = {
  title: ${q(state.site.title)},
  tagline: ${q(state.site.tagline)},
};

const CATEGORIES = [
${categories}
];

const PARTS = [
${parts}
];
`;
}

// ექსპორტი ორ გზად: ჩამოტვირთვა, ან კოპირება — ჩამოტვირთვა ყველგან
// არ მუშაობს (preview-ჩარჩოები, ზოგი მობილური ბრაუზერი).
const exportDialog = $("export-dialog");

$("export").addEventListener("click", () => {
  const text = buildDataFile();
  $("export-text").value = text;
  $("export-size").textContent =
    `${Math.round(new Blob([text]).size / 1024)} KB`;
  exportDialog.showModal();
});

$("export-close").addEventListener("click", () => exportDialog.close());

$("export-download").addEventListener("click", () => {
  const blob = new Blob([$("export-text").value], {
    type: "text/javascript;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.js";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  dirty = false;
  toast("data.js ჩამოიტვირთა — ჩაანაცვლე პროექტში");
});

$("export-copy").addEventListener("click", async () => {
  const text = $("export-text").value;
  try {
    await navigator.clipboard.writeText(text);
  } catch (e) {
    // clipboard API დაბლოკილია — მონიშვნით მაინც დააკოპირებს
    $("export-text").select();
    if (!document.execCommand || !document.execCommand("copy")) {
      toast("კოპირება ვერ მოხერხდა — მონიშნე ტექსტი და Ctrl+C");
      return;
    }
  }
  dirty = false;
  toast("დაკოპირდა");
});


// ── მონაცემების თავიდან ჩატვირთვა ────────────────────
// ბრაუზერში შენახული დრაფტი შეიძლება ჩამორჩეს რეპოზიტორიას (მაგ. სხვა
// კომპიუტერიდან შენახვის ან ხელით კომიტის შემდეგ). ეს ღილაკი დრაფტს
// შლის და მონაცემებს ისევ data.js-დან იღებს.
$("reload").addEventListener("click", () => {
  if (!confirm(
    "ბრაუზერში შენახული ცვლილებები წაიშლება და მონაცემები თავიდან " +
    "ჩაიტვირთება data.js-დან.\n\nგავაგრძელოთ?"
  )) return;

  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch (e) {
    /* localStorage მიუწვდომელია — გვერდის გადატვირთვა მაინც დაეხმარება */
  }
  location.reload();
});

// ── კავშირი GitHub-თან ───────────────────────────────
const conn = {
  token: $("gh-token"),
  owner: $("gh-owner"),
  repo: $("gh-repo"),
  branch: $("gh-branch"),
  result: $("gh-result"),
};

function fillConnection() {
  const c = GitHubPublisher.getConfig();
  conn.token.value = c.token || "";
  // ცარიელზე მიმდინარე მისამართიდან ვცდილობთ გამოცნობას
  const guess = /^([^.]+)\.github\.io$/.exec(location.hostname);
  conn.owner.value = c.owner || (guess ? guess[1] : "");
  conn.repo.value =
    c.repo || (guess ? location.pathname.split("/").filter(Boolean)[0] || "" : "");
  conn.branch.value = c.branch || "main";
}

function setResult(text, kind) {
  conn.result.textContent = text;
  conn.result.className = "conn-result" + (kind ? " " + kind : "");
}

function readConnection() {
  return {
    token: conn.token.value.trim(),
    owner: conn.owner.value.trim(),
    repo: conn.repo.value.trim(),
    branch: conn.branch.value.trim() || "main",
  };
}

$("gh-save-config").addEventListener("click", () => {
  GitHubPublisher.setConfig(readConnection());
  setResult("პარამეტრები შენახულია", "ok");
  toast("შენახულია");
});

$("gh-test").addEventListener("click", async (e) => {
  const btn = e.currentTarget;
  btn.disabled = true;
  setResult("მოწმდება…");
  try {
    const info = await GitHubPublisher.test(readConnection());
    GitHubPublisher.setConfig(readConnection());
    setResult(`✓ კავშირი მუშაობს — ${info.full_name}`, "ok");
  } catch (err) {
    setResult("✕ " + err.message, "bad");
  } finally {
    btn.disabled = false;
  }
});

$("gh-forget").addEventListener("click", () => {
  if (!confirm("წავშალოთ თოკენი ამ ბრაუზერიდან?")) return;
  GitHubPublisher.clearToken();
  conn.token.value = "";
  setResult("თოკენი წაშლილია", "ok");
});

fillConnection();

// ── საიტზე შენახვა ───────────────────────────────────
// ატვირთული ფოტოები data: URL-ებია. შენახვისას ისინი images/-ში
// ნამდვილ ფაილებად ჩაიწერება, data.js კი მხოლოდ ბილიკებს შეინახავს —
// ასე data.js პატარა რჩება.
const saveDialog = $("save-dialog");

function setStep(text, kind) {
  $("save-step").textContent = text;
  $("save-step").className = "save-step" + (kind ? " " + kind : "");
}

function imageFileName(name, ext) {
  const stamp = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return `images/${slugify(name) || "photo"}-${stamp}.${ext}`;
}

function collectUploads() {
  // state-ის ასლი, სადაც data: URL-ები ბილიკებით იცვლება
  const next = JSON.parse(JSON.stringify(state));
  const files = [];

  const swap = (item) => {
    if (!GitHubPublisher.isDataUrl(item.image)) return;
    const { base64, ext } = GitHubPublisher.splitDataUrl(item.image);
    const path = imageFileName(item.name, ext);
    files.push({ path, content: base64, encoding: "base64" });
    item.image = path;
  };

  next.categories.forEach(swap);
  next.parts.forEach(swap);
  return { next, files };
}

$("save").addEventListener("click", async () => {
  if (!GitHubPublisher.isConfigured()) {
    saveDialog.close();
    for (const t of document.querySelectorAll(".tab")) {
      const on = t.dataset.tab === "connection";
      t.setAttribute("aria-pressed", String(on));
      $("panel-" + t.dataset.tab).hidden = !on;
    }
    setResult("ჯერ შეიყვანე თოკენი და შეამოწმე კავშირი", "bad");
    conn.token.focus();
    return;
  }

  $("save-close").hidden = true;
  $("save-link").hidden = true;
  setStep("მზადდება…");
  saveDialog.showModal();

  try {
    const { next, files } = collectUploads();

    // data.js იგებება უკვე ჩანაცვლებული ბილიკებით
    const previous = state;
    state = next;
    const dataText = buildDataFile();
    state = previous;

    files.push({
      path: "data.js",
      content: GitHubPublisher.encodeText(dataText),
      encoding: "base64",
    });

    const photos = files.length - 1;
    const message = photos
      ? `კატალოგის განახლება ბექოფისიდან (+${photos} ფოტო)`
      : "კატალოგის განახლება ბექოფისიდან";

    const commit = await GitHubPublisher.publish({ files, message }, setStep);

    // წარმატების შემდეგ ბილიკები რეალურ state-შიც გადადის
    state = next;
    save();
    dirty = false;
    renderCategories();
    renderParts();

    setStep(
      photos
        ? `✓ შენახულია — ${photos} ფოტო ატვირთულია.\nსაიტი ერთ წუთში განახლდება.`
        : "✓ შენახულია. საიტი ერთ წუთში განახლდება.",
      "ok"
    );
    $("save-link").href = commit.url;
    $("save-link").hidden = false;
    setStatus("ბოლო შენახვა საიტზე: ახლა");
  } catch (err) {
    setStep("✕ " + err.message, "bad");
  } finally {
    $("save-close").hidden = false;
  }
});

$("save-close").addEventListener("click", () => saveDialog.close());

window.addEventListener("beforeunload", (e) => {
  if (!dirty) return;
  e.preventDefault();
  e.returnValue = "";
});

// ── გაშვება ──────────────────────────────────────────
renderCategories();
renderParts();
setStatus(dirty ? "გაქვს შეუნახავი ცვლილებები" : "მონაცემები data.js-დან");
