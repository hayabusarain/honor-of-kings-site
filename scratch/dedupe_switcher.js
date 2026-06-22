import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, '../src/app/[locale]/items/page.tsx');
let content = fs.readFileSync(filePath, 'utf8');

const marker = '{/* View Mode Switcher */}';
const parts = content.split(marker);

if (parts.length > 2) {
  console.log(`Found ${parts.length - 1} view mode switchers. Removing duplicate...`);
  
  // We want to keep the first one and discard the second one.
  // The structure is:
  // parts[0] + marker + parts[1] (which contains switcher 1 contents)
  // + marker + parts[2] (which contains switcher 2 contents)
  // Let's examine parts[2] to see where the second switcher ends.
  // The switcher wrapper is:
  // <div className="flex bg-slate-950 p-1 border border-slate-800 rounded-2xl">
  // ...
  // </div>
  // We can strip this div block from the beginning of parts[2] and keep the rest.
  
  const secondPart = parts[2];
  // Find the closing </div> of the switcher wrapper.
  // It is the first occurrence of `</div>` in parts[2].
  const closeDivIndex = secondPart.indexOf('</div>');
  
  if (closeDivIndex !== -1) {
    const cleanedSecondPart = secondPart.substring(closeDivIndex + '</div>'.length);
    content = parts[0] + marker + parts[1] + cleanedSecondPart;
    console.log('Successfully deduplicated view mode switcher.');
  } else {
    console.log('Error: closing div not found in parts[2]');
  }
} else {
  console.log(`Found ${parts.length - 1} view mode switchers. No deduplication needed.`);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Deduplication script completed.');
