"use client";

import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { MessageCircle, Phone, CalendarCheck } from 'lucide-react';
import { CarGallery } from '@/components/CarGallery';
import { ContactSellerDialog } from '@/components/ContactSellerDialog';
import { ReservationDialog } from '@/components/ReservationDialog';
import { Car } from '@/data/car-management';

interface CarDetailsProps {
  car: Car;
}

export const CarDetails = ({ car }: CarDetailsProps) => {
  if (!car) {
    return <p className="text-center text-lg">Véhicule non trouvé.</p>;
  }

  const isForSale = car.type === 'sale' || car.type === 'both';
  const isForRent = car.type === 'rent' || car.type === 'both';

  const carTypeLabel = car.type === 'sale' ? 'À vendre' : car.type === 'rent' ? 'À louer' : 'À vendre et à louer';
  const whatsappMessage = encodeURIComponent(
    `Bonjour, je suis intéressé(e) par le véhicule "${car.brand} ${car.model}" (${carTypeLabel}) que j'ai vu sur votre site. J'aimerais avoir plus d'informations.`
  );
  const whatsappPhoneNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER || '221771234567';

  const allImages = car.imageUrl ? [car.imageUrl, ...car.images] : car.images;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Car Gallery */}
        <div>
          {allImages.length > 0 || (car.videos && car.videos.length > 0) ? (
            <CarGallery images={allImages} videos={car.videos} />
          ) : (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <p className="text-gray-500 dark:text-gray-400">Aucune image ou vidéo disponible</p>
            </div>
          )}
        </div>

        {/* Car Information */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">{car.brand} {car.model}</h1>
          
          {isForSale && car.salePrice && (
            <p className="text-4xl font-extrabold text-primary">Prix de vente: {car.salePrice} FCFA</p>
          )}
          {isForRent && car.rentPricePerDay && (
            <p className="text-4xl font-extrabold text-primary">Prix de location: {car.rentPricePerDay} FCFA/jour</p>
          )}
          {(!isForSale && !isForRent) && (
            <p className="text-4xl font-extrabold text-primary">Prix non spécifié</p>
          )}

          <div className="grid grid-cols-2 gap-4 text-lg">
            <div>
              <span className="font-semibold">Année:</span> {car.year}
            </div>
            <div>
              <span className="font-semibold">Kilométrage:</span> {car.mileage} km
            </div>
            <div>
              <span className="font-semibold">Carburant:</span> {car.fuel}
            </div>
            <div>
              <span className="font-semibold">Transmission:</span> {car.transmission}
            </div>
            <div>
              <span className="font-semibold">Localisation:</span> {car.location}
            </div>
            <div>
              <span className="font-semibold">Type:</span> {carTypeLabel}
            </div>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-6">Description</h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {car.description}
          </p>

          {car.features && car.features.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mt-6">Caractéristiques Clés</h2>
              <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
                {car.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {/* Le bouton "Contacter le vendeur" apparaît UNIQUEMENT si la voiture est de type 'sale' */}
            {car.type === 'sale' && (
              <ContactSellerDialog carName={`${car.brand} ${car.model}`}>
                <Button size="lg" className="flex-1">
                  <MessageCircle className="mr-2 h-5 w-5" /> Contacter le vendeur
                </Button>
              </ContactSellerDialog>
            )}
            {/* Le bouton "Réserver maintenant" apparaît si la voiture est de type 'rent' ou 'both' */}
            {(car.type === 'rent' || car.type === 'both') && (
              <ReservationDialog carName={`${car.brand} ${car.model}`}>
                <Button size="lg" className="flex-1">
                  <CalendarCheck className="mr-2 h-5 w-5" /> Réserver maintenant
                </Button>
              </ReservationDialog>
            )}
            <Button size="lg" variant="outline" className="flex-1">
              <Phone className="mr-2 h-5 w-5" /> Appeler
            </Button>
            {/* WhatsApp Button */}
            <a
              href={`https://wa.me/${whatsappPhoneNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1"
            >
              <Button size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white">
                WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};