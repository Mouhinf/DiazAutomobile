"use client";

import React from 'react';

const AdminDashboardPage = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Tableau de Bord Administrateur
      </h1>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        Bienvenue dans le panneau d'administration de Diaz Automobile. Utilisez la barre latérale pour gérer les véhicules.
      </p>
      {/* Vous pouvez ajouter des statistiques ou des résumés ici plus tard */}
    </div>
  );
};

export default AdminDashboardPage;