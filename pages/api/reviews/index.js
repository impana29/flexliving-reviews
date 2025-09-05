import { readReviews } from '@/lib/reviewsStore';


export default async function handler(req, res) {
if (req.method === 'GET') {
try {
const reviews = await readReviews();
// Convert isoDate to Date objects on server side if needed by server logic; return iso strings to the client
return res.status(200).json(reviews);
} catch (err) {
console.error(err);
return res.status(500).json({ error: 'Failed to read reviews' });
}
}


return res.status(405).json({ error: 'Method not allowed' });
}
