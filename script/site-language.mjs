let language = "it",
  copy = {},
  fallback = {};
export async function loadJSON(path) {
  const url = new URL(path, new URL("../", import.meta.url));
  url.searchParams.set("v", "refactor-20261115-1");
  let failure;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Resource unavailable: " + path);
      return await response.json();
    } catch (error) {
      failure = error;
    }
  }
  throw failure;
}
export function t(key, otherwise = "") {
  return copy[key] ?? fallback[key] ?? otherwise;
}
export function localizeItem(group, id, item) {
  const result = { ...item };
  for (const field of [
    "title",
    "name",
    "description",
    "grapes",
    "kicker",
    "previewTitle",
    "shortName",
  ])
    if (item[field])
      result[field] = t(group + "." + id + "." + field, item[field]);
  return result;
}
export async function initLanguage() {
  const names = {
    it: "Italiano",
    en: "English",
    es: "Español",
    pt: "Português",
    pl: "Polski",
    de: "Deutsch",
    fr: "Français",
    vi: "Tiếng Việt",
  };
  let saved;
  try {
    saved = localStorage.getItem("capriblu-menu-language");
  } catch {}
  const requested = new URL(location.href).searchParams.get("lang");
  language = names[requested] ? requested : names[saved] ? saved : "it";
  fallback = await loadJSON("./site-locales/it.json").catch(() => ({}));
  try {
    copy =
      language === "it"
        ? fallback
        : await loadJSON("./site-locales/" + language + ".json");
  } catch {
    copy = fallback;
    language = "it";
  }
  document.documentElement.lang = language;
  for (const el of document.querySelectorAll("[data-i18n]"))
    el.textContent = t(el.dataset.i18n, el.textContent);
  for (const attr of ["aria-label", "alt"])
    for (const el of document.querySelectorAll("[data-i18n-" + attr + "]"))
      el.setAttribute(
        attr,
        t(el.getAttribute("data-i18n-" + attr), el.getAttribute(attr)),
      );
  const select = document.createElement("select");
  select.className = "site-language";
  select.setAttribute("aria-label", "Language");
  for (const [code, name] of Object.entries(names)) {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = name;
    select.append(option);
  }
  select.value = language;
  const header = document.querySelector(".wine-header");
  if (header) header.insertBefore(select, header.lastElementChild);
  else {
    const back = document.querySelector(".back-button"),
      bar = document.createElement("div");
    bar.className = "site-language-bar";
    back.before(bar);
    bar.append(back, select);
  }
  select.addEventListener("change", () => {
    try {
      localStorage.setItem("capriblu-menu-language", select.value);
    } catch {}
    const url = new URL(location.href);
    url.searchParams.set("lang", select.value);
    location.href = url.href;
  });
  document.querySelectorAll("a[href]").forEach((a) => {
    const u = new URL(a.href);
    if (
      u.origin === location.origin &&
      (/\.html$/.test(u.pathname) || u.pathname.endsWith("/menu/"))
    ) {
      u.searchParams.set("lang", language);
      a.href = u.href;
    }
  });
  return language;
}

export function showLoadError(error) {
  const parent = document.querySelector(".showroom,.wine-showroom");
  const message = document.createElement("p"),
    retry = document.createElement("button");
  message.setAttribute("role", "alert");
  message.textContent = t("ui.loadError", "Caricamento non riuscito. Riprova.");
  retry.type = "button";
  retry.className = "site-language";
  retry.textContent = t("ui.retry", "Riprova");
  retry.addEventListener("click", () => location.reload());
  parent.prepend(message, retry);
  throw error;
}
