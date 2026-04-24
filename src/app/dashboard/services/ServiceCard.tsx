'use client';

import { useState } from 'react';
import Image from 'next/image';
import EditServiceForm from './EditServiceForm';
import { deleteServiceAction } from './actions';
import { formatPriceRange } from '@/lib/format';

type Service = {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price_min: number | null;
  price_max: number | null;
  price: number | null;
};

type Props = {
  service: Service;
};

export default function ServiceCard({ service }: Props) {
  const [isEditing, setIsEditing] = useState(false);

  const priceLabel = formatPriceRange(
    service.price_min,
    service.price_max,
    service.price,
  );

  if (isEditing) {
    return (
      <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-primary-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 text-base">
            Editing &ldquo;{service.name}&rdquo;
          </h3>
        </div>
        <EditServiceForm
          service={service}
          onClose={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white p-3 sm:p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3 sm:gap-5">
      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
        {service.image_url ? (
          <Image
            src={service.image_url}
            alt={service.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xl sm:text-2xl">
            <i className="fas fa-image" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-sm sm:text-lg text-gray-900 truncate">
          {service.name}
        </h3>
        {service.description && (
          <p className="text-xs sm:text-sm text-gray-500 line-clamp-2">
            {service.description}
          </p>
        )}
        {priceLabel && (
          <p className="text-primary-600 font-bold text-sm sm:text-base mt-0.5">{priceLabel}</p>
        )}
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-primary-50 text-primary-600 hover:bg-primary-500 hover:text-white transition-all flex items-center justify-center text-sm"
          aria-label={`Edit ${service.name}`}
        >
          <i className="fas fa-pen" />
        </button>
        <form action={deleteServiceAction}>
          <input type="hidden" name="id" value={service.id} />
          <button
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center text-sm"
            aria-label={`Delete ${service.name}`}
          >
            <i className="fas fa-trash" />
          </button>
        </form>
      </div>
    </div>
  );
}
