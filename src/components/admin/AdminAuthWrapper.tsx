"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { auth } from '@/lib/firebase'; // Import de l'instance d'authentification Firebase
import { signInWithEmailAndPassword, onAuthStateChanged, User, signOut } from 'firebase/auth';
import { Loader2, LogOut } from 'lucide-react';

interface AdminAuthWrapperProps {
  children: React.ReactNode;
}

// L'email de l'administrateur sera défini via une variable d'environnement
const ADMIN_EMAIL = process.env.NEXT_PUBLIC_ADMIN_EMAIL;

export const AdminAuthWrapper = ({ children }: AdminAuthWrapperProps) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoadingAuth(false);
    });
    return () => unsubscribe(); // Nettoyage de l'écouteur
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Connexion réussie !");
    } catch (error: any) {
      console.error("Erreur de connexion:", error);
      let errorMessage = "Erreur de connexion. Veuillez vérifier vos identifiants.";
      if (error.code === 'auth/invalid-email') {
        errorMessage = "L'adresse e-mail est mal formatée.";
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = "Email ou mot de passe incorrect.";
      }
      toast.error(errorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.info("Déconnexion réussie.");
      setEmail('');
      setPassword('');
    } catch (error) {
      console.error("Erreur de déconnexion:", error);
      toast.error("Erreur lors de la déconnexion.");
    }
  };

  // Vérifie si l'utilisateur est connecté et si son email correspond à l'email admin
  const isAdmin = currentUser && currentUser.email === ADMIN_EMAIL;

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-3 text-lg text-gray-600 dark:text-gray-400">Vérification de l'authentification...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100">
            Accès Administrateur
          </h2>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Veuillez vous connecter avec un compte administrateur.
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                disabled={isLoggingIn}
              />
            </div>
            <div>
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
                disabled={isLoggingIn}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Se connecter
            </Button>
          </form>
          {!ADMIN_EMAIL && (
            <p className="text-sm text-center text-red-500 dark:text-red-400 mt-4">
              Attention: La variable d'environnement NEXT_PUBLIC_ADMIN_EMAIL n'est pas définie. L'accès admin ne fonctionnera pas correctement.
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {children}
      {/* Bouton de déconnexion flottant pour l'admin */}
      <Button
        variant="destructive"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full h-12 w-12 shadow-lg"
        onClick={handleLogout}
        aria-label="Déconnexion"
      >
        <LogOut className="h-6 w-6" />
      </Button>
    </>
  );
};