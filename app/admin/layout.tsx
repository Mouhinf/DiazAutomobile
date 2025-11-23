import React from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminAuthWrapper } from '@/components/admin/AdminAuthWrapper'; // Import du wrapper

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminAuthWrapper> {/* Enveloppe tout le contenu de l'admin */}
      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <AdminSidebar className="w-64" />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </AdminAuthWrapper>
  );
}