import { readFileSync } from "node:fs";

const html = readFileSync("index.html", "utf8");
const js = readFileSync("app.js", "utf8");
const css = readFileSync("styles.css", "utf8");
const failures = [];

function fail(message) {
  failures.push(message);
}

function unique(values) {
  return [...new Set(values)];
}

const htmlIds = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
const idSet = new Set(htmlIds);
const duplicates = htmlIds.filter((id, index) => htmlIds.indexOf(id) !== index);

if (duplicates.length) {
  fail(`Duplicate HTML ids: ${unique(duplicates).join(", ")}`);
}

const mapElementsBlock = js.match(/mapElements\(\[([\s\S]*?)\]\)/);
const mappedIds = mapElementsBlock ? [...mapElementsBlock[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]) : [];
const directIdSelectors = [...js.matchAll(/\$\("([^"]+)"\)/g)]
  .map((match) => match[1])
  .filter((selector) => selector.startsWith("#"))
  .map((selector) => selector.slice(1));
const referencedIds = unique([...mappedIds, ...directIdSelectors]);
const missingIds = referencedIds.filter((id) => !idSet.has(id));

if (missingIds.length) {
  fail(`JavaScript references missing ids: ${missingIds.join(", ")}`);
}

const symbolIds = new Set([...html.matchAll(/<symbol id="([^"]+)"/g)].map((match) => match[1]));
const iconRefs = unique([...html.matchAll(/href="#([^"]+)"/g)].map((match) => match[1]));
const missingSymbols = iconRefs.filter((id) => id.startsWith("icon-") && !symbolIds.has(id));

if (missingSymbols.length) {
  fail(`Missing SVG symbols: ${missingSymbols.join(", ")}`);
}

const sectionViews = unique([...html.matchAll(/id="([a-z]+)View"/g)].map((match) => match[1]));
const navViews = unique([...html.matchAll(/data-view="([^"]+)"/g)].map((match) => match[1]));
const jsViewsMatch = js.match(/const VIEWS = \[([^\]]+)\]/);
const jsViews = jsViewsMatch ? [...jsViewsMatch[1].matchAll(/"([^"]+)"/g)].map((match) => match[1]) : [];

for (const view of unique([...sectionViews, ...navViews, ...jsViews])) {
  if (!sectionViews.includes(view)) fail(`Missing section for view: ${view}`);
  if (!navViews.includes(view)) fail(`Missing nav button for view: ${view}`);
  if (!jsViews.includes(view)) fail(`Missing JS route for view: ${view}`);
}

const bannedCssPatterns = [
  [/font-size:[^;]*vw/i, "viewport-scaled font size"],
  [/gradient/i, "gradient decoration"],
  [/\borb\b/i, "orb decoration"],
  [/bokeh/i, "bokeh decoration"]
];

for (const [pattern, label] of bannedCssPatterns) {
  if (pattern.test(css)) fail(`CSS contains banned pattern: ${label}`);
}

const files = { "index.html": html, "app.js": js, "styles.css": css };
for (const [file, content] of Object.entries(files)) {
  if (/[^\x00-\x7F]/.test(content)) {
    fail(`${file} contains non-ASCII characters`);
  }
}

if (failures.length) {
  console.error("Quality check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Quality check passed: ${referencedIds.length} selectors, ${sectionViews.length} routed views, ${symbolIds.size} icons.`);
