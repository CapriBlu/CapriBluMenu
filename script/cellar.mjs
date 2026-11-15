import {
  initLanguage,
  loadJSON,
  localizeItem,
  t,
  showLoadError,
} from "./site-language.mjs";
await initLanguage();

const sourceWines = await loadJSON("./data/wines.json").catch(showLoadError);
const allWines = sourceWines.map((item) =>
  localizeItem("wines", item.id, item),
);
let wines = allWines;
let selected = -1;
let position = 0;
let last = 0;
let pauseUntil = 0;
const $ = (id) => document.getElementById(id);
const shelf = document.querySelector(".wine-shelf");
const allThumbs = allWines.map((wine, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "wine-thumb";
  button.dataset.index = index;
  button.setAttribute("aria-label", t("ui.choose") + " " + wine.name);
  button.setAttribute("aria-pressed", "false");
  const image = document.createElement("img");
  image.src = wine.image;
  image.alt = "";
  image.loading = "lazy";
  const label = document.createElement("span");
  label.textContent = wine.shortName;
  button.append(image, label);
  return button;
});
shelf.replaceChildren(...allThumbs);
let thumbs = allThumbs;
const filters = [...document.querySelectorAll("[data-wine-filter]")];
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
const stepSeconds = 7.5;
function cyclicDistance(i, p) {
  let d =
    ((((i - p + wines.length / 2) % wines.length) + wines.length) %
      wines.length) -
    wines.length / 2;
  return d;
}
function showMetadata(id, key, value) {
  const element = $(id);
  element.hidden = !value;
  const label = document.createElement("b");
  label.textContent = t(key);
  element.replaceChildren(...(value ? [label, " " + value] : []));
}
function showWine(index) {
  const i = (index + wines.length) % wines.length;
  if (i === selected) return;
  selected = i;
  const w = wines[i];
  const img = $("featuredWineImage");
  img.src = w.image;
  img.alt = w.alt;
  $("wineTitle").textContent = w.name;
  $("wineMaker").textContent = w.maker;
  showMetadata("wineGrapes", "wine.grapes", w.grapes);
  showMetadata("wineVintage", "wine.vintage", w.year);
  $("wineDescription").textContent = w.description;
  $("winePrice").textContent = w.price;
  $("wineCounter").textContent = t("ui.counter")
    .replace("{n}", i + 1)
    .replace("{total}", wines.length);
}
function paint() {
  const width = shelf.clientWidth;
  const spacing =
    width <= 470
      ? Math.min(100, width * 0.29)
      : width <= 800
        ? Math.min(155, width * 0.225)
        : Math.min(198, width * 0.19);
  let closest = 0,
    minimum = Infinity;
  thumbs.forEach((button, i) => {
    const d = cyclicDistance(i, position);
    const a = Math.abs(d);
    const scale = a <= 1 ? 1.2 - 0.2 * a : a <= 2 ? 1 - 0.2 * (a - 1) : 0.8;
    const opacity =
      a <= 1
        ? 1 - 0.12 * a
        : a <= 2
          ? 0.88 - 0.35 * (a - 1)
          : Math.max(0, 0.53 - (a - 2) * 0.5);
    button.style.setProperty("--x", Math.round(d * spacing * 100) / 100 + "px");
    button.style.setProperty("--scale", scale.toFixed(3));
    button.style.setProperty("--opacity", opacity.toFixed(3));
    button.style.zIndex = String(Math.max(1, 10 - Math.round(a * 2)));
    const visible = a < 2.8;
    button.style.pointerEvents = visible ? "auto" : "none";
    button.tabIndex = visible ? 0 : -1;
    button.setAttribute("aria-hidden", visible ? "false" : "true");
    if (a < minimum) {
      minimum = a;
      closest = i;
    }
  });
  showWine(closest);
  thumbs.forEach((b, i) => {
    const active = i === selected;
    b.classList.toggle("active", active);
    b.setAttribute("aria-pressed", String(active));
  });
}
function choose(i) {
  const d = cyclicDistance(i, position);
  position = (position + d + wines.length) % wines.length;
  pauseUntil = performance.now() + 5500;
  paint();
}
allThumbs.forEach((button) =>
  button.addEventListener("click", () => {
    const i = thumbs.indexOf(button);
    if (i >= 0) choose(i);
  }),
);
filters.forEach((button) =>
  button.addEventListener("click", () => {
    const type = button.dataset.wineFilter;
    wines =
      type === "tutti" ? allWines : allWines.filter((w) => w.type === type);
    thumbs = allThumbs.filter((thumb, i) => {
      const included = type === "tutti" || allWines[i].type === type;
      thumb.hidden = !included;
      thumb.tabIndex = -1;
      thumb.setAttribute("aria-hidden", String(!included));
      thumb.classList.remove("active");
      thumb.setAttribute("aria-pressed", "false");
      return included;
    });
    filters.forEach((filter) =>
      filter.setAttribute("aria-pressed", String(filter === button)),
    );
    selected = -1;
    position = 0;
    last = 0;
    pauseUntil = performance.now() + 5500;
    $("winePrev").disabled = $("wineNext").disabled = wines.length < 2;
    paint();
  }),
);
$("winePrev").addEventListener("click", () =>
  choose((selected - 1 + wines.length) % wines.length),
);
$("wineNext").addEventListener("click", () =>
  choose((selected + 1) % wines.length),
);
shelf.addEventListener("pointerenter", () => {
  pauseUntil = Infinity;
});
shelf.addEventListener("pointerleave", () => {
  pauseUntil = performance.now() + 1400;
});
shelf.addEventListener("focusin", () => {
  pauseUntil = Infinity;
});
shelf.addEventListener("focusout", () => {
  setTimeout(() => {
    if (!shelf.contains(document.activeElement))
      pauseUntil = performance.now() + 3000;
  }, 0);
});
document.addEventListener("keydown", (e) => {
  if (e.target.closest("input,textarea,select")) return;
  if (e.key === "ArrowRight") {
    e.preventDefault();
    choose((selected + 1) % wines.length);
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    choose((selected - 1 + wines.length) % wines.length);
  }
});
function frame(now) {
  const delta = last ? Math.min((now - last) / 1000, 0.08) : 0;
  last = now;
  if (
    wines.length > 1 &&
    !reduced.matches &&
    !document.hidden &&
    now > pauseUntil
  )
    position = (position + delta / stepSeconds) % wines.length;
  paint();
  requestAnimationFrame(frame);
}
window.addEventListener("resize", paint);
requestAnimationFrame(frame);
