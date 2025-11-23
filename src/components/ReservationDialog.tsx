"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ReservationDialogProps {
  carName: string;
  children: React.ReactNode;
}

export const ReservationDialog = ({ carName, children }: ReservationDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    startDate: '',
    endDate: '',
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulaire de réservation soumis:', formData);
    toast.success(`Votre réservation pour "${carName}" a été enregistrée ! Nous vous contacterons pour confirmer.`);
    setFormData({
      name: '',
      email: '',
      phone: '',
      startDate: '',
      endDate: '',
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Réserver {carName}</DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire pour réserver ce véhicule.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nom
            </Label>
            <Input id="name" value={formData.name} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="phone" className="text-right">
              Téléphone
            </Label>
            <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Date de début
            </Label>
            <Input id="startDate" type="date" value={formData.startDate} onChange={handleChange} className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              Date de fin
            </Label>
            <Input id="endDate" type="date" value={formData.endDate} onChange={handleChange} className="col-span-3" required />
          </div>
          <Button type="submit" className="w-full mt-4">Confirmer la réservation</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};