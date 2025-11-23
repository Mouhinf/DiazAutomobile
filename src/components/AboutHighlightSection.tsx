"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export const AboutHighlightSection = () => {
  return (
    <section className="py-12 md:py-16 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">
            Découvrez Diaz Automobile
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            Chez Diaz Automobile, nous sommes passionnés par les véhicules et dévoués à offrir un service exceptionnel. Que vous cherchiez à acheter, louer ou simplement en savoir plus sur notre parking sécurisé, nous sommes là pour vous.
          </p>
          <Link href="/about" passHref>
            <Button size="lg" className="mt-4">
              En savoir plus sur nous
            </Button>
          </Link>
        </div>
        <div className="flex justify-center md:justify-end">
          <Image
            src="/diaz-automobile-logo.png" // Utilisation du logo ici
            alt="À propos de Diaz Automobile"
            width={300} // Ajusté pour mieux correspondre à un logo
            height={300} // Ajusté pour mieux correspondre à un logo
            className="rounded-lg shadow-lg object-cover w-full max-w-md h-auto"
          />
        </div>
      </div>
    </section>
  );
};