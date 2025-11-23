"use client";

import React from "react";
import { useParams } from "next/navigation";
import { getCarById, Car } from "@/data/car-management";
import { CarDetails } from "@/components/CarDetails";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const VehicleDetailPage: React.FC = () => {
  const params = useParams();
  const carId = params.id as string;

  const { data: car, isLoading, isError } = useQuery<Car, Error>({
    queryKey: ["car", carId],
    queryFn: async () => {
      const result = await getCarById(carId);
      if (!result) throw new Error("Véhicule non trouvé"); // ne jamais retourner null
      return result; // TypeScript sait maintenant que c'est toujours Car
    },
    enabled: !!carId,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, index) => (
                <Skeleton key={index} className="aspect-video w-full rounded-lg" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-12 w-1/2" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-full" />
            </div>
            <Skeleton className="h-8 w-1/3 mt-6" />
            <Skeleton className="h-24 w-full" />
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Skeleton className="h-12 w-full sm:w-1/3" />
              <Skeleton className="h-12 w-full sm:w-1/3" />
              <Skeleton className="h-12 w-full sm:w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-xl text-red-600 dark:text-red-400">
          Erreur lors du chargement du véhicule.
        </p>
      </div>
    );
  }

  return <CarDetails car={car} />;
};

export default VehicleDetailPage;
