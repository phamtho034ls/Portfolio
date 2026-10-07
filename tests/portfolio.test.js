const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const html = fs.readFileSync(path.join(__dirname, "..", "index.html"), "utf8");
const body = html.slice(html.indexOf("<body>"), html.indexOf("</body>"));
const visible = body.replace(/<style>[\s\S]*?<\/style>|<script>[\s\S]*?<\/script>/gi, "");

test("is a self-contained Vietnamese page with inline styles and script", () => {
  assert.match(html, /<html lang="vi">/);
  assert.match(html, /<style>/);
  assert.match(html, /<script>/);
  assert.doesNotMatch(html, /<(?:link|script)[^>]+(?:styles\.css|index\.js)/);
});

test("contains the supplied profile, experience, and education copy", () => {
  assert.match(body, /AI Engineer tại VDCD Ninh Bình/);
  assert.match(body, /MindX Technology School/);
  assert.match(body, /React, Python, Scratch/);
  assert.match(body, /Cử nhân Trí tuệ nhân tạo/);
  assert.match(body, /id="certifications"/);
  assert.match(body, /Data Science<\/strong><span>Cole · 2025/);
  assert.match(body, /<strong>AI<\/strong><span>Cole · 2025/);
  assert.match(body, /LLMOps<\/strong><span>Cole · 2026/);
  assert.match(body, /retrieval quality, latency, caching, validation, security/);
});

test("keeps three featured projects and the smaller Japanese RAG project", () => {
  assert.equal((body.match(/class="case-study(?:\s|")/g) || []).length, 3);
  for (const project of ["Government AI Copilot", "OCR_V3", "Face AI", "Japanese Study RAG Chatbot"]) {
    assert.ok(body.includes(project), `Missing project: ${project}`);
  }
});

test("uses only public repository links and renders no unverified placeholders", () => {
  for (const repo of ["RAGCHATBOTV2", "FaceId", "ChatBotJPN"]) {
    assert.match(body, new RegExp(`github\\.com/Phamtho034ls/${repo}`, "i"));
  }
  const ocr = body.slice(body.indexOf('id="ocr-v3"'), body.indexOf('id="face-ai"'));
  assert.doesNotMatch(ocr, /github\.com|href="https?:/i);
  assert.doesNotMatch(body, /\[(?:TBD|TODO|bổ sung|điền|thêm ảnh)/i);
  assert.doesNotMatch(visible, /\b(?:Python|RAG|AI)\s+\d+%/i);
});

test("navigation targets existing sections and external links are safe", () => {
  const ids = new Set([...body.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id));
  for (const [, target] of body.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.has(target), `Missing anchor: ${target}`);
  for (const link of body.matchAll(/<a\b[^>]*target="_blank"[^>]*>/g)) {
    assert.match(link[0], /rel="noopener noreferrer"/);
  }
  assert.match(body, /href="#about">Giới thiệu/);
  assert.match(body, /href="#skills">Kỹ năng/);
});

test("supports mobile layout, focus, reduced motion, and accessible controls", () => {
  assert.match(html, /@media\s*\(max-width:\s*360px\)/);
  assert.match(html, /:focus-visible/);
  assert.match(html, /prefers-reduced-motion:\s*reduce/);
  assert.match(body, /aria-expanded/);
  assert.match(body, /navigator\.clipboard/);
  assert.match(body, /mailto:phamtho034ls@gmail\.com/);
});
