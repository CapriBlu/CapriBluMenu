import test from "node:test";
import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { buildBirdJourney } from "../bird-motion.mjs";
const root = new URL("../../", import.meta.url),
  read = async (p) => JSON.parse(await readFile(new URL(p, root), "utf8"));
test("All locales contain every explicit interface and catalog key", async () => {
  const base = await read("site-locales/it.json");
  for (const lang of ["en", "es", "pt", "pl", "de", "fr", "vi"]) {
    const copy = await read("site-locales/" + lang + ".json");
    assert.deepEqual(Object.keys(copy).sort(), Object.keys(base).sort());
    assert(Object.values(copy).every((s) => typeof s === "string" && s.trim()));
  }
});
test("HTML bindings reference real translation keys", async () => {
  const copy = await read("site-locales/it.json");
  for (const page of ["shop.html", "vini.html"]) {
    const html = await readFile(new URL(page, root), "utf8");
    for (const m of html.matchAll(/data-i18n(?:-[a-z-]+)?="([^"]+)"/g))
      assert(m[1] in copy, m[1]);
    assert(!/<script>/.test(html));
    assert(!/<style>/.test(html));
  }
});
test("Catalog images exist and prices stay valid", async () => {
  const p = await read("data/boutique-products.json"),
    w = await read("data/wines.json");
  assert.equal(Object.keys(p).length, 11);
  assert.equal(w.length, 12);
  assert.equal(new Set(w.map((i) => i.id)).size, 12);
  for (const i of [...Object.values(p), ...w]) {
    await access(new URL(decodeURIComponent(i.image.split("?")[0]), root));
    assert(i.price);
  }
  assert(w.slice(-4).every((i) => i.price === "€ 25,00"));
});
test("Bird model has finite tracks and returns to its neutral pose at every screen width", () => {
  for (const distance of [80, 180, 350]) {
    const motion = buildBirdJourney(distance);
    assert(motion.duration > 0);
    const tracks = [
      motion.frames,
      motion.bagFrames,
      motion.wingFrames,
      ...Object.values(motion.legFrames),
      ...Object.values(motion.detailFrames),
    ];
    for (const frames of tracks) {
      assert.equal(frames[0].offset, 0);
      assert.equal(frames.at(-1).offset, 1);
      assert(
        frames.every((f) => !f.transform || !/NaN|Infinity/.test(f.transform)),
      );
    }
    assert.equal(
      motion.frames.at(-1).transform,
      "translate(0px, 0px) rotate(0deg) scale(1, 1)",
    );
    assert.notDeepEqual(
      motion.legFrames["leg-left"],
      motion.legFrames["leg-right"],
    );
  }
});

test("Data loading retries a transient failure and reports a persistent failure", async () => {
  const { loadJSON } = await import("../site-language.mjs");
  const original = globalThis.fetch;
  let calls = 0;
  try {
    globalThis.fetch = async () => {
      calls++;
      if (calls === 1) throw new Error("temporary");
      return { ok: true, json: async () => ({ loaded: true }) };
    };
    assert.deepEqual(await loadJSON("./data/wines.json"), { loaded: true });
    assert.equal(calls, 2);
    globalThis.fetch = async () => ({ ok: false });
    await assert.rejects(
      () => loadJSON("./data/wines.json"),
      /Resource unavailable/,
    );
  } finally {
    globalThis.fetch = original;
  }
});
