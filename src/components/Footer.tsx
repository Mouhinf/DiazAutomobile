"use client";

import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 md:py-12">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-white">Diaz Automobile</h3>
          <p className="text-sm">
            Votre partenaire de confiance pour la vente et la location de véhicules au Sénégal et en Afrique de l'Ouest.
          </p>
          <div className="flex space-x-4">
            {/* Placeholder for social media icons */}
            <Link href="#" className="text-gray-400 hover:text-white">FB</Link>
            <Link href="#" className="text-gray-400 hover:text-white">TW</Link>
            <Link href="#" className="text-gray-400 hover:text-white">IG</Link>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Liens Rapides</h3>
          <ul className="space-y-2">
            <li><Link href="/vente" className="hover:text-white">Voitures à vendre</Link></li>
            <li><Link href="/location" className="hover:text-white">Voitures à louer</Link></li>
            <li><Link href="/about" className="hover:text-white">À propos</Link></li> {/* Ajout du lien "À propos" */}
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-white">Contactez-nous</h3>
          <p className="text-sm">
            123 Rue de l'Automobile, Dakar, Sénégal<br />
            Email: info@diazauto.com<br />
            Téléphone: +221 77 123 45 67
          </p>
        </div>
      </div>
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Diaz Automobile. Tous droits réservés.
      </div>
    </footer>
  );
};