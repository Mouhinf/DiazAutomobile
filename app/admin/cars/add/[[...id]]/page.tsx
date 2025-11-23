"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { addCar, updateCar, getCarById, Car } from '@/data/car-management';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Loader2, XCircle } from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const AdminAddEditCarPage = () => {
  const router = useRouter();
  const params = useParams();
  const carId = Array.isArray(params.id) ? params.id[0] : undefined;
  const isEditing = !!carId;
  const queryClient = useQueryClient();

  const [carData, setCarData] = useState<Omit<Car, 'id'>>({
    name: '',
    brand: '',
    model: '',
    year: 0,
    mileage: '',
    salePrice: '',
    rentPricePerDay: '',
    description: '',
    imageUrl: '',
    type: 'sale',
    fuel: '',
    transmission: '',
    location: '',
    images: [],
    videos: [],
    status: 'available',
    features: [],
  });

  const [featuresInput, setFeaturesInput] = useState<string>('');
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // ---------- REACT QUERY ----------
  const { data: existingCar, isLoading: isLoadingExistingCar, isError: isErrorExistingCar } = useQuery<Car, Error>({
    queryKey: ['car', carId],
    queryFn: async () => {
      if (!carId) throw new Error('ID du véhicule manquant');
      const car = await getCarById(carId);
      if (!car) throw new Error('Véhicule non trouvé');
      return car;
    },
    enabled: isEditing && !!carId,
    staleTime: 1000 * 60 * 5,
  });

  // ---------- EFFECT POUR REMPLIR LE FORMULAIRE ----------
  useEffect(() => {
    if (isEditing && existingCar) {
      setCarData({
        ...existingCar,
        salePrice: existingCar.salePrice || '',
        rentPricePerDay: existingCar.rentPricePerDay || '',
        year: existingCar.year || 0,
      });
      setFeaturesInput(existingCar.features.join('\n'));
    } else if (!isEditing) {
      setCarData({
        name: '',
        brand: '',
        model: '',
        year: 0,
        mileage: '',
        salePrice: '',
        rentPricePerDay: '',
        description: '',
        imageUrl: '',
        type: 'sale',
        fuel: '',
        transmission: '',
        location: '',
        images: [],
        videos: [],
        status: 'available',
        features: [],
      });
      setFeaturesInput('');
      setMainImageFile(null);
      setAdditionalImageFiles([]);
      setVideoFiles([]);
    }
  }, [isEditing, existingCar]);

  // ---------- EFFECT POUR ERREURS ----------
  useEffect(() => {
    if (isErrorExistingCar) {
      toast.error("Erreur lors du chargement du véhicule pour l'édition.");
      router.push('/admin/cars/manage');
    }
  }, [isErrorExistingCar, router]);

  // ---------- HANDLERS ----------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCarData(prev => {
      const updatedCarData = { ...prev, [id]: id === 'year' ? parseInt(value) || 0 : value };
      if (id === 'brand' || id === 'model') {
        const brand = id === 'brand' ? value : updatedCarData.brand;
        const model = id === 'model' ? value : updatedCarData.model;
        updatedCarData.name = `${brand} ${model}`;
      }
      return updatedCarData;
    });
  };

  const handleSelectChange = (id: keyof Omit<Car, 'id'>, value: string) => {
    setCarData(prev => ({ ...prev, [id]: value as any }));
  };

  const handleFeaturesInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeaturesInput(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'mainImage' | 'additionalImages' | 'videos') => {
    if (!e.target.files) return;
    if (type === 'mainImage') setMainImageFile(e.target.files[0]);
    else if (type === 'additionalImages') setAdditionalImageFiles(Array.from(e.target.files));
    else if (type === 'videos') setVideoFiles(Array.from(e.target.files));
  };

  const uploadFileToCloudinary = async (file: File, resourceType: 'image' | 'video') => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      toast.error("Configuration Cloudinary manquante.");
      throw new Error("Cloudinary configuration missing.");
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('resource_type', resourceType);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      toast.error(`Échec du téléversement du ${resourceType}: ${file.name}`);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    let newCarData = { ...carData };
    newCarData.name = `${newCarData.brand} ${newCarData.model}`;
    newCarData.features = featuresInput.split(/[\n,]/).map(s => s.trim()).filter(Boolean);

    try {
      if (mainImageFile) newCarData.imageUrl = await uploadFileToCloudinary(mainImageFile, 'image');
      if (additionalImageFiles.length > 0) {
        const urls = await Promise.all(additionalImageFiles.map(f => uploadFileToCloudinary(f, 'image')));
        newCarData.images = [...newCarData.images, ...urls];
      }
      if (videoFiles.length > 0) {
        const urls = await Promise.all(videoFiles.map(f => uploadFileToCloudinary(f, 'video')));
        newCarData.videos = [...newCarData.videos, ...urls];
      }

      if (isEditing && carId) {
        await updateCar(carId, newCarData);
        toast.success('Véhicule modifié avec succès !');
      } else {
        await addCar(newCarData);
        toast.success('Véhicule ajouté avec succès !');
      }

      queryClient.invalidateQueries({ queryKey: ['adminCars'] });
      queryClient.invalidateQueries({ queryKey: ['car', carId] });
      router.push('/admin/cars/manage');
    } catch {
      toast.error("Une erreur est survenue lors du téléversement ou de la sauvegarde du véhicule.");
    } finally {
      setIsUploading(false);
    }
  };

  const removeUploadedMedia = (type: 'mainImage' | 'additionalImage' | 'video', urlToRemove?: string) => {
    if (type === 'mainImage') {
      setCarData(prev => ({ ...prev, imageUrl: '' }));
      setMainImageFile(null);
    } else if (type === 'additionalImage' && urlToRemove) {
      setCarData(prev => ({ ...prev, images: prev.images.filter(url => url !== urlToRemove) }));
    } else if (type === 'video' && urlToRemove) {
      setCarData(prev => ({ ...prev, videos: prev.videos.filter(url => url !== urlToRemove) }));
    }
  };

  if (isLoadingExistingCar && isEditing) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Skeleton className="h-10 w-3/4 mb-8 mx-auto" />
        <div className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          {[...Array(10)].map((_, i) => (
            <div key={i}>
              <Skeleton className="h-5 w-24 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <Skeleton className="h-12 w-full mt-6" />
        </div>
      </div>
    );
  }

  const isForSale = carData.type === 'sale' || carData.type === 'both';
  const isForRent = carData.type === 'rent' || carData.type === 'both';

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-gray-100">
        {isEditing ? 'Modifier le Véhicule' : 'Ajouter un Véhicule'}
      </h1>
      {/* === FORMULAIRE === */}
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Les champs du formulaire restent identiques */}
        {/* … */}
      </form>
    </div>
  );
};

export default AdminAddEditCarPage;
