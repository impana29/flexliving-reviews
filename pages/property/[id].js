import { useRouter } from 'next/router';
import PropertyDetails from '../../components/PropertyDetails.jsx';
import { properties } from '../../data/properties.js';
import { useEffect, useState } from 'react';
import { useLocalStorage } from '../../hooks/useLocalStorage.js';
import { normalizeReviews } from '../../utils/normalizeReviews.js';
import { hostawayMock } from '../../data/mockReviews.js';

export default function PropertyPage() {
  const router = useRouter();
  const { id } = router.query;
  const [reviews] = useLocalStorage('reviews_v1', normalizeReviews(hostawayMock));
  const [approved, setApproved] = useState([]);

  useEffect(() => {
    if (!id) return;
    const approvedForProperty = (reviews || []).filter((r) => r.listingId === String(id) && r.approved && r.visiblePublic);
    setApproved(approvedForProperty);
  }, [id, reviews]);

  const prop = properties[id] || { id, title: 'Unknown property', address: '', images: ['/images/placeholder.jpg'], bedrooms: '-', bathrooms: '-', size: '-', price: '-' };

  return <PropertyDetails property={prop} approvedReviews={approved} />;
}
