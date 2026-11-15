import {
  initLanguage,
  loadJSON,
  localizeItem,
  t,
  showLoadError,
} from "./site-language.mjs";
await initLanguage();

const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const sourceProducts = await loadJSON("./data/boutique-products.json").catch(
  showLoadError,
);
const products = Object.fromEntries(
  Object.entries(sourceProducts).map(([id, item]) => [
    id,
    localizeItem("products", id, item),
  ]),
);
const order = Object.keys(products),
  shelf = document.getElementById("productShelf"),
  track = document.getElementById("productTrack"),
  showroom = document.getElementById("showroom"),
  image = document.getElementById("productImage"),
  kicker = document.getElementById("productKicker"),
  title = document.getElementById("productTitle"),
  description = document.getElementById("productDescription"),
  price = document.getElementById("productPrice"),
  link = document.getElementById("productLink"),
  pairings = document.getElementById("pairings"),
  prev = document.getElementById("productPrev"),
  next = document.getElementById("productNext"),
  dots = document.getElementById("productDots");
let activeProduct = "limoncello",
  autoPaused = false,
  lastFrame = performance.now(),
  offset = 0,
  cycleWidth = 0,
  selectionVersion = 0;
order.forEach((key, i) => {
  const dot = document.createElement("button");
  dot.className = "dot" + (i === 0 ? " is-active" : "");
  dot.dataset.product = key;
  dot.type = "button";
  dot.setAttribute("aria-label", t("ui.show") + " " + products[key].title);
  dots.appendChild(dot);
});
async function selectProduct(key) {
  if (!products[key] || key === activeProduct) {
    selectionVersion++;
    showroom.classList.remove("is-switching");
    showroom.removeAttribute("aria-busy");
    return;
  }
  const version = ++selectionVersion,
    p = products[key],
    preview = new Image();
  showroom.setAttribute("aria-busy", "true");
  preview.src = p.image;
  try {
    await preview.decode();
  } catch {
    if (version === selectionVersion) showroom.removeAttribute("aria-busy");
    return;
  }
  if (version !== selectionVersion) return;
  showroom.classList.add("is-switching");
  setTimeout(
    () => {
      if (version !== selectionVersion) return;
      activeProduct = key;
      image.src = p.image;
      image.alt = p.title;
      kicker.textContent = p.kicker;
      title.textContent = p.title;
      description.textContent = p.description;
      price.textContent = p.price;
      link.classList.toggle("is-visible", !!p.link);
      if (p.link) link.href = p.link;
      pairings.classList.toggle("is-visible", !!p.pairings);
      showroom.style.setProperty("--glow-strong", p.glowStrong);
      showroom.style.setProperty("--glow-soft", p.glowSoft);
      document
        .querySelectorAll("[data-product]")
        .forEach((el) =>
          el.classList.toggle("is-active", el.dataset.product === key),
        );
      const i = order.indexOf(key);
      prev.disabled = i === 0;
      next.disabled = i === order.length - 1;
      showroom.classList.remove("is-switching");
      showroom.removeAttribute("aria-busy");
    },
    reducedMotion.matches ? 0 : 150,
  );
}
track.replaceChildren(
  ...order.map((key) => {
    const product = products[key],
      button = document.createElement("button");
    button.type = "button";
    button.className =
      "shelf-card" + (key === activeProduct ? " is-active" : "");
    button.dataset.product = key;
    button.setAttribute("aria-label", product.previewTitle);
    const preview = document.createElement("span");
    preview.className = "shelf-preview";
    const picture = document.createElement("img");
    picture.src = product.image.replace("/full/", "/thumbnails/");
    picture.alt = product.title;
    picture.width = picture.height = 200;
    picture.loading = "lazy";
    picture.decoding = "async";
    preview.append(picture);
    button.append(preview);
    return button;
  }),
);
const originals = [...track.children];
cycleWidth = track.scrollWidth;
originals.forEach((card) => track.appendChild(card.cloneNode(true)));
track.addEventListener("click", (e) => {
  const card = e.target.closest("[data-product]");
  if (!card) return;
  selectProduct(card.dataset.product);
  card.classList.add("is-preview");
  setTimeout(() => card.classList.remove("is-preview"), 650);
});
dots.addEventListener("click", (e) => {
  const dot = e.target.closest("[data-product]");
  if (dot) selectProduct(dot.dataset.product);
});
document
  .querySelectorAll(".pairing-item")
  .forEach((el) =>
    el.addEventListener("click", () => selectProduct(el.dataset.product)),
  );
function updateCarouselDepth() {
  const shelfRect = shelf.getBoundingClientRect(),
    center = shelfRect.left + shelfRect.width / 2,
    maxDistance = Math.max(shelfRect.width * 0.48, 1);
  let nearest = null,
    nearestDistance = Infinity;
  const positions = [...track.querySelectorAll(".shelf-card")].map((card) => ({
    card,
    r: card.getBoundingClientRect(),
  }));
  positions.forEach(({ card, r }) => {
    const cardCenter = r.left + r.width / 2,
      distance = Math.abs(cardCenter - center),
      normal = Math.min(distance / maxDistance, 1),
      scale = 1.16 - normal * 0.34,
      opacity = 1 - normal * 0.5,
      direction = cardCenter < center ? -1 : 1,
      rotate = direction * normal * 7,
      y = normal * 7;
    card.style.setProperty("--card-scale", scale.toFixed(3));
    card.style.setProperty("--card-opacity", opacity.toFixed(3));
    card.style.setProperty("--card-rotate", rotate.toFixed(2) + "deg");
    card.style.setProperty("--card-y", y.toFixed(2) + "px");
    card.style.setProperty("--card-z", String(100 - Math.round(normal * 80)));
    card.classList.remove("is-center");
    if (distance < nearestDistance) {
      nearest = card;
      nearestDistance = distance;
    }
  });
  if (nearest) nearest.classList.add("is-center");
}
let lastDepthUpdate = 0;
function autoLoop(now) {
  const dt = Math.min(now - lastFrame, 40);
  lastFrame = now;
  if (
    !reducedMotion.matches &&
    !autoPaused &&
    !document.hidden &&
    cycleWidth > 0
  ) {
    offset += dt * 0.026;
    if (offset >= cycleWidth) offset -= cycleWidth;
    track.style.transform = `translate3d(${-offset}px,0,0)`;
  }
  if (!document.hidden && now - lastDepthUpdate >= 32) {
    updateCarouselDepth();
    lastDepthUpdate = now;
  }
  requestAnimationFrame(autoLoop);
}
requestAnimationFrame(autoLoop);
shelf.addEventListener("pointerenter", () => (autoPaused = true));
shelf.addEventListener("pointerleave", () => (autoPaused = false));
shelf.addEventListener("pointerdown", (e) => {
  autoPaused = true;
  const card = e.target.closest(".shelf-card");
  if (card) card.classList.add("is-preview");
});
shelf.addEventListener("pointerup", (e) => {
  const card = e.target.closest(".shelf-card");
  if (card) setTimeout(() => card.classList.remove("is-preview"), 500);
  setTimeout(() => (autoPaused = false), 850);
});
shelf.addEventListener("pointercancel", () =>
  setTimeout(() => (autoPaused = false), 400),
);
prev.onclick = () => {
  const i = order.indexOf(activeProduct);
  if (i > 0) selectProduct(order[i - 1]);
};
next.onclick = () => {
  const i = order.indexOf(activeProduct);
  if (i < order.length - 1) selectProduct(order[i + 1]);
};
