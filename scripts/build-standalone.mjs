import assert from 'node:assert/strict';
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, extname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

// Run from any directory: node scripts/build-standalone.mjs
// This is a deterministic export of dist/, not a second source for the app.
// Original images remain byte-for-byte unchanged inside their data URIs.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const outputName = 'Cocina_Cubana_Recetario.html';
const outputPath = join(dist, outputName);
const embedImages = process.argv.includes('--embed-images');
const publishedAssets = 'https://centinell2025.github.io/cocina-cubana-/dist/';
const read = name => readFileSync(join(dist, name), 'utf8');
const json = name => JSON.parse(read(name));
const localPath = path => path.replace(/^\.\//, '').split(/[?#]/, 1)[0];
const mimeTypes = {
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.avif': 'image/avif', '.ico': 'image/x-icon'
};

function imageFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))
    .flatMap(entry => {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) return imageFiles(path);
      return entry.isFile() && mimeTypes[extname(entry.name).toLowerCase()] ? [path] : [];
    });
}

// Only files under assets/ are scanned; a previous standalone HTML is never read.
const assetImages = {};
for (const path of imageFiles(join(dist, 'assets'))) {
  const key = relative(dist, path).split(sep).join('/');
  assetImages[key] = embedImages ? 'data:' + mimeTypes[extname(path).toLowerCase()] + ';base64,' + readFileSync(path).toString('base64') : publishedAssets + key;
}
assert.ok(Object.keys(assetImages).length, 'No image assets were found.');

function imageURI(path) {
  if (/^(?:data:|#)/i.test(path)) return path;
  const key = localPath(path);
  assert.ok(assetImages[key], 'Missing or unsupported standalone image: ' + path);
  return assetImages[key];
}

// Escaping '<' prevents text containing </script> from closing a data block.
function scriptJSON(value) {
  return JSON.stringify(value)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}
function inlineScript(source) {
  return source.replace(/<\/script/gi, '<\\/script');
}
function attribute(tag, name) {
  const match = tag.match(new RegExp('\\b' + name + '\\s*=\\s*(["\x27])(.*?)\\1', 'i'));
  return match?.[2] || '';
}

const edition = {
  recipes: json('recipes.json'),
  sources: json('sources.json'),
  heritage: json('heritage.json'),
  hauteCuisine: json('haute-cuisine.json'),
  meatCuts: json('meat-cuts.json'),
  collections: json('collections.json')
};
assert.ok(edition.recipes.length > 0, 'The edition must contain recipes.');
assert.ok(Array.isArray(edition.sources), 'Source references must be an array.');
assert.ok(edition.heritage && edition.hauteCuisine, 'The cultural and culinary modules are required.');

let css = read('styles.css');
assert.ok(!/@import\b/i.test(css), 'Resolve CSS imports before exporting.');
css = css.replace(/url\(\s*(?:(["'])(.*?)\1|([^\s)]+))\s*\)/gi,
  (_whole, _quote, quotedPath, barePath) => 'url("' + imageURI(quotedPath ?? barePath) + '")');
assert.ok(!/<\/style/i.test(css), 'Unexpected closing style tag in CSS.');
css += '\n/* Controls that do not apply to the downloaded edition. */\n' +
  '#install-button,[data-install],a[href*="' + outputName + '"]{display:none!important}\n';

let app = read('app.js');
const lines = app.split('\n');
const loaders = lines.map((line, index) => ({ line, index }))
  .filter(({ line }) => line.includes('if(window.__embeddedEdition)'));
assert.equal(loaders.length, 1, 'Expected one embedded/network loader in app.js.');
assert.ok(/\bfetch\s*\(\s*(['"])recipes\.json(?:\?[^'"]*)?\1\s*\)/.test(loaders[0].line),
  'The network loader changed; review the standalone export transform.');
lines[loaders[0].index] = '  ({recipes,sources,heritage,hauteCuisine,meatCuts,collections}=window.__embeddedEdition);window.__offlineReady=true;';
const serviceWorkers = lines.map((line, index) => ({ line, index }))
  .filter(({ line }) => line.includes("if(!window.__embeddedEdition&&'serviceWorker'in navigator)"));
assert.equal(serviceWorkers.length, 1, 'Expected one service-worker setup block.');
lines[serviceWorkers[0].index] = '  // The downloaded edition already contains every resource; no service worker is registered.';
app = lines.join('\n');

// Adjust only the exported copy, so file:// users do not receive hosting instructions.
const offlineHelp = '<section class="help-card"><h2>Tu edición HTML</h2>' +
  '<p>Este archivo contiene las ' + edition.recipes.length + ' recetas, las fuentes, el recorrido cultural y las herramientas de cocina. Puedes abrirlo directamente en un navegador compatible. ' + (embedImages ? 'Las imágenes también están incluidas; puedes consultar todo sin conexión.' : 'Las imágenes se cargan desde la página publicada y necesitan conexión a internet.') + '</p>' +
  '<p>Los enlaces de las referencias necesitan internet cuando decidas visitarlos. La lectura en voz alta depende de las voces disponibles en tu dispositivo.</p>' +
  '<p id="offline-status-text" class="footnote">Las recetas están incluidas en el archivo; no requiere instalación.</p>' +
  '<p>La conservación de favoritos y notas al abrir archivos locales depende del navegador. Exporta una copia de tus datos antes de mover o reemplazar este archivo.</p></section>';
app = app.replace(/<section class="help-card"><h2>Instalar y usar sin conexión<\/h2>[\s\S]*?<\/section>/, offlineHelp);
assert.ok(!/\bfetch\s*\(/.test(app), 'Standalone JavaScript still contains a fetch call.');
assert.ok(!/serviceWorker\.register\s*\(/.test(app), 'Standalone JavaScript still registers a service worker.');
new vm.Script(app, { filename: 'standalone-app.js' });

const payload = 'window.__embeddedEdition=' + scriptJSON(edition) + ';\n' +
  'window.__assetImages=' + scriptJSON(assetImages) + ';\n';
new vm.Script(payload, { filename: 'standalone-data.js' });

let html = read('index.html');
let styleCount = 0;
html = html.replace(/<link\b[^>]*>/gi, tag => {
  const rel = attribute(tag, 'rel').toLowerCase();
  const href = attribute(tag, 'href');
  if (rel === 'manifest') return '';
  if (rel === 'stylesheet') {
    assert.equal(localPath(href), 'styles.css', 'Unexpected stylesheet: ' + href);
    styleCount++;
    return '<style id="standalone-styles">\n' + css + '\n</style>';
  }
  if (rel.split(/\s+/).includes('icon') || rel === 'apple-touch-icon') {
    return tag.replace(href, imageURI(href));
  }
  assert.ok(!href || /^(?:data:|#)/i.test(href), 'Unexpected linked resource: ' + href);
  return tag;
});
assert.equal(styleCount, 1, 'Expected exactly one app stylesheet.');

// Embed any static images in index.html as well as the dynamically rendered ones.
html = html.replace(/\b(src|poster)=(['"])(assets\/[^'"]+)\2/g,
  (_whole, name, quote, path) => name + '=' + quote + imageURI(path) + quote);
let appCount = 0;
html = html.replace(/<script\b[^>]*\bsrc=(['"])(.*?)\1[^>]*>\s*<\/script>/gi,
  (_whole, _quote, src) => {
    assert.equal(localPath(src), 'app.js', 'Unexpected external script: ' + src);
    appCount++;
    return '<script id="standalone-data">\n' + inlineScript(payload) + '</script>\n' +
      '<script id="standalone-app">\n' + inlineScript(app) + '\n</script>';
  });
assert.equal(appCount, 1, 'Expected exactly one app script.');
html = html.replace('<body>', '<body data-edition="standalone">');
assert.ok(!/<link\b[^>]*\brel=(['"])(?:stylesheet|manifest)\1/i.test(html), 'A linked dependency remains.');
assert.ok(!/<script\b[^>]*\bsrc=/i.test(html), 'An external script remains.');

// Reparse the exact inline JavaScript emitted to catch script-boundary escaping errors.
const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
assert.equal(scripts.length, 2, 'Expected data and app inline scripts only.');
scripts.forEach((match, index) => new vm.Script(match[1], { filename: 'exported-inline-' + index + '.js' }));
assert.ok(!/\bfetch\s*\(/.test(html), 'A fetch dependency remains in the HTML.');

writeFileSync(outputPath, html, 'utf8');
const bytes = Buffer.byteLength(html, 'utf8');
console.log('Created ' + outputPath);
console.log(JSON.stringify({ recipes: edition.recipes.length, images: Object.keys(assetImages).length,
  bytes, megabytes: +(bytes / 1_000_000).toFixed(2), inlineScripts: scripts.length,
  embeddedImages: embedImages, externalResources: embedImages ? 0 : Object.keys(assetImages).length, fetchCalls: 0, serviceWorkerRegistration: false }));
