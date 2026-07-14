import { readFileSync, writeFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

const pkg = JSON.parse(readFileSync(resolve(ROOT, 'package.json'), 'utf8'));
const manifestPath = resolve(ROOT, 'manifest.json');
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

manifest.version = pkg.version;
manifest.version_name = pkg.version;

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Synced manifest.json -> v${pkg.version}`);
