import { rmSync, cpSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT = resolve(ROOT, 'dist');

// Clean & recreate dist/
rmSync(OUT, { recursive: true, force: true });
mkdirSync(resolve(OUT, 'icons'), { recursive: true });

// Copy all extension files
const files = [
  'manifest.json',
  'background.js',
  'content.js',
  'popup.html',
  'popup.js',
  'popup.css',
  'options.html',
  'options.js',
  'options.css',
  'turndown.js',
  'turndown-plugin-gfm.js',
  'marked.min.js',
];

for (const f of files) {
  cpSync(resolve(ROOT, f), resolve(OUT, f));
}

// Copy icons
for (const size of ['16', '32', '48', '128']) {
  cpSync(resolve(ROOT, 'icons', `icon${size}.png`), resolve(OUT, 'icons', `icon${size}.png`));
}

// Sync version from package.json into manifest.json
const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
const manifestPath = resolve(OUT, 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
manifest.version = pkg.version;
manifest.version_name = pkg.version;
writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

console.log(`Built v${pkg.version} -> dist/`);
