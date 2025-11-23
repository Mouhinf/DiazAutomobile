"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const Header = () => {
  const isMobile = useIsMobile();

  const navLinks = [
    { href: "/vente", label: "Vente" },
    { href: "/location", label: "Location" },
    { href: "/about", label: "À propos" },
    { href: "/assistant", label: "Assistant IA" }, // Nouveau lien pour l'assistant IA
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/diaz-automobile-logo.png" // Remplacez par votre logo
            alt="Diaz Automobile Logo"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-xl font-bold text-primary">Diaz Automobile</span>
        </Link>

        {isMobile ? (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 py-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button className="mt-4 w-full">Se connecter</Button>
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            <Button>Se connecter</Button>
          </nav>
        )}
      </div>
    </header>
  );
};