// Contact address shown on every page.
const CONTACT_EMAIL = "ahmettek6@gmail.com";

const LANGS = [
  ["en", "English"],
  ["tr", "Türkçe"],
  ["de", "Deutsch"],
  ["fr", "Français"],
  ["es", "Español"],
  ["it", "Italiano"],
  ["pt-BR", "Português (Brasil)"],
  ["nl", "Nederlands"],
  ["ru", "Русский"],
  ["ja", "日本語"],
  ["ko", "한국어"],
  ["zh-Hans", "简体中文"],
  ["ar", "العربية"]
];

function normalizeLang(pref) {
  if (!pref) return "en";
  const lower = pref.toLowerCase();
  if (lower === "pt" || lower === "pt-br") return "pt-BR";
  if (lower === "zh" || lower.startsWith("zh-cn") || lower.startsWith("zh-hans")) return "zh-Hans";
  if (lower.startsWith("zh")) return "zh-Hans";
  return lower.split("-")[0];
}

function pickLanguage(pages) {
  const hash = decodeURIComponent(location.hash.slice(1));
  if (pages[hash]) return hash;
  for (const pref of navigator.languages || [navigator.language || "en"]) {
    const normalized = normalizeLang(pref);
    if (pages[normalized]) return normalized;
    if (pages[pref]) return pref;
  }
  return "en";
}

function renderPage(pages) {
  const lang = pickLanguage(pages);
  const page = pages[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = page.title + " · " + document.title.split(" · ").pop();
  document.getElementById("title").textContent = page.title;
  document.getElementById("date").textContent = page.date;
  const email = `<a href="mailto:${CONTACT_EMAIL}">${CONTACT_EMAIL}</a>`;
  const linkify = (t) => t.replace(/https:\/\/[^\s<]+/g, (u) => `<a href="${u}">${u}</a>`);
  document.getElementById("content").innerHTML = page.s
    .map(([h, p]) => `<section><h2>${h}</h2><p>${linkify(p).replace("{EMAIL}", email)}</p></section>`)
    .join("");
  document.getElementById("langs").innerHTML = LANGS
    .map(([code, name]) => `<a href="#${code}"${code === lang ? ' aria-current="true"' : ""}>${name}</a>`)
    .join("");
}

window.addEventListener("hashchange", () => location.reload());
