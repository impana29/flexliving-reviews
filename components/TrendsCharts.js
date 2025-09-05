import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

// Helper: group by day and compute average
function buildTimeSeries(reviews) {
  const map = new Map();
  reviews.forEach(r => {
    if (!r.date) return;
    const d = new Date(r.date);
    const key = d.toISOString().slice(0,10); // YYYY-MM-DD
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(r.rating);
  });
  const arr = Array.from(map.entries()).sort((a,b) => a[0].localeCompare(b[0]));
  return arr.map(([date, ratings]) => ({
    date,
    avg: Number((ratings.reduce((s,x) => s + x, 0) / ratings.length).toFixed(2))
  }));
}

function buildChannelBreakdown(allReviews) {
  const counts = {};
  allReviews.forEach(r => {
    const ch = r.channel || 'unknown';
    counts[ch] = (counts[ch] || 0) + 1;
  });
  return Object.keys(counts).map(k => ({ channel: k, count: counts[k] }));
}

export default function TrendsCharts({ reviews = [], allReviews = [] }) {
  const timeseries = useMemo(() => buildTimeSeries(reviews), [reviews]);
  const breakdown = useMemo(() => buildChannelBreakdown(allReviews), [allReviews]);

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <div className="font-semibold mb-2">Average rating (time)</div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeseries}>
              <XAxis dataKey="date" />
              <YAxis domain={[0,5]} />
              <Tooltip />
              <Line type="monotone" dataKey="avg" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="p-4 border rounded-lg">
        <div className="font-semibold mb-2">Channel breakdown</div>
        <div style={{ height: 220 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={breakdown}>
              <XAxis dataKey="channel" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
