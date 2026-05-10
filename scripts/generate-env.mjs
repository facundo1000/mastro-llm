import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// Parse .env file if present
const dotenv = {};
try {
  const raw = readFileSync(resolve(root, '.env'), 'utf-8');
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    dotenv[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
} catch {
  // .env not found — fall through to defaults
}

// Shell env takes precedence over .env (CI/CD)
const apiUrl = process.env['API_URL'] ?? dotenv['API_URL'] ?? 'http://localhost:8080';
const authToken = process.env['AUTH_TOKEN'] ?? dotenv['AUTH_TOKEN'] ?? '';

const outDir = resolve(root, 'src/environments');
mkdirSync(outDir, { recursive: true });

writeFileSync(
  resolve(outDir, 'environment.ts'),
  `// Auto-generated from .env — do not edit manually.\nexport const environment = {\n  apiUrl: '${apiUrl}',\n  authToken: '${authToken}',\n};\n`,
  'utf-8',
);

console.log(`[generate-env] API_URL=${apiUrl}  AUTH_TOKEN=${authToken ? '***' : '(empty)'}`);