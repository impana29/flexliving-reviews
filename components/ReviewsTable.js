import React, { useMemo } from 'react';

export default function ReviewsTable({ reviews = [], onToggleApproval, onToggleVisible }) {
  const rows = useMemo(() => (Array.isArray(reviews) ? reviews : []), [reviews]);

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Reviews</h2>
        <div className="text-sm text-gray-500">Showing {rows.length} items</div>
      </div>

      {rows.length === 0 ? (
        <div className="p-6 text-center text-gray-500">No reviews found for the selected filters.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 border text-left">Property</th>
                <th className="p-2 border text-left">Channel</th>
                <th className="p-2 border text-left">Rating</th>
                <th className="p-2 border text-left">Comment</th>
                <th className="p-2 border text-left">Date</th>
                <th className="p-2 border text-center">Approve</th>
                <th className="p-2 border text-center">Visible</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="p-2">{r.listingId}</td>
                  <td className="p-2">{r.channel}</td>
                  <td className={`p-2 font-semibold ${r.rating >= 4 ? 'text-green-600' : r.rating >= 3 ? 'text-yellow-600' : 'text-red-600'}`}>{r.rating} ★</td>
                  <td className="p-2">{r.comment}</td>
                  <td className="p-2">{r.date ? new Date(r.date).toLocaleDateString() : '—'}</td>
                  <td className="p-2 text-center">
                    <input type="checkbox" checked={r.approved || false} onChange={() => onToggleApproval(r.id)} />
                  </td>
                  <td className="p-2 text-center">
                    <input type="checkbox" checked={r.visiblePublic || false} disabled={!r.approved} onChange={() => onToggleVisible(r.id)} title={!r.approved ? 'Approve first' : ''} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
