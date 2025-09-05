export function normalizeReviews(raw = []) {
  return raw
    .map((r) => {
      const parsedDate = r && r.date ? new Date(r.date) : null;
      return {
        id: r?.id ?? null,
        listingId: String(r?.listingId ?? ''),
        reviewType: (r?.reviewType ?? 'guest').toLowerCase(),
        channel: (r?.channel ?? 'unknown').toLowerCase(),
        date: parsedDate,
        isoDate: parsedDate ? parsedDate.toISOString() : null,
        rating: Number(r?.rating ?? 0),
        comment: r?.comment ?? '',
        respondent: r?.respondent ?? '',
        approved: !!r?.approved,
        visiblePublic: !!r?.visiblePublic
      };
    })
    // Remove malformed entries without id or listingId
    .filter((nr) => nr.id !== null && nr.listingId !== '');
}
