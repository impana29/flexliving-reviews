import React, { useState } from 'react';
import { properties } from '../data/properties.js';

export default function PropertyDetails({ property, approvedReviews = [] }) {
  const [mainImage, setMainImage] = useState(property.images?.[0] || '/images/placeholder.jpg');

  return (
    <div className="max-w-5xl mx-auto my-8 p-4">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="md:flex">
          <div className="md:w-2/3">
            <div className="relative">
              <img src={mainImage} alt={property.title} className="w-full h-80 object-cover" />
              <div className="absolute bottom-3 left-3 flex gap-2">
                {property.images.map((img, idx) => (
                  <img key={idx} src={img} onClick={() => setMainImage(img)} className={`w-20 h-14 object-cover rounded-lg border-2 ${img === mainImage ? 'border-blue-600' : 'border-transparent'}`} />
                ))}
              </div>
            </div>
          </div>

          <div className="md:w-1/3 p-6 flex flex-col justify-between">
            <div>
              <h1 className="text-2xl font-bold">{property.title}</h1>
              <div className="text-sm text-gray-500">{property.address}</div>

              <div className="mt-3 text-gray-700">
                <div>
                  {property.bedrooms} Beds • {property.bathrooms} Baths • {property.size} sqft
                </div>
              </div>

              <div className="mt-4 font-semibold text-xl">{property.price}</div>
            </div>

            <div className="mt-4">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg">Enquire Now</button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t">
          <h2 className="text-lg font-semibold mb-3">About this property</h2>
          <p className="text-gray-700">A lovely property managed by Flex Living — clean, comfortable, and centrally located.</p>
        </div>

        {/* Approved Reviews Section */}
        <div className="p-6 border-t">
          <h2 className="text-xl font-semibold mb-4">Guest Reviews</h2>
          {approvedReviews.length === 0 ? (
            <div className="text-gray-500">No reviews selected for display yet.</div>
          ) : (
            <ul className="space-y-4">
              {approvedReviews.map((rv) => (
                <li key={rv.id} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-semibold">{rv.respondent || 'Guest'}</div>
                    <div className="text-yellow-500 font-medium">{rv.rating} ★</div>
                  </div>
                  <div className="text-gray-700 mb-2">{rv.comment}</div>
                  <div className="text-sm text-gray-400">{rv.date ? new Date(rv.date).toLocaleDateString() : '—'} • {rv.channel}</div>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}
