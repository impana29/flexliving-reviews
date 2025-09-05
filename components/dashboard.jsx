import React, { useMemo, useState, useEffect } from 'react';
import { hostawayMock } from '../data/mockReviews.js';
import { normalizeReviews } from '../utils/normalizeReviews.js';
import { useLocalStorage } from '../hooks/useLocalStorage.js';

export default function Dashboard() {
  const normalizedSeed = useMemo(() => normalizeReviews(hostawayMock), []);
  const [reviews, setReviews] = useLocalStorage('reviews_v1', normalizedSeed);

  const [filterProperty, setFilterProperty] = useState('all');
  const [filterChannel, setFilterChannel] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('dateDesc');

  // Seed if empty or non-existent
  useEffect(() => {
    if (!reviews || reviews.length === 0) setReviews(normalizedSeed);
  }, [reviews, normalizedSeed, setReviews]);

  function toggleApproval(id) {
    setReviews((prev = []) => prev.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r)));
  }

  function toggleVisible(id) {
    setReviews((prev = []) => prev.map((r) => (r.id === id ? { ...r, visiblePublic: !r.visiblePublic } : r)));
  }

  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const channels = Array.from(new Set(safeReviews.map((r) => r.channel)));
  const properties = Array.from(new Set(safeReviews.map((r) => r.listingId)));

  const filtered = safeReviews
    .filter((r) => {
      if (filterProperty !== 'all' && r.listingId !== filterProperty) return false;
      if (filterChannel !== 'all' && r.channel !== filterChannel) return false;
      if (r.rating < minRating) return false;
      return true;
    })
    .sort((a, b) => {
      const da = a.date ? new Date(a.date) : null;
      const db = b.date ? new Date(b.date) : null;
      if (sortBy === 'dateDesc') return db - da;
      if (sortBy === 'dateAsc') return da - db;
      if (sortBy === 'ratingDesc') return b.rating - a.rating;
      if (sortBy === 'ratingAsc') return a.rating - b.rating;
      return 0;
    });

  const perProperty = properties.map((pid) => {
    const list = safeReviews.filter((r) => r.listingId === pid);
    const avg = list.reduce((s, x) => s + x.rating, 0) / Math.max(1, list.length);
    return { listingId: pid, avg: Number(avg.toFixed(2)), total: list.length };
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manager Dashboard</h1>

      <section className="mb-6 grid md:grid-cols-3 gap-4">
        {perProperty.map((p) => (
          <div key={p.listingId} className="p-4 border rounded-lg">
            <div className="font-semibold">Property {p.listingId}</div>
            <div className="text-sm text-gray-600">Avg rating: {p.avg} ★</div>
            <div className="text-sm text-gray-600">Reviews: {p.total}</div>
          </div>
        ))}
      </section>

      <section className="mb-6 flex gap-3 items-center">
        <select value={filterProperty} onChange={(e) => setFilterProperty(e.target.value)} className="border p-2 rounded">
          <option value="all">All properties</option>
          {properties.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>

        <select value={filterChannel} onChange={(e) => setFilterChannel(e.target.value)} className="border p-2 rounded">
          <option value="all">All channels</option>
          {channels.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-2">
          Min rating:
          <input type="number" min="0" max="5" step="0.1" value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="w-20 border p-2 rounded" />
        </label>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
          <option value="dateDesc">Newest</option>
          <option value="dateAsc">Oldest</option>
          <option value="ratingDesc">Top rated</option>
          <option value="ratingAsc">Lowest rated</option>
        </select>
      </section>

      <section>
        <table className="w-full table-auto border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Property</th>
              <th className="p-2 border">Channel</th>
              <th className="p-2 border">Rating</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Preview</th>
              <th className="p-2 border">Approve</th>
              <th className="p-2 border">Visible on site</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b">
                <td className="p-2 text-center">{r.listingId}</td>
                <td className="p-2 text-center">{r.channel}</td>
                <td className="p-2 text-center">{r.rating} ★</td>
                <td className="p-2 text-center">{r.date ? new Date(r.date).toLocaleDateString() : '—'}</td>
                <td className="p-2">{(r.comment || '').slice(0, 80)}{r.comment && r.comment.length > 80 ? '...' : ''}</td>
                <td className="p-2 text-center">
                  <input type="checkbox" checked={r.approved || false} onChange={() => toggleApproval(r.id)} />
                </td>
                <td className="p-2 text-center">
                  <input type="checkbox" checked={r.visiblePublic || false} onChange={() => toggleVisible(r.id)} disabled={!r.approved} title={!r.approved ? 'Approve first' : ''} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="mt-4 text-sm text-gray-500">Notes: Approve reviews and then toggle "Visible on site" to show them on the public property page.</p>
    </div>
  );
}
