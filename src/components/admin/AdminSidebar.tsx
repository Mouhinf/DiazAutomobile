"use client";

import React from 'react';
import Link from 'next/link';
import { Car, PlusCircle, LayoutDashboard, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  className?: string;
}

export const AdminSidebar = ({ className }: AdminSidebarProps) => {
  const navItems = [
    {
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Tableau de bord",
    },
    {
      href: "/admin/cars/add",
      icon: PlusCircle,
      label: "Ajouter un véhicule",
    },
    {
      href: "/admin/cars/manage",
      icon: Car,
      label: "Gérer les véhicules",
    },
  ];

  return (
    <aside className={cn("flex flex-col border-r bg-sidebar text-sidebar-foreground p-4", className)}>
      <h2 className="text-2xl font-bold mb-6 text-sidebar-primary">Admin Panel</h2>
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground transition-all hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};