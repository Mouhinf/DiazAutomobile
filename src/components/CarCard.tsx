"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Car } from '@/data/car-management'; // Import de l'interface Car

interface CarCardProps {
  car: Car;
  displayPriceType: 'sale' | 'rent'; // Nouvelle prop pour indiquer quel prix afficher
}

export const CarCard = ({ car, displayPriceType }: CarCardProps) => {
  const buttonText = displayPriceType === 'sale' ? 'Voir les détails' : 'Louer maintenant';
  const priceToDisplay = displayPriceType === 'sale' ? car.salePrice : car.rentPricePerDay;
  const priceSuffix = displayPriceType === 'sale' ? 'FCFA' : 'FCFA/jour';

  if (!priceToDisplay) {
    // Ne pas afficher la carte si le prix pertinent n'est pas défini pour le type d'affichage
    return null;
  }

  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="p-0">
        <div className="relative w-full h-64 overflow-hidden rounded-t-lg">
          <Image
            src={car.imageUrl || '/placeholder.svg'} // Fallback image
            alt={car.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="text-xl font-semibold mb-2">{car.name}</CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {car.description}
        </CardDescription>
        <p className="text-2xl font-bold text-primary">{priceToDisplay} {priceSuffix}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full">
          {buttonText}
        </Button>
      </CardFooter>
    </Card>
  );
};