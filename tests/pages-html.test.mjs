import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("builds GitHub Pages without the Vinext navigation runtime", async () => {
  const html = await readFile(new URL("../dist/pages/index.html", import.meta.url), "utf8");

  assert.match(html, /\/city2049-reference\/assets\/index-[^"']+\.js/);
  assert.match(html, /\/city2049-reference\/assets\/index-[^"']+\.css/);
  assert.doesNotMatch(html, /__VINEXT_RSC_NAV__/);
});
