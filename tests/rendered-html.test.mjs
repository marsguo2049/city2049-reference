import assert from "node:assert/strict";
import test from "node:test";

test("renders the core reference map and accessible filters", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, /<title>City2049 · 未来参考<\/title>/);
  assert.match(html, /aria-label="未来主题"/);
  assert.match(html, /aria-pressed="true"[^>]*><span>✦<\/span>全部未来/);
  assert.match(html, /class="filter-status"/);
});
