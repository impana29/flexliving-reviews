import { promises as fs } from 'fs';
import path from 'path';


const DB_PATH = path.join(process.cwd(), 'data', 'reviews-db.json');


export async function readReviews() {
try {
const raw = await fs.readFile(DB_PATH, 'utf8');
const parsed = JSON.parse(raw);
// Ensure date fields are strings (iso) in stored file; API will convert to Date where needed
return parsed;
} catch (err) {
if (err.code === 'ENOENT') return [];
throw err;
}
}


export async function writeReviews(data) {
// atomic-ish write: write to temp file then rename
const tmp = DB_PATH + '.tmp';
await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
await fs.rename(tmp, DB_PATH);
return true;
}


export async function updateReviewById(id, patch = {}) {
const reviews = await readReviews();
const idx = reviews.findIndex((r) => r.id === id);
if (idx === -1) throw new Error('Not found');
const updated = { ...reviews[idx], ...patch };
reviews[idx] = updated;
await writeReviews(reviews);
return updated;
}
