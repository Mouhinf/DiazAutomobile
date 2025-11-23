"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface ContactSellerDialogProps {
  carName: string;
  children: React.ReactNode;
}

export const ContactSellerDialog = ({ carName, children }: ContactSellerDialogProps) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '', // Nouveau champ pour le numéro de téléphone
    email: '',
    message: `Bonjour, je suis intéressé(e) par le véhicule "${carName}" que j'ai vu sur votre site. J'aimerais avoir plus d'informations.`,
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Formulaire de contact vendeur soumis:', formData);
    toast.success('Votre message a été envoyé ! Le vendeur vous contactera bientôt.');
    setFormData({
      name: '',
      phone: '', // Réinitialiser le champ téléphone
      email: '',
      message: `Bonjour, je suis intéressé(e) par le véhicule "${carName}" que j'ai vu sur votre site. J'aimerais avoir plus d'informations.`,
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
          <DialogTitle>Contacter le vendeur pour {carName}</DialogTitle>
          <DialogDescription>
            Remplissez ce formulaire et nous transmettrons votre message au vendeur.
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
            <Label htmlFor="phone" className="text-right">
              Téléphone
            </Label>
            <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email (Optionnel)
            </Label>
            <Input id="email" type="email" value={formData.email} onChange={handleChange} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="message" className="text-right pt-2">
              Message (Optionnel)
            </Label>
            <Textarea id="message" value={formData.message} onChange={handleChange} className="col-span-3" rows={5} />
          </div>
          <Button type="submit" className="w-full mt-4">Envoyer le message</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};