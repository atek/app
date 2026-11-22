// Contact address shown on every page. Replace before publishing.
const CONTACT_EMAIL = "ahmettek6@gmail.com";

const LANGS = [
  ["en", "English"], ["tr", "Türkçe"],
];

function pickLanguage(pages) {
  const hash = decodeURIComponent(location.hash.slice(1));
  if (pages[hash]) return hash;
  for (const pref of navigator.languages || [navigator.language || "en"]) {
    if (pages[pref]) return pref;
    const base = pref.split("-")[0];
    if (base === "pt") return "pt-BR";
    if (pages[base]) return base;
  }
  return "en";
}

function renderPage(pages) {
  const lang = pickLanguage(pages);
  const page = pages[lang];
  document.documentElement.lang = lang;
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
