"use client";

import React from 'react';
import { CarCard } from './CarCard';
import { getCarsByType, Car } from '@/data/car-management';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

export const RentCarsSection = () => {
  const { data: rentCars, isLoading, isError } = useQuery<Car[], Error>({
    queryKey: ['rentCars'],
    queryFn: () => getCarsByType('rent'),
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
  });

  if (isLoading) {
    return (
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">
            Voitures à Louer
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, index) => (
              <Skeleton key={index} className="h-[350px] w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="py-12 md:py-16 bg-white dark:bg-gray-900 text-center">
        <p className="text-lg text-red-600 dark:text-red-400">Erreur lors du chargement des voitures à louer.</p>
      </section>
    );
  }

  const carsToShow = rentCars?.slice(0, 4) || [];

  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">
          Voitures à Louer
        </h2>
        {carsToShow.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {carsToShow.map((car) => (
              <Link key={car.id} href={`/vehicles/${car.id}`}>
                <CarCard car={car} displayPriceType="rent" />
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
            Aucune voiture à louer pour le moment.
          </p>
        )}
        <div className="text-center mt-10">
          <Link href="/location" passHref>
            <Button size="lg">Voir toutes les voitures à louer</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};