import { db } from '@/lib/firebase';
import { collection, addDoc, getDocs, doc, getDoc, updateDoc, deleteDoc, query, where, or, and } from 'firebase/firestore'; // Import de 'and'

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  mileage: string;
  salePrice?: string; // Nouveau champ pour le prix de vente
  rentPricePerDay?: string; // Nouveau champ pour le prix de location par jour
  description: string;
  imageUrl: string;
  type: 'sale' | 'rent' | 'both'; // Ajout du type 'both'
  fuel: string;
  transmission: string;
  location: string;
  images: string[];
  videos: string[];
  status: 'available' | 'sold' | 'rented';
  features: string[];
}

const carsCollectionRef = collection(db, 'cars');

export const addCar = async (newCarData: Omit<Car, 'id'>) => {
  try {
    const docRef = await addDoc(carsCollectionRef, newCarData);
    return { id: docRef.id, ...newCarData };
  } catch (e) {
    console.error("Erreur lors de l'ajout du document: ", e);
    throw e;
  }
};

export const updateCar = async (id: string, updatedCarData: Omit<Car, 'id'>) => {
  try {
    const carDocRef = doc(db, 'cars', id);
    await updateDoc(carDocRef, updatedCarData);
    return { id, ...updatedCarData };
  } catch (e) {
    console.error("Erreur lors de la mise à jour du document: ", e);
    throw e;
  }
};

export const deleteCar = async (carId: string) => {
  try {
    const carDocRef = doc(db, 'cars', carId);
    await deleteDoc(carDocRef);
    return true;
  } catch (e) {
    console.error("Erreur lors de la suppression du document: ", e);
    throw e;
  }
};

export const getCarById = async (id: string) => {
  try {
    const carDocRef = doc(db, 'cars', id);
    const carDoc = await getDoc(carDocRef);
    if (carDoc.exists()) {
      return { id: carDoc.id, ...carDoc.data() } as Car;
    }
    return null;
  } catch (e) {
    console.error("Erreur lors de la récupération du document: ", e);
    throw e;
  }
};

export const getAllCars = async () => {
  try {
    const querySnapshot = await getDocs(carsCollectionRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Car[];
  } catch (e) {
    console.error("Erreur lors de la récupération des documents: ", e);
    throw e;
  }
};

export const getCarsByType = async (type: 'sale' | 'rent') => {
  try {
    console.log(`Attempting to fetch cars of type: ${type}`);
    const q = query(
      carsCollectionRef,
      // Correction ici : envelopper les deux conditions dans un 'and'
      and(
        or(where("type", "==", type), where("type", "==", "both")),
        where("status", "==", "available")
      )
    );
    const querySnapshot = await getDocs(q);
    const cars = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Car[];
    console.log(`Fetched ${cars.length} cars for type ${type}:`, cars);
    return cars;
  } catch (e) {
    console.error(`Erreur lors de la récupération des voitures de type ${type}: `, e);
    throw e;
  }
};