import { updateReviewById, readReviews } from '@/lib/reviewsStore';


export default async function handler(req, res) {
const { id } = req.query;


if (req.method === 'PATCH') {
const patch = req.body || {};
// sanitize patch: allow only approved and visiblePublic toggles
const allowed = {};
if ('approved' in patch) allowed.approved = !!patch.approved;
if ('visiblePublic' in patch) allowed.visiblePublic = !!patch.visiblePublic;


try {
const updated = await updateReviewById(id, allowed);
return res.status(200).json(updated);
} catch (err) {
if (err.message === 'Not found') return res.status(404).json({ error: 'Not found' });
console.error(err);
return res.status(500).json({ error: 'Failed to update' });
}
}


if (req.method === 'GET') {
try {
const reviews = await readReviews();
const r = reviews.find((x) => x.id === id);
if (!r) return res.status(404).json({ error: 'Not found' });
return res.status(200).json(r);
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Failed to read' });
}
}


return res.status(405).json({ error: 'Method not allowed' });
}
