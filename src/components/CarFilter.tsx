"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal } from 'lucide-react';

interface CarFilterProps {
  onFilterChange: (filters: {
    search: string;
    brand: string;
    minPrice: string;
    maxPrice: string;
    fuel: string;
    transmission: string;
    location: string;
  }) => void;
}

export const CarFilter = ({ onFilterChange }: CarFilterProps) => {
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [fuel, setFuel] = useState('');
  const [transmission, setTransmission] = useState('');
  const [location, setLocation] = useState('');

  const handleApplyFilters = () => {
    onFilterChange({ search, brand, minPrice, maxPrice, fuel, transmission, location });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-full lg:col-span-1">
          <Input
            placeholder="Rechercher par nom ou description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={brand} onValueChange={(value) => setBrand(value === "all" ? "" : value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Marque" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les marques</SelectItem>
            <SelectItem value="Tesla">Tesla</SelectItem>
            <SelectItem value="Renault">Renault</SelectItem>
            <SelectItem value="BMW">BMW</SelectItem>
            <SelectItem value="Peugeot">Peugeot</SelectItem>
            <SelectItem value="Mercedes-Benz">Mercedes-Benz</SelectItem>
            <SelectItem value="Volkswagen">Volkswagen</SelectItem>
            <SelectItem value="Toyota">Toyota</SelectItem>
            <SelectItem value="Ford">Ford</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Prix min (FCFA)"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="w-full"
        />
        <Input
          type="number"
          placeholder="Prix max (FCFA)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full"
        />

        <Select value={fuel} onValueChange={(value) => setFuel(value === "all" ? "" : value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Carburant" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les carburants</SelectItem>
            <SelectItem value="Essence">Essence</SelectItem>
            <SelectItem value="Diesel">Diesel</SelectItem>
            <SelectItem value="Électrique">Électrique</SelectItem>
          </SelectContent>
        </Select>

        <Select value={transmission} onValueChange={(value) => setTransmission(value === "all" ? "" : value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Transmission" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les transmissions</SelectItem>
            <SelectItem value="Manuelle">Manuelle</SelectItem>
            <SelectItem value="Automatique">Automatique</SelectItem>
          </SelectContent>
        </Select>

        <Select value={location} onValueChange={(value) => setLocation(value === "all" ? "" : value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Localisation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les localisations</SelectItem>
            <SelectItem value="Dakar">Dakar</SelectItem>
            <SelectItem value="Thiès">Thiès</SelectItem>
            <SelectItem value="Saly">Saly</SelectItem>
            <SelectItem value="Toubab Dialaw">Toubab Dialaw</SelectItem>
          </SelectContent>
        </Select>

        <Button onClick={handleApplyFilters} className="w-full lg:col-span-1">
          <Search className="mr-2 h-4 w-4" /> Appliquer les filtres
        </Button>
      </div>
    </div>
  );
};