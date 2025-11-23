"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const AboutPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulaire de contact soumis:', formData);
    toast.success('Votre message a été envoyé ! Nous vous contacterons bientôt.');
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900 dark:text-gray-100">
        À Propos de Diaz Automobile
      </h1>

      {/* Section À propos du parking */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center mb-16">
        <div className="space-y-4">
          <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
            Notre Parking : Un Espace Sécurisé pour Vos Véhicules
          </h2>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Chez Diaz Automobile, nous comprenons l'importance de la sécurité et de l'accessibilité pour vos véhicules. Notre parking est conçu pour offrir un environnement sûr et bien entretenu, que vous soyez un client achetant ou louant une voiture, ou simplement à la recherche d'un endroit fiable pour garer votre véhicule.
          </p>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            Nous disposons d'un large espace, surveillé 24h/24 et 7j/7, avec des installations modernes pour assurer la protection de chaque véhicule. Venez nous rendre visite pour découvrir nos services et notre engagement envers la qualité.
          </p>
        </div>
        <div className="flex justify-center">
          <Image
            src="/diaz-automobile-logo.png" // Utilisation du nouveau logo
            alt="Logo Diaz Automobile"
            width={300}
            height={300}
            className="rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Section Formulaire de demande */}
      <section className="mb-16 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-900 dark:text-gray-100">
          Faites une Demande
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-xl mx-auto">
          <div>
            <Label htmlFor="name">Votre Nom</Label>
            <Input id="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="email">Votre Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="subject">Sujet</Label>
            <Input id="subject" value={formData.subject} onChange={handleChange} required />
          </div>
          <div>
            <Label htmlFor="message">Votre Message</Label>
            <Textarea id="message" value={formData.message} onChange={handleChange} required rows={6} />
          </div>
          <Button type="submit" className="w-full">Envoyer la Demande</Button>
        </form>
      </section>

      {/* Section Localisation */}
      <section className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold text-center mb-8 text-gray-900 dark:text-gray-100">
          Notre Localisation
        </h2>
        <div className="text-center text-lg text-gray-700 dark:text-gray-300 space-y-2">
          <p className="font-semibold">Diaz Automobile Parking</p>
          <p>123 Rue de l'Automobile, Quartier Industriel</p>
          <p>Dakar, Sénégal</p>
          <p>Téléphone: +221 77 123 45 67</p>
          <p>Email: info@diazauto.com</p>
          <div className="mt-6">
            <a
              href="https://www.google.com/maps/search/123+Rue+de+l'Automobile,+Dakar,+Sénégal"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline dark:text-blue-400"
            >
              Voir sur Google Maps
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;