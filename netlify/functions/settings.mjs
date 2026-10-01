import { getStore } from "@netlify/blobs";

export default async (req) => {
  const store = getStore("sri-sai-vani-settings");
  if (req.method === "GET") {
    const data = await store.get("settings", { type: "json", consistency: "strong" });
    return Response.json(data || {});
  }
  if (req.method === "PUT") {
    const data = await req.json();
    const clean = {
      shopName: String(data.shopName || "SRI SAI VANI").trim(),
      whatsapp: String(data.whatsapp || "").replace(/\D/g, ""),
      about: String(data.about || "").trim(),
      footer: String(data.footer || "").trim()
    };
    if (!/^91\d{10}$/.test(clean.whatsapp)) {
      return Response.json({ error: "Invalid WhatsApp number" }, { status: 400 });
    }
    await store.setJSON("settings", clean);
    return Response.json(clean);
  }
  return new Response("Method not allowed", { status: 405 });
};
