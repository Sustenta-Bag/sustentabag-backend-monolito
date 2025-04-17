/**
 * Script to open the coverage report in the default browser
 */
import { exec } from 'child_process';
import { platform } from 'os';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const reportPath = join(__dirname, 'coverage', 'index.html');
const reportUrl = `file://${reportPath.replace(/\\/g, '/')}`;

console.log('Opening coverage report in browser...');
console.log(`Report URL: ${reportUrl}`);

const openCommand = {
  win32: `start "" "${reportUrl}"`,
  darwin: `open "${reportUrl}"`,
  linux: `xdg-open "${reportUrl}"`
}[platform()];

if (!openCommand) {
  console.error(`Unsupported platform: ${platform()}`);
  process.exit(1);
}

exec(openCommand, (error) => {
  if (error) {
    console.error(`Error opening browser: ${error.message}`);
    process.exit(1);
  }
  console.log('Browser opened successfully!');
}); 