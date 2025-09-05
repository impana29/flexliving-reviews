import React from 'react';

export default function KPIOverview({ kpi }) {
  // Show top 3 properties by average rating
  const topProps = (kpi.perProperty || []).slice().sort((a,b) => b.avg - a.avg).slice(0,3);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="p-4 border rounded-lg shadow-sm">
        <div className="text-sm text-gray-500">Total reviews</div>
        <div className="text-2xl font-bold">{kpi.totalReviews}</div>
      </div>

      <div className="p-4 border rounded-lg shadow-sm">
        <div className="text-sm text-gray-500">Approved</div>
        <div className="text-2xl font-bold">{kpi.totalApproved}</div>
      </div>

      <div className="p-4 border rounded-lg shadow-sm md:col-span-2">
        <div className="text-sm text-gray-500">Top Properties</div>
        <div className="mt-2 flex gap-4">
          {topProps.length === 0 ? <div className="text-gray-500">No properties</div> : topProps.map(p => (
            <div key={p.listingId} className="bg-gray-50 p-3 rounded w-full">
              <div className="text-sm text-gray-600">Property {p.listingId}</div>
              <div className="font-semibold">{p.avg} ★</div>
              <div className="text-xs text-gray-500">{p.total} reviews</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
