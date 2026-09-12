// Excel/CSV-დან ნაწილების მასობრივი დამატება.
//
// CSV ბიბლიოთეკის გარეშე იკითხება. .xlsx-ისთვის SheetJS იტვირთება
// მხოლოდ საჭიროებისას (864 KB), რომ ჩვეულებრივი გვერდი არ დამძიმდეს.

const BulkImport = (() => {
  // სვეტის სახელები — ქართულიც და ინგლისურიც
  const COLUMNS = {
    name: ["დასახელება", "სახელი", "name", "title", "product", "model",
           "车型", "车型/car", "car", "名称", "产品", "品名"],
    category: ["კატეგორია", "category", "cat"],
    price: ["ფასი", "price", "cost", "单价", "价格", "unit price"],
    sale: ["ფასდაკლება", "ფასდაკლებული", "ფასდაკლებული ფასი", "sale", "discount"],
    description: ["აღწერა", "description", "desc", "info", "备注", "remark"],
    images: ["ფოტო", "ფოტოები", "სურათი", "სურათები", "image", "images",
             "photo", "photos", "picture", "图片", "picture /图片"],
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


  // ── xlsx-ში ჩაშენებული სურათები ──────────────────────
  // ისინი zip-ის შიგნით ცალკე ფაილებადაა, უჯრებთან კი drawing XML-ით
  // არის მიბმული: <xdr:from><xdr:row>N</xdr:row> → r:embed="rIdX" → media.
  const MIME = {
    png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
    gif: "image/gif", webp: "image/webp", bmp: "image/bmp",
  };

  const decode = (content) =>
    typeof content === "string"
      ? content
      : new TextDecoder("utf-8").decode(new Uint8Array(content));

  function pickDrawing(files) {
    const drawings = Object.keys(files).filter((k) =>
      /^xl\/drawings\/drawing\d+\.xml$/.test(k)
    );
    return drawings.length ? drawings.sort()[0] : null;
  }

  // sheetRow (1-დან) → [{ name, bytes, mime }]
  function extractMedia(wb) {
    const files = wb.files || {};
    const drawingPath = pickDrawing(files);
    if (!drawingPath || !files[drawingPath]) return new Map();

    const relsPath = drawingPath.replace(
      /drawings\/(drawing\d+\.xml)$/,
      "drawings/_rels/$1.rels"
    );
    if (!files[relsPath]) return new Map();

    // rId → media ფაილის სახელი
    const rels = new Map();
    const relsXml = decode(files[relsPath].content);
    for (const m of relsXml.matchAll(/Id="([^"]+)"[^>]*Target="([^"]+)"/g)) {
      rels.set(m[1], m[2].replace(/^\.\.\//, "xl/"));
    }

    const byRow = new Map();
    const xml = decode(files[drawingPath].content);

    for (const anchor of xml.matchAll(
      /<xdr:(twoCellAnchor|oneCellAnchor)[\s\S]*?<\/xdr:\1>/g
    )) {
      const frag = anchor[0];
      const from = frag.match(/<xdr:from>([\s\S]*?)<\/xdr:from>/);
      const rowMatch = from && from[1].match(/<xdr:row>(\d+)<\/xdr:row>/);
      const embed = frag.match(/r:embed="([^"]+)"/);
      if (!rowMatch || !embed) continue;

      const target = rels.get(embed[1]);
      const entry = target && files[target];
      if (!entry || !entry.content) continue;

      const ext = (target.split(".").pop() || "").toLowerCase();
      const mime = MIME[ext];
      if (!mime) continue; // emf/wmf და მისთანები ბრაუზერს არ ესმის

      const sheetRow = Number(rowMatch[1]) + 1; // XML 0-დან ითვლის
      if (!byRow.has(sheetRow)) byRow.set(sheetRow, []);
      byRow.get(sheetRow).push({
        name: target.split("/").pop(),
        bytes: entry.content,
        mime,
      });
    }
    return byRow;
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
    // bookFiles — zip-ის ნედლი ნაწილები, სურათებისთვის საჭირო
    const book = XLSX.read(new Uint8Array(buffer), { type: "array", bookFiles: true });
    const sheet = book.Sheets[book.SheetNames[0]];
    if (!sheet) throw new Error("ფაილში ფურცელი ვერ მოიძებნა");

    // blankrows: true — თორემ სტრიქონების ნომრები აირევა და სურათები
    // სხვა ნაწილს მიება
    const grid = XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      blankrows: true,
      defval: "",
    });
    return { grid, media: extractMedia(book) };
  }

  // ── ფაილის წაკითხვა ──────────────────────────────────
  async function readFile(file) {
    const isCsv = /\.(csv|txt)$/i.test(file.name);
    let grid, media;

    if (isCsv) {
      grid = parseCsv(await file.text());
      media = new Map();
    } else {
      ({ grid, media } = await parseXlsx(file));
    }

    if (!grid.length) throw new Error("ფაილი ცარიელია");

    const headers = grid[0].map((h) => String(h));
    const map = headerMap(headers);
    if (map.name === undefined) {
      throw new Error(
        "სვეტი „დასახელება“ ვერ მოიძებნა.\n\n" +
        "პირველი სტრიქონი სვეტების სახელებს უნდა შეიცავდეს: " +
        "დასახელება, კატეგორია, ფასი, ფასდაკლება, აღწერა, ფოტოები.\n\n" +
        `ნაპოვნი სვეტები: ${headers.join(", ")}`
      );
    }
    // სტრიქონის ნომერი შენარჩუნებულია, რომ სურათი სწორ ნაწილს მიება
    const body = grid
      .map((cells, i) => ({ cells, sheetRow: i + 1 }))
      .slice(1)
      .filter((r) => r.cells.some((c) => String(c).trim() !== ""));

    return { headers, map, body, media, hasCategoryColumn: map.category !== undefined };
  }

  // ── სტრიქონების გადამუშავება ─────────────────────────
  // categories: [{id, name}] — კატეგორია სახელითაც და id-თაც იძებნება
  function mapRows({ map, body, media }, categories, fallbackCategoryId) {
    const byKey = new Map();
    for (const c of categories) {
      byKey.set(norm(c.id), c.id);
      byKey.set(norm(c.name), c.id);
    }

    const at = (cells, field) =>
      map[field] === undefined ? "" : String(cells[map[field]] == null ? "" : cells[map[field]]).trim();

    return body.map(({ cells: row, sheetRow }) => {
      const name = at(row, "name");
      const rawCategory = at(row, "category");
      const priceText = at(row, "price").replace(/[^\d.,-]/g, "").replace(",", ".");
      const saleText = at(row, "sale").replace(/[^\d.,-]/g, "").replace(",", ".");

      // სურათის უჯრაში ხშირად ნაგავია (მაგ. „·“, როცა სურათი უჯრის
      // თავზე ცურავს). ფაილის სახელად ჩაითვლება მხოლოდ ის, რასაც
      // გაფართოება აქვს, ბმულია ან ბილიკს ჰგავს.
      const looksLikeFile = (t) =>
        /^https?:\/\//i.test(t) ||
        t.includes("/") ||
        /\.[a-z0-9]{2,4}$/i.test(t);

      const images = at(row, "images")
        .split(/[,;\n|]/)
        .map((s) => s.trim())
        .filter((t) => t && looksLikeFile(t));

      const embedded = (media && media.get(sheetRow)) || [];

      const item = {
        line: sheetRow,
        embedded,
        name,
        categoryId: byKey.get(norm(rawCategory)) || fallbackCategoryId || "",
        rawCategory,
        price: Number(priceText) || 0,
        sale: Number(saleText) || 0,
        description: at(row, "description"),
        images,
        problems: [],
      };

      if (!item.name) item.problems.push("დასახელება ცარიელია");
      if (!item.categoryId) {
        item.problems.push(
          rawCategory
            ? `კატეგორია „${rawCategory}“ არ არსებობს`
            : "კატეგორია ცარიელია"
        );
      }
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
