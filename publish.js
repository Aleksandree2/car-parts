// GitHub-ზე პირდაპირი შენახვა.
//
// საიტი სტატიკურია — სერვერი არ არსებობს — ამიტომ ბექოფისი ცვლილებებს
// პირდაპირ GitHub-ის API-ით ინახავს. საჭიროა თოკენი, რომელიც ინახება
// მხოლოდ შენს ბრაუზერში (localStorage) და არასოდეს ხვდება რეპოზიტორიაში.
//
// ყველა ფაილი (data.js + ახალი ფოტოები) ერთ კომიტში იგზავნება, რომ
// GitHub Pages ერთხელ გადაეწყოს და არა ყოველ ფოტოზე.

const GitHubPublisher = (() => {
  const KEY = "carparts:github";
  const API = "https://api.github.com";

  // ── კონფიგურაცია ───────────────────────────────────
  const defaults = { owner: "", repo: "", branch: "main", token: "" };

  function getConfig() {
    try {
      return { ...defaults, ...(JSON.parse(localStorage.getItem(KEY)) || {}) };
    } catch (e) {
      return { ...defaults };
    }
  }

  function setConfig(patch) {
    const next = { ...getConfig(), ...patch };
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch (e) {
      throw new Error("ბრაუზერში შენახვა ვერ მოხერხდა");
    }
    return next;
  }

  function clearToken() {
    setConfig({ token: "" });
  }

  const isConfigured = () => {
    const c = getConfig();
    return Boolean(c.token && c.owner && c.repo);
  };

  // ── API ────────────────────────────────────────────
  async function api(path, { method = "GET", body, token } = {}) {
    let res;
    try {
      res = await fetch(API + path, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          ...(body ? { "Content-Type": "application/json" } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
      });
    } catch (e) {
      throw new Error("ქსელთან კავშირი ვერ დამყარდა");
    }

    if (!res.ok) {
      let detail = "";
      try {
        const json = await res.json();
        detail = json.message || "";
      } catch (e) {
        /* პასუხი JSON არ იყო */
      }
      throw new Error(explain(res.status, detail));
    }
    return res.status === 204 ? null : res.json();
  }

  function explain(status, detail) {
    if (status === 401) return "თოკენი არასწორია ან ვადაგასულია";
    if (status === 403) return "თოკენს ამ რეპოზიტორიაზე ჩაწერის უფლება არ აქვს";
    if (status === 404) return "რეპოზიტორია ან ბრენჩი ვერ მოიძებნა (შეამოწმე owner/repo/branch და თოკენის წვდომა)";
    if (status === 409) return "რეპოზიტორია შეიცვალა — გადატვირთე გვერდი და ისევ სცადე";
    if (status === 422) return `GitHub-მა უარყო მოთხოვნა${detail ? " — " + detail : ""}`;
    return `GitHub: ${status}${detail ? " — " + detail : ""}`;
  }

  // ── კავშირის შემოწმება ─────────────────────────────
  async function test(config = getConfig()) {
    const { owner, repo, branch, token } = config;
    if (!token) throw new Error("თოკენი არ არის შეყვანილი");
    if (!owner || !repo) throw new Error("owner და repo სავალდებულოა");

    const info = await api(`/repos/${owner}/${repo}`, { token });
    if (!info.permissions || !info.permissions.push) {
      throw new Error("თოკენს ჩაწერის (write) უფლება არ აქვს");
    }
    await api(`/repos/${owner}/${repo}/branches/${branch}`, { token });
    return { full_name: info.full_name, private: info.private };
  }

  // ── ერთი კომიტი ყველა ფაილზე ───────────────────────
  // files: [{ path, content, encoding }] — encoding: "utf-8" | "base64"
  async function publish({ files, message }, onProgress = () => {}) {
    const { owner, repo, branch, token } = getConfig();
    if (!token) throw new Error("ჯერ შეიყვანე თოკენი „კავშირი“ ჩანართში");
    if (!files.length) throw new Error("შესანახი არაფერია");

    const base = `/repos/${owner}/${repo}`;

    onProgress("ბრენჩის მოძებნა…");
    const ref = await api(`${base}/git/ref/heads/${branch}`, { token });
    const headSha = ref.object.sha;

    const headCommit = await api(`${base}/git/commits/${headSha}`, { token });
    const baseTreeSha = headCommit.tree.sha;

    // თითოეული ფაილი ცალკე blob-ად — ასე ორობითი ფოტოებიც გადის
    const tree = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      onProgress(`ფაილების ატვირთვა… ${i + 1}/${files.length}`);
      const blob = await api(`${base}/git/blobs`, {
        method: "POST",
        token,
        body: { content: file.content, encoding: file.encoding || "utf-8" },
      });
      tree.push({ path: file.path, mode: "100644", type: "blob", sha: blob.sha });
    }

    onProgress("კომიტის შექმნა…");
    const newTree = await api(`${base}/git/trees`, {
      method: "POST",
      token,
      body: { base_tree: baseTreeSha, tree },
    });

    const commit = await api(`${base}/git/commits`, {
      method: "POST",
      token,
      body: { message, tree: newTree.sha, parents: [headSha] },
    });

    onProgress("ბრენჩის განახლება…");
    await api(`${base}/git/refs/heads/${branch}`, {
      method: "PATCH",
      token,
      body: { sha: commit.sha, force: false },
    });

    return {
      sha: commit.sha,
      url: `https://github.com/${owner}/${repo}/commit/${commit.sha}`,
    };
  }

  // ── დამხმარეები ────────────────────────────────────
  const isDataUrl = (s) => typeof s === "string" && s.startsWith("data:");

  // data:image/jpeg;base64,XXXX → { base64, ext }
  function splitDataUrl(url) {
    const match = /^data:image\/([a-z+]+);base64,(.+)$/i.exec(url);
    if (!match) throw new Error("სურათის ფორმატი ვერ ამოიცნო");
    const ext = match[1].toLowerCase() === "jpeg" ? "jpg" : match[1].toLowerCase();
    return { base64: match[2], ext };
  }

  // UTF-8 ტექსტი → base64 (btoa მარტო latin1-ს იღებს)
  function encodeText(text) {
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (const b of bytes) binary += String.fromCharCode(b);
    return btoa(binary);
  }

  return {
    getConfig, setConfig, clearToken, isConfigured,
    test, publish,
    isDataUrl, splitDataUrl, encodeText,
  };
})();
