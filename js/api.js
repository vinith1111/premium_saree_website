window.SriSaiApi = (() => {
  const OWNER = "vinith1111";
  const REPO = "premium_saree_website";
  const BRANCH = "main";
  const API = "https://api.github.com";
  const TOKEN_KEY = "srisai_vani_github_token";
  const SETTINGS_PATH = "store-settings.json";
  const INDEX_PATH = "products/index.json";

  const token = () => {
    try { return localStorage.getItem(TOKEN_KEY) || ""; } catch { return ""; }
  };
  const setToken = value => {
    const v = String(value || "").trim();
    try {
      if (v) localStorage.setItem(TOKEN_KEY, v);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {}
    return v;
  };

  const headers = () => ({
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2026-03-10",
    Authorization: "Bearer " + token()
  });

  async function request(path, options = {}) {
    if (!token()) throw new Error("Add your GitHub token in Shop settings first.");
    const r = await fetch(API + path, {
      ...options,
      headers: { ...headers(), ...(options.headers || {}) }
    });
    const text = await r.text();
    let data = {};
    try { data = text ? JSON.parse(text) : {}; } catch {}
    if (!r.ok) {
      if (r.status === 401) throw new Error("GitHub token is invalid or expired.");
      if (r.status === 403) throw new Error("GitHub rejected the token. Check that Contents has Read and write permission.");
      throw new Error(data.message || "GitHub request failed.");
    }
    return data;
  }

  async function publicJson(path) {
    const r = await fetch("https://raw.githubusercontent.com/" + OWNER + "/" + REPO + "/" + BRANCH + "/" + path + "?v=" + Date.now(), { cache: "no-store" });
    if (r.status === 404) return null;
    if (!r.ok) throw new Error("Could not read " + path);
    return r.json();
  }

  function encode(value) {
    const bytes = new TextEncoder().encode(String(value));
    let binary = "";
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(binary);
  }

  function cleanSettings(value) {
    const s = value && typeof value === "object" ? value : {};
    return {
      shopName: String(s.shopName || "SRI SAI VANI").trim(),
      whatsapp: String(s.whatsapp || "").replace(/\D/g, ""),
      about: String(s.about || "").trim(),
      footer: String(s.footer || "").trim(),
      theme: s.theme === "dark" ? "dark" : "light"
    };
  }

  async function getFile(path) {
    try {
      return await request("/repos/" + OWNER + "/" + REPO + "/contents/" + path + "?ref=" + BRANCH);
    } catch (e) {
      if (/404|Not Found/i.test(e.message)) return null;
      throw e;
    }
  }

  async function writeFile(path, content, message) {
    const existing = await getFile(path);
    const body = {
      message,
      content: encode(content),
      branch: BRANCH
    };
    if (existing?.sha) body.sha = existing.sha;
    await request("/repos/" + OWNER + "/" + REPO + "/contents/" + path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
  }

  async function deleteFile(path, message) {
    const existing = await getFile(path);
    if (!existing?.sha) return;
    await request("/repos/" + OWNER + "/" + REPO + "/contents/" + path, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, sha: existing.sha, branch: BRANCH })
    });
  }

  function imageData(value) {
    const m = String(value || "").match(/^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=]+)$/i);
    return m ? { ext: m[1].toLowerCase().includes("png") ? "png" : m[1].toLowerCase().includes("webp") ? "webp" : "jpg", base64: m[2] } : null;
  }

  function safeId(value) {
    return String(value).replace(/[^a-zA-Z0-9_-]/g, "-").slice(0, 80) || String(Date.now());
  }

  function normalizeProduct(x) {
    return {
      id: Number(x?.id) || Date.now(),
      name: String(x?.name || "").trim(),
      price: String(x?.price || "").trim(),
      category: String(x?.category || "").trim(),
      color: String(x?.color || "").trim(),
      description: String(x?.description || "").trim(),
      image: String(x?.image || "").trim(),
      imagePath: x?.imagePath ? String(x.imagePath) : null,
      featured: Boolean(x?.featured),
      bestSeller: Boolean(x?.bestSeller)
    };
  }

  async function readCatalog() {
    const data = await publicJson(INDEX_PATH);
    return Array.isArray(data) ? data : [];
  }

  async function saveProduct(product, isNew) {
    const items = await readCatalog();
    const incoming = normalizeProduct(product);
    const index = items.findIndex(x => String(x.id) === String(incoming.id));
    if (isNew && index >= 0) throw new Error("A product with this ID already exists.");
    if (!isNew && index < 0) throw new Error("Product not found.");

    const old = index >= 0 ? normalizeProduct(items[index]) : null;
    const image = imageData(incoming.image);
    let imagePath = incoming.imagePath || null;

    if (image) {
      imagePath = "products/" + safeId(incoming.id) + "/image." + image.ext;
      const currentImage = await getFile(imagePath);
      const imageBody = {
        message: (isNew ? "Add" : "Update") + " product image: " + incoming.name,
        content: image.base64,
        branch: BRANCH
      };
      if (currentImage?.sha) imageBody.sha = currentImage.sha;
      await request("/repos/" + OWNER + "/" + REPO + "/contents/" + imagePath, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(imageBody)
      });
    }

    const stored = { ...incoming, image: imagePath || incoming.image, imagePath };
    const next = items.map(normalizeProduct);
    if (isNew) next.unshift(stored);
    else next[index] = stored;

    await writeFile("products/" + safeId(incoming.id) + "/product.json", JSON.stringify(stored, null, 2) + "\n", (isNew ? "Add product: " : "Update product: ") + incoming.name);
    await writeFile(INDEX_PATH, JSON.stringify(next, null, 2) + "\n", "Update product catalogue");

    if (old?.imagePath && old.imagePath !== imagePath) await deleteFile(old.imagePath, "Remove old product image");
    return stored;
  }

  async function deleteProduct(id) {
    const items = await readCatalog();
    const index = items.findIndex(x => String(x.id) === String(id));
    if (index < 0) throw new Error("Product not found.");
    const old = normalizeProduct(items[index]);
    const next = items.filter((_, i) => i !== index);

    await deleteFile("products/" + safeId(old.id) + "/product.json", "Delete product: " + old.name);
    if (old.imagePath) await deleteFile(old.imagePath, "Delete product image: " + old.name);
    await writeFile(INDEX_PATH, JSON.stringify(next, null, 2) + "\n", "Update product catalogue");
    return { id };
  }

  return {
    base() { return "github-pages"; },
    getGithubToken: token,
    setGithubToken: setToken,
    clearGithubToken() { setToken(""); },

    async verifyGithubToken(value) {
      const previous = token();
      setToken(value);
      try {
        await request("/user");
        return true;
      } catch (e) {
        setToken(previous);
        throw e;
      }
    },

    async settings(options = {}) {
      const method = String(options.method || "GET").toUpperCase();
      if (method === "GET") return (await publicJson(SETTINGS_PATH)) || {};
      if (method !== "PUT") throw new Error("Unsupported settings operation.");
      let body = {};
      try { body = typeof options.body === "string" ? JSON.parse(options.body || "{}") : {}; } catch {}
      if (body.githubToken) setToken(body.githubToken);
      const clean = cleanSettings(body);
      await writeFile(SETTINGS_PATH, JSON.stringify(clean, null, 2) + "\n", "Update shop settings");
      return clean;
    },

    async login(value) {
      const saved = token();
      const supplied = String(value || saved || "").trim();
      if (!supplied) throw new Error("Enter your GitHub token to continue.");
      await this.verifyGithubToken(supplied);
      return { ok: true };
    },

    async catalog(method = "GET", body = null) {
      if (method === "GET") return readCatalog();
      if (method === "POST") return saveProduct(body, true);
      if (method === "PATCH") return saveProduct(body, false);
      if (method === "DELETE") return deleteProduct(body?.id);
      throw new Error("Unsupported catalogue operation.");
    },

    async addProduct(product) { return this.catalog("POST", product); },
    async updateProduct(product) { return this.catalog("PATCH", product); },
    async deleteProduct(id) { return this.catalog("DELETE", { id }); }
  };
})();