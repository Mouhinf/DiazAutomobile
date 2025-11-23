"use client";

import React, { useEffect, useState } from 'react';
import { CarCard } from './CarCard';
import { getAllCars, Car } from '@/data/car-management'; // Import de getAllCars et Car

export const FeaturedCarsSection = () => {
  const [featuredCars, setFeaturedCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const cars = await getAllCars();
        // Filtrer pour n'afficher que quelques voitures en vedette, par exemple les 4 premières
        setFeaturedCars(cars.slice(0, 4));
      } catch (error) {
        console.error("Erreur lors du chargement des voitures en vedette:", error);
        // Gérer l'erreur, peut-être afficher un message à l'utilisateur
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800 text-center">
        <p className="text-lg text-gray-600 dark:text-gray-400">Chargement des voitures en vedette...</p>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">
          Nos Voitures en Vedette
        </h2>
        {featuredCars.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredCars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
            Aucune voiture en vedette pour le moment.
          </p>
        )}
      </div>
    </section>
  );
};