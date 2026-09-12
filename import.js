// Excel/CSV-დან ნაწილების მასობრივი დამატება.
//
// CSV ბიბლიოთეკის გარეშე იკითხება. .xlsx-ისთვის SheetJS იტვირთება
// მხოლოდ საჭიროებისას (864 KB), რომ ჩვეულებრივი გვერდი არ დამძიმდეს.

const BulkImport = (() => {
  // სვეტის სახელები — ქართულიც და ინგლისურიც
  const COLUMNS = {
    name: ["დასახელება", "სახელი", "name", "title", "product"],
    category: ["კატეგორია", "category", "cat"],
    price: ["ფასი", "price", "cost"],
    sale: ["ფასდაკლება", "ფასდაკლებული", "ფასდაკლებული ფასი", "sale", "discount"],
    description: ["აღწერა", "description", "desc", "info"],
    images: ["ფოტო", "ფოტოები", "სურათი", "სურათები", "image", "images", "photo", "photos"],
  };

  const norm = (s) => String(s == null ? "" : s).trim().toLowerCase();

  function headerMap(headers) {
    const map = {};
    headers.forEach((h, i) => {
      const key = norm(h);
      for (const [field, names] of Object.entries(COLUMNS)) {
        if (names.some((n) => n === key)) map[field] = i;
      }
    });
    return map;
  }

  // ── CSV ──────────────────────────────────────────────
  // ციტატებში მძიმეც და ხაზის გადატანაც დაშვებულია
  function parseCsv(text) {
    text = text.replace(/^﻿/, ""); // Excel-ის BOM
    const delimiter = (text.split("\n")[0].match(/;/g) || []).length >
                      (text.split("\n")[0].match(/,/g) || []).length ? ";" : ",";
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];

      if (quoted) {
        if (ch === '"') {
          if (text[i + 1] === '"') { cell += '"'; i++; }
          else quoted = false;
        } else cell += ch;
        continue;
      }
      if (ch === '"') { quoted = true; continue; }
      if (ch === delimiter) { row.push(cell); cell = ""; continue; }
      if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; continue; }
      if (ch === "\r") continue;
      cell += ch;
    }
    if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
    return rows.filter((r) => r.some((c) => String(c).trim() !== ""));
  }

  // ── XLSX ─────────────────────────────────────────────
  let xlsxLoading = null;

  function loadXlsx() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    if (xlsxLoading) return xlsxLoading;

    xlsxLoading = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "vendor/xlsx.full.min.js";
      script.onload = () =>
        window.XLSX ? resolve(window.XLSX) : reject(new Error("ბიბლიოთეკა ვერ ჩაიტვირთა"));
      script.onerror = () => reject(new Error("Excel-ის ბიბლიოთეკა ვერ ჩაიტვირთა"));
      document.head.appendChild(script);
    });
    return xlsxLoading;
  }

  async function parseXlsx(file) {
    const XLSX = await loadXlsx();
    const buffer = await file.arrayBuffer();
    const book = XLSX.read(buffer, { type: "array" });
    const sheet = book.Sheets[book.SheetNames[0]];
    if (!sheet) throw new Error("ფაილში ფურცელი ვერ მოიძებნა");
    return XLSX.utils
      .sheet_to_json(sheet, { header: 1, blankrows: false, defval: "" })
      .filter((r) => r.some((c) => String(c).trim() !== ""));
  }

  // ── ფაილის წაკითხვა ──────────────────────────────────
  async function readFile(file) {
    const isCsv = /\.(csv|txt)$/i.test(file.name);
    const rows = isCsv ? parseCsv(await file.text()) : await parseXlsx(file);

    if (!rows.length) throw new Error("ფაილი ცარიელია");

    const headers = rows[0].map((h) => String(h));
    const map = headerMap(headers);
    if (map.name === undefined) {
      throw new Error(
        "სვეტი „დასახელება“ ვერ მოიძებნა.\n\n" +
        "პირველი სტრიქონი სვეტების სახელებს უნდა შეიცავდეს: " +
        "დასახელება, კატეგორია, ფასი, ფასდაკლება, აღწერა, ფოტოები.\n\n" +
        `ნაპოვნი სვეტები: ${headers.join(", ")}`
      );
    }
    return { headers, map, body: rows.slice(1) };
  }

  // ── სტრიქონების გადამუშავება ─────────────────────────
  // categories: [{id, name}] — კატეგორია სახელითაც და id-თაც იძებნება
  function mapRows({ map, body }, categories) {
    const byKey = new Map();
    for (const c of categories) {
      byKey.set(norm(c.id), c.id);
      byKey.set(norm(c.name), c.id);
    }

    const at = (row, field) =>
      map[field] === undefined ? "" : String(row[map[field]] == null ? "" : row[map[field]]).trim();

    return body.map((row, i) => {
      const name = at(row, "name");
      const rawCategory = at(row, "category");
      const priceText = at(row, "price").replace(/[^\d.,-]/g, "").replace(",", ".");
      const saleText = at(row, "sale").replace(/[^\d.,-]/g, "").replace(",", ".");

      const images = at(row, "images")
        .split(/[,;\n|]/)
        .map((s) => s.trim())
        .filter(Boolean);

      const item = {
        line: i + 2, // +1 სათაური, +1 რომ 1-დან იწყებოდეს
        name,
        categoryId: byKey.get(norm(rawCategory)) || "",
        rawCategory,
        price: Number(priceText) || 0,
        sale: Number(saleText) || 0,
        description: at(row, "description"),
        images,
        problems: [],
      };

      if (!item.name) item.problems.push("დასახელება ცარიელია");
      if (!rawCategory) item.problems.push("კატეგორია ცარიელია");
      else if (!item.categoryId) item.problems.push(`კატეგორია „${rawCategory}“ არ არსებობს`);
      if (!item.price) item.problems.push("ფასი ცარიელია ან არასწორია");
      if (item.sale && item.sale >= item.price) {
        item.problems.push("ფასდაკლება ფასზე მეტია");
        item.sale = 0;
      }
      return item;
    });
  }

  // ── ნიმუშის ფაილი ────────────────────────────────────
  function templateCsv(categories) {
    const example = categories[0];
    const rows = [
      ["დასახელება", "კატეგორია", "ფასი", "ფასდაკლება", "აღწერა", "ფოტოები"],
      ["ზეთის ფილტრი", example ? example.name : "ძრავი", "18", "", "ორიგინალის ანალოგი", "images/oil-filter.jpg"],
      ["სამუხრუჭე ხუნდები", example ? example.name : "ძრავი", "95", "75", "კერამიკული", ""],
    ];
    // BOM, რომ Excel-მა ქართული სწორად წაიკითხოს
    return "﻿" + rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\r\n");
  }

  return { readFile, mapRows, templateCsv };
})();
