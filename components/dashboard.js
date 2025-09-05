import React, { useEffect, useMemo, useState } from 'react';
function toggleApproval(id) {
const current = safeReviews.find((r) => r.id === id);
if (!current) return;
patchReview(id, { approved: !current.approved });
}


function toggleVisible(id) {
const current = safeReviews.find((r) => r.id === id);
if (!current) return;
patchReview(id, { visiblePublic: !current.visiblePublic });
}


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
<div className="font-semibold">Quick Actions</div>
<div className="mt-2 text-sm text-gray-600">Approve reviews to make them available for visibility toggle.</div>
</div>
</aside>
</div>


{loading ? <div>Loading...</div> : (
<ReviewsTable reviews={filtered} onToggleApproval={toggleApproval} onToggleVisible={toggleVisible} />
)}
</div>
);
}
