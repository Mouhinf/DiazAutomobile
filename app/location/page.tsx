"use client";

import React, { useState, useEffect } from 'react';
import { CarCard } from '@/components/CarCard';
import { CarFilter } from '@/components/CarFilter';
import { getCarsByType, Car } from '@/data/car-management';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const LocationPage = () => {
  const { data: allRentCars, isLoading, isError } = useQuery<Car[], Error>({
    queryKey: ['allRentCars'],
    queryFn: () => getCarsByType('rent'),
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
  });

  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [filters, setFilters] = useState({
    search: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    fuel: '',
    transmission: '',
    location: '',
  });

  useEffect(() => {
    if (allRentCars) {
      let cars = [...allRentCars]; // Travailler sur une copie

      if (filters.search) {
        cars = cars.filter(car =>
          car.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          car.description.toLowerCase().includes(filters.search.toLowerCase()) ||
          car.brand.toLowerCase().includes(filters.search.toLowerCase()) ||
          car.model.toLowerCase().includes(filters.search.toLowerCase())
        );
      }
      if (filters.brand) {
        cars = cars.filter(car => car.brand.toLowerCase() === filters.brand.toLowerCase());
      }
      if (filters.minPrice) {
        cars = cars.filter(car => {
          const priceValue = parseFloat((car.rentPricePerDay || '0').replace(/[^0-9,-]+/g, "").replace(',', '.'));
          return priceValue >= parseFloat(filters.minPrice);
        });
      }
      if (filters.maxPrice) {
        cars = cars.filter(car => {
          const priceValue = parseFloat((car.rentPricePerDay || '0').replace(/[^0-9,-]+/g, "").replace(',', '.'));
          return priceValue <= parseFloat(filters.maxPrice);
        });
      }
      if (filters.fuel) {
        cars = cars.filter(car => car.fuel === filters.fuel);
      }
      if (filters.transmission) {
        cars = cars.filter(car => car.transmission === filters.transmission);
      }
      if (filters.location) {
        cars = cars.filter(car => car.location === filters.location);
      }

      setFilteredCars(cars);
    }
  }, [filters, allRentCars]);

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
          Voitures à Louer
        </h1>
        <CarFilter onFilterChange={handleFilterChange} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <Skeleton key={index} className="h-[350px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-red-600 dark:text-red-400">Erreur lors du chargement des voitures à louer.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
        Voitures à Louer
      </h1>

      <CarFilter onFilterChange={handleFilterChange} />

      {filteredCars.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCars.map((car) => (
            <Link key={car.id} href={`/vehicles/${car.id}`}>
              <CarCard car={car} displayPriceType="rent" />
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
          Aucune voiture ne correspond à vos critères de recherche.
        </p>
      )}
    </div>
  );
};

export default LocationPage;