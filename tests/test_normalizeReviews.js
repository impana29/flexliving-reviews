import assert from 'assert';
import { normalizeReviews } from '../utils/normalizeReviews.js';
import { hostawayMock } from '../data/mockReviews.js';

export function run() {
  console.log('Running normalizeReviews tests...');

  const normalized = normalizeReviews(hostawayMock);

  // --- original assertions (kept) ---
  assert(Array.isArray(normalized), 'normalizeReviews should return an array');
  assert(normalized.length === hostawayMock.length, 'normalized length should match input length');

  const r1 = normalized.find((r) => r.id === 'r1');
  assert(r1, 'r1 must exist');
  assert(typeof r1.date === 'object' && r1.date instanceof Date, 'date should be a Date object');
  assert(typeof r1.isoDate === 'string' && r1.isoDate.length > 0, 'isoDate should be a non-empty string');
  assert(typeof r1.rating === 'number', 'rating must be a number');
  assert(r1.rating === 4.8, 'r1 rating should equal 4.8');

  const empty = normalizeReviews([]);
  assert(Array.isArray(empty) && empty.length === 0, 'Empty input should return empty array');

  const rWithFlags = normalized[0];
  assert('approved' in rWithFlags && 'visiblePublic' in rWithFlags, 'flags approved and visiblePublic must exist');

  // --- NEW assertions ---
  const anyChannel = normalized.find((x) => x.channel === 'airbnb');
  assert(anyChannel, 'channel should be lowercased to airbnb');

  const abnormal = normalizeReviews([{ id: 'x1', listingId: '999', channel: 'Test', rating: 5 }]);
  assert(abnormal.length === 1, 'should return 1 normalized entry');
  assert(abnormal[0].isoDate === null, 'isoDate should be null if input date missing');

  assert(abnormal[0].approved === false && abnormal[0].visiblePublic === false, 'flags should default to false');

  console.log('All normalizeReviews tests passed ✔️');
}
