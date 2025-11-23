"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { Loader2, XCircle } from "lucide-react";

// IMPORTS CORRIGÉS POUR VERCEL
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

import { addCar, updateCar, getCarById, Car } from "@/data/car-management";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

const AdminAddEditCarPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const carId = Array.isArray(params.id) ? params.id[0] : undefined;
  const isEditing = !!carId;
  const queryClient = useQueryClient();

  const [carData, setCarData] = useState<Omit<Car, "id">>({
    name: "",
    brand: "",
    model: "",
    year: 0,
    mileage: "",
    salePrice: "",
    rentPricePerDay: "",
    description: "",
    imageUrl: "",
    type: "sale",
    fuel: "",
    transmission: "",
    location: "",
    images: [],
    videos: [],
    status: "available",
    features: [],
  });

  const [featuresInput, setFeaturesInput] = useState<string>("");
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // ---------- REACT QUERY ----------
  const { data: car, isLoading, isError } = useQuery<Car, Error>({
    queryKey: ['car', carId],
    queryFn: async () => {
      const result = await getCarById(carId);
      if (!result) throw new Error('Véhicule non trouvé');
      return result;
    },
    enabled: !!carId,
    staleTime: 1000 * 60 * 5,
  });


  // ---------- EFFECT POUR REMPLIR LE FORMULAIRE ----------
  useEffect(() => {
    if (isEditing && existingCar) {
      setCarData({
        ...existingCar,
        salePrice: existingCar.salePrice || "",
        rentPricePerDay: existingCar.rentPricePerDay || "",
        year: existingCar.year || 0,
      });
      setFeaturesInput(existingCar.features.join("\n"));
    }
  }, [isEditing, existingCar]);

  // ---------- EFFECT POUR ERREURS ----------
  useEffect(() => {
    if (isErrorExistingCar) {
      toast.error("Erreur lors du chargement du véhicule pour l'édition.");
      router.push("/admin/cars/manage");
    }
  }, [isErrorExistingCar, router]);

  // ---------- HANDLERS ----------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setCarData(prev => {
      const updated = { ...prev, [id]: id === "year" ? parseInt(value) || 0 : value };
      if (id === "brand" || id === "model") {
        updated.name = `${id === "brand" ? value : updated.brand} ${id === "model" ? value : updated.model}`;
      }
      return updated;
    });
  };

  const handleSelectChange = (id: keyof Omit<Car, "id">, value: string) => {
    setCarData(prev => ({ ...prev, [id]: value as any }));
  };

  const handleFeaturesInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFeaturesInput(e.target.value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "mainImage" | "additionalImages" | "videos") => {
    if (!e.target.files) return;
    if (type === "mainImage") setMainImageFile(e.target.files[0]);
    else if (type === "additionalImages") setAdditionalImageFiles(Array.from(e.target.files));
    else if (type === "videos") setVideoFiles(Array.from(e.target.files));
  };

  const uploadFileToCloudinary = async (file: File, resourceType: "image" | "video") => {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      throw new Error("Cloudinary configuration missing.");
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("resource_type", resourceType);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${resourceType}/upload`,
      formData
    );
    return response.data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    const newCarData = {
      ...carData,
      name: `${carData.brand} ${carData.model}`,
      features: featuresInput.split(/[\n,]/).map(s => s.trim()).filter(Boolean),
    };

    try {
      if (mainImageFile) newCarData.imageUrl = await uploadFileToCloudinary(mainImageFile, "image");
      if (additionalImageFiles.length > 0) {
        const urls = await Promise.all(additionalImageFiles.map(f => uploadFileToCloudinary(f, "image")));
        newCarData.images = [...newCarData.images, ...urls];
      }
      if (videoFiles.length > 0) {
        const urls = await Promise.all(videoFiles.map(f => uploadFileToCloudinary(f, "video")));
        newCarData.videos = [...newCarData.videos, ...urls];
      }

      if (isEditing && carId) await updateCar(carId, newCarData);
      else await addCar(newCarData);

      toast.success(`Véhicule ${isEditing ? "modifié" : "ajouté"} avec succès !`);
      queryClient.invalidateQueries({ queryKey: ["adminCars"] });
      queryClient.invalidateQueries({ queryKey: ["car", carId] });
      router.push("/admin/cars/manage");
    } catch (err) {
      toast.error("Erreur lors de la sauvegarde du véhicule.");
    } finally {
      setIsUploading(false);
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-4xl font-bold text-center mb-8">
        {isEditing ? "Modifier le Véhicule" : "Ajouter un Véhicule"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        {/* Nom */}
        <div>
          <Label htmlFor="name">Nom</Label>
          <Input id="name" value={carData.name} onChange={handleChange} placeholder="Nom du véhicule" />
        </div>

        {/* Marque */}
        <div>
          <Label htmlFor="brand">Marque</Label>
          <Input id="brand" value={carData.brand} onChange={handleChange} placeholder="Marque" />
        </div>

        {/* Model */}
        <div>
          <Label htmlFor="model">Modèle</Label>
          <Input id="model" value={carData.model} onChange={handleChange} placeholder="Modèle" />
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" value={carData.description} onChange={handleChange} placeholder="Description du véhicule" />
        </div>

        <Button type="submit" disabled={isUploading}>
          {isUploading ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : null}
          {isEditing ? "Modifier" : "Ajouter"}
        </Button>
      </form>
    </div>
  );
};

export default AdminAddEditCarPage;
