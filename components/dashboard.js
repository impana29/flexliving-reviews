import React, { useMemo, useState } from 'react';
import { normalizeReviews } from '@/utils/normalizeReviews';
import { hostawayMock } from '@/data/mockReviews';
import useLocalStorage from '@/hooks/useLocalStorage';
import KPIOverview from './KPIOverview';
import TrendsCharts from './TrendsCharts';
import ReviewsTable from './ReviewsTable';
import extractKeywords from '@/utils/extractKeywords';

export default function Dashboard() {
  const seed = useMemo(() => normalizeReviews(hostawayMock), []);
  const [reviews, setReviews] = useLocalStorage('reviews_v1', seed);

  // UI state
  const [propertyFilter, setPropertyFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [dateRange, setDateRange] = useState({ from: null, to: null }); // null = unbounded
  const [sortBy, setSortBy] = useState('dateDesc');

  // Derived lists (guard against null)
  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const properties = Array.from(new Set(safeReviews.map((r) => r.listingId)));
  const channels = Array.from(new Set(safeReviews.map((r) => r.channel)));

  // Filtering function
  const filtered = useMemo(() => {
    return safeReviews
      .filter((r) => {
        if (propertyFilter !== 'all' && r.listingId !== propertyFilter) return false;
        if (channelFilter !== 'all' && r.channel !== channelFilter) return false;
        if (r.rating < minRating) return false;
        if (dateRange.from && r.date && new Date(r.date) < new Date(dateRange.from)) return false;
        if (dateRange.to && r.date && new Date(r.date) > new Date(dateRange.to)) return false;
        return true;
      })
      .sort((a, b) => {
        const da = a.date ? new Date(a.date) : 0;
        const db = b.date ? new Date(b.date) : 0;
        if (sortBy === 'dateDesc') return db - da;
        if (sortBy === 'dateAsc') return da - db;
        if (sortBy === 'ratingDesc') return b.rating - a.rating;
        if (sortBy === 'ratingAsc') return a.rating - b.rating;
        return 0;
      });
  }, [safeReviews, propertyFilter, channelFilter, minRating, dateRange, sortBy]);

  // KPI calculations
  const kpi = useMemo(() => {
    const perProperty = properties.map((pid) => {
      const list = safeReviews.filter((r) => r.listingId === pid);
      const avg = list.reduce((s, x) => s + x.rating, 0) / Math.max(1, list.length);
      const approved = list.filter((r) => r.approved).length;
      return {
        listingId: pid,
        avg: Number(avg.toFixed(2)),
        total: list.length,
        approvedCount: approved,
      };
    });
    const totalReviews = safeReviews.length;
    const totalApproved = safeReviews.filter((r) => r.approved).length;
    return { perProperty, totalReviews, totalApproved };
  }, [safeReviews, properties]);

  // Quick actions
  function toggleReviewApproval(id) {
    setReviews((prev = []) => prev.map((r) => (r.id === id ? { ...r, approved: !r.approved } : r)));
  }
  function toggleVisible(id) {
    setReviews((prev = []) => prev.map((r) => (r.id === id ? { ...r, visiblePublic: !r.visiblePublic } : r)));
  }

  // Keyword extraction for recurring issues (top 5)
  const keywords = useMemo(() => extractKeywords(filtered.map((r) => r.comment)), [filtered]);

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>

        <div className="flex items-center gap-3">
          <select value={propertyFilter} onChange={(e) => setPropertyFilter(e.target.value)} className="border p-2 rounded">
            <option value="all">All properties</option>
            {properties.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select value={channelFilter} onChange={(e) => setChannelFilter(e.target.value)} className="border p-2 rounded">
            <option value="all">All channels</option>
            {channels.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <input type="number" min="0" max="5" step="0.1" value={minRating} onChange={(e) => setMinRating(Number(e.target.value || 0))} className="w-20 border p-2 rounded" placeholder="Min ★" />

          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border p-2 rounded">
            <option value="dateDesc">Newest</option>
            <option value="dateAsc">Oldest</option>
            <option value="ratingDesc">Top rated</option>
            <option value="ratingAsc">Lowest rated</option>
          </select>
        </div>
      </header>

      <KPIOverview kpi={kpi} />

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <TrendsCharts reviews={filtered} allReviews={safeReviews} />
        </div>

        <aside className="space-y-4">
          <div className="p-4 border rounded-lg shadow-sm">
            <div className="font-semibold">Top Keywords</div>
            <div className="mt-2 text-sm text-gray-600">
              {keywords.length === 0 ? 'No keywords found' : keywords.slice(0, 8).map((k) => (
                <span key={k} className="inline-block mr-2 mb-2 bg-gray-100 px-2 py-1 rounded">{k}</span>
              ))}
            </div>
          </div>

          <div className="p-4 border rounded-lg shadow-sm">
            <div className="font-semibold">Quick Actions</div>
            <div className="mt-2 text-sm text-gray-600">
              Approve reviews to make them available for visibility toggle.
            </div>
          </div>
        </aside>
      </div>

      <ReviewsTable
        reviews={filtered}
        onToggleApproval={toggleReviewApproval}
        onToggleVisible={toggleVisible}
      />
    </div>
  );
}
