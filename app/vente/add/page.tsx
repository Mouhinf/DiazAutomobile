"use client";

import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AddCarPage = () => {
  const [carData, setCarData] = useState({
    name: '',
    price: '',
    description: '',
    imageUrl: '',
    fuel: '',
    transmission: '',
    location: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCarData(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setCarData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici, vous enverriez les données à votre backend ou à Firebase
    console.log('Nouveau véhicule à vendre:', carData);
    toast.success('Véhicule ajouté avec succès ! (Fonctionnalité de sauvegarde non implémentée)');
    // Réinitialiser le formulaire
    setCarData({
      name: '',
      price: '',
      description: '',
      imageUrl: '',
      fuel: '',
      transmission: '',
      location: '',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
        Ajouter un Véhicule à Vendre
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div>
          <Label htmlFor="name">Nom du véhicule</Label>
          <Input id="name" value={carData.name} onChange={handleChange} required />
        </div>
        <div>
          <Label htmlFor="price">Prix (FCFA)</Label>
          <Input id="price" type="number" value={carData.price} onChange={handleChange} required placeholder="Ex: 15000000" />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={carData.description} onChange={handleChange} required rows={5} />
        </div>
        <div>
          <Label htmlFor="imageUrl">URL de l'image principale</Label>
          <Input id="imageUrl" type="url" value={carData.imageUrl} onChange={handleChange} placeholder="Ex: /placeholder.svg" />
        </div>
        <div>
          <Label htmlFor="fuel">Carburant</Label>
          <Select value={carData.fuel} onValueChange={(value) => handleSelectChange('fuel', value)} required>
            <SelectTrigger id="fuel">
              <SelectValue placeholder="Sélectionner le type de carburant" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Essence">Essence</SelectItem>
              <SelectItem value="Diesel">Diesel</SelectItem>
              <SelectItem value="Électrique">Électrique</SelectItem>
              <SelectItem value="Hybride">Hybride</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="transmission">Transmission</Label>
          <Select value={carData.transmission} onValueChange={(value) => handleSelectChange('transmission', value)} required>
            <SelectTrigger id="transmission">
              <SelectValue placeholder="Sélectionner le type de transmission" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Manuelle">Manuelle</SelectItem>
              <SelectItem value="Automatique">Automatique</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="location">Localisation</Label>
          <Select value={carData.location} onValueChange={(value) => handleSelectChange('location', value)} required>
            <SelectTrigger id="location">
              <SelectValue placeholder="Sélectionner la localisation" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dakar">Dakar</SelectItem>
              <SelectItem value="Thiès">Thiès</SelectItem>
              <SelectItem value="Saly">Saly</SelectItem>
              <SelectItem value="Toubab Dialaw">Toubab Dialaw</SelectItem>
              <SelectItem value="Saint-Louis">Saint-Louis</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button type="submit" className="w-full">Ajouter le véhicule</Button>
      </form>
    </div>
  );
};

export default AddCarPage;