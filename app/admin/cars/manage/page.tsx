"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { getAllCars, deleteCar, Car } from '@/data/car-management';
import Link from 'next/link';
import { Edit, Trash2, PlusCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const AdminManageCarsPage = () => {
  const queryClient = useQueryClient();

  const { data: cars, isLoading, isError } = useQuery<Car[], Error>({
    queryKey: ['adminCars'],
    queryFn: getAllCars,
    staleTime: 1000 * 60, // Data considered fresh for 1 minute
  });

  const handleDelete = async (carId: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      try {
        await deleteCar(carId);
        toast.success('Véhicule supprimé avec succès !');
        queryClient.invalidateQueries({ queryKey: ['adminCars'] }); // Invalider le cache pour re-fetch
        queryClient.invalidateQueries({ queryKey: ['saleCars'] }); // Invalider les caches des pages publiques
        queryClient.invalidateQueries({ queryKey: ['rentCars'] });
        queryClient.invalidateQueries({ queryKey: ['allSaleCars'] });
        queryClient.invalidateQueries({ queryKey: ['allRentCars'] });
      } catch (error) {
        console.error("Erreur lors de la suppression du véhicule:", error);
        toast.error('Erreur lors de la suppression du véhicule.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, index) => (
                <TableRow key={index}>
                  <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 inline-block mr-2" />
                    <Skeleton className="h-8 w-8 inline-block" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-lg text-red-600 dark:text-red-400">Erreur lors du chargement des véhicules.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Gérer les Véhicules
        </h1>
        <Link href="/admin/cars/add">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Ajouter un nouveau véhicule
          </Button>
        </Link>
      </div>

      {cars?.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-400 text-lg">
          Aucun véhicule à gérer pour le moment.
        </p>
      ) : (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Prix</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cars?.map((car) => (
                <TableRow key={car.id}>
                  <TableCell className="font-medium">{car.name}</TableCell>
                  <TableCell>
                    {car.type === 'sale' ? 'Vente' : car.type === 'rent' ? 'Location' : 'Vente & Location'}
                  </TableCell>
                  <TableCell>
                    {car.salePrice && <span>{car.salePrice} FCFA (Vente)</span>}
                    {car.salePrice && car.rentPricePerDay && <br />}
                    {car.rentPricePerDay && <span>{car.rentPricePerDay} FCFA/jour (Location)</span>}
                    {!car.salePrice && !car.rentPricePerDay && <span>N/A</span>}
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      car.status === 'available' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      car.status === 'sold' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                    }`}>
                      {car.status === 'available' ? 'Disponible' : car.status === 'sold' ? 'Vendu' : 'Loué'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/cars/add/${car.id}`} passHref>
                      <Button variant="ghost" size="icon" className="mr-2">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Modifier</span>
                      </Button>
                    </Link>
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(car.id)}>
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Supprimer</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default AdminManageCarsPage;