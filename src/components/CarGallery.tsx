"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PlayCircle, X, ChevronLeft, ChevronRight, Maximize } from 'lucide-react';
import Image from 'next/image';
import useEmblaCarousel from 'embla-carousel-react';

interface CarGalleryProps {
  images: string[];
  videos?: string[];
}

export const CarGallery = ({ images, videos }: CarGalleryProps) => {
  const allMedia = [...images, ...(videos || [])];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [emblaRefDialog, emblaApiDialog] = useEmblaCarousel({ loop: true });
  const [dialogSelectedIndex, setDialogSelectedIndex] = useState(0);

  const isVideo = (url: string) => (videos || []).includes(url);

  // --- Main Carousel Logic ---
  const updateCurrentMedia = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi, setSelectedIndex]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', updateCurrentMedia);
    emblaApi.on('reInit', updateCurrentMedia);
    updateCurrentMedia(); // Set initial state
  }, [emblaApi, updateCurrentMedia]);

  useEffect(() => {
    if (emblaApi && allMedia.length > 0) {
      emblaApi.reInit();
      emblaApi.scrollTo(0);
      setSelectedIndex(0);
    }
  }, [images, videos, allMedia.length, emblaApi]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  // --- Dialog Carousel Logic ---
  // Effect to sync main carousel index to dialog carousel when dialog opens
  useEffect(() => {
    if (isDialogOpen && emblaApiDialog) {
      emblaApiDialog.scrollTo(selectedIndex, false); // false for no animation
      setDialogSelectedIndex(selectedIndex);
    }
  }, [isDialogOpen, emblaApiDialog, selectedIndex]);

  // Effect to update dialog selected index
  const updateDialogCurrentMedia = useCallback(() => {
    if (!emblaApiDialog) return;
    setDialogSelectedIndex(emblaApiDialog.selectedScrollSnap());
  }, [emblaApiDialog, setDialogSelectedIndex]);

  useEffect(() => {
    if (!emblaApiDialog) return;
    emblaApiDialog.on('select', updateDialogCurrentMedia);
    emblaApiDialog.on('reInit', updateDialogCurrentMedia);
  }, [emblaApiDialog, updateDialogCurrentMedia]);

  const scrollPrevDialog = useCallback(() => {
    if (emblaApiDialog) emblaApiDialog.scrollPrev();
  }, [emblaApiDialog]);

  const scrollNextDialog = useCallback(() => {
    if (emblaApiDialog) emblaApiDialog.scrollNext();
  }, [emblaApiDialog]);

  return (
    <div className="grid gap-4">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        {/* Main media display (always visible) */}
        <div className="relative aspect-video overflow-hidden rounded-lg group">
          <div className="embla" ref={emblaRef}>
            <div className="embla__container h-full">
              {allMedia.map((mediaUrl, index) => (
                <div className="embla__slide relative h-full" key={index}>
                  {/* DialogTrigger wraps the media content to make it clickable */}
                  <DialogTrigger asChild onClick={() => setSelectedIndex(index)}>
                    {isVideo(mediaUrl) ? (
                      <video
                        src={mediaUrl}
                        controls={false} // Controls will be in the dialog
                        className="w-full h-full object-cover cursor-pointer"
                        aria-label={`Selected video ${index + 1}`}
                      />
                    ) : (
                      <Image
                        src={mediaUrl}
                        alt={`Selected car image ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index === 0}
                      />
                    )}
                  </DialogTrigger>
                  {isVideo(mediaUrl) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      <PlayCircle className="h-16 w-16 text-white" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons for the main carousel */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/70 text-gray-800 rounded-full"
            onClick={scrollPrev}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/70 text-gray-800 rounded-full"
            onClick={scrollNext}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          {/* Maximize button as an alternative trigger for the dialog */}
          <DialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute bottom-2 right-2 z-10 bg-white/50 hover:bg-white/70 text-gray-800 rounded-full"
              aria-label="View full screen"
            >
              <Maximize className="h-6 w-6" />
            </Button>
          </DialogTrigger>
        </div>

        {/* The DialogContent for full-screen view */}
        <DialogContent className="max-w-full h-full w-full p-0 border-none bg-transparent flex items-center justify-center">
          <div className="relative w-full h-full max-w-screen-xl max-h-screen-xl flex items-center justify-center">
            <div className="embla-dialog w-full h-full" ref={emblaRefDialog}>
              <div className="embla__container h-full">
                {allMedia.map((mediaUrl, index) => (
                  <div className="embla__slide relative h-full flex items-center justify-center" key={index}>
                    {isVideo(mediaUrl) ? (
                      <video
                        src={mediaUrl}
                        controls
                        autoPlay={dialogSelectedIndex === index} // Autoplay only the current video
                        className="max-w-full max-h-full object-contain"
                      />
                    ) : (
                      <Image
                        src={mediaUrl}
                        alt={`Selected car image in dialog ${index + 1}`}
                        fill
                        className="object-contain"
                        sizes="100vw"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation buttons for the dialog carousel */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/70 text-gray-800 rounded-full"
              onClick={scrollPrevDialog}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/50 hover:bg-white/70 text-gray-800 rounded-full"
              onClick={scrollNextDialog}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white hover:text-black"
              onClick={() => setIsDialogOpen(false)}
            >
              <X className="h-8 w-8" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {allMedia.map((mediaUrl, index) => (
          <div
            key={index}
            className={cn(
              "relative aspect-video overflow-hidden rounded-lg cursor-pointer border-2",
              selectedIndex === index ? "border-primary" : "border-transparent"
            )}
            onClick={() => emblaApi && emblaApi.scrollTo(index)}
          >
            {isVideo(mediaUrl) ? (
              <video
                src={mediaUrl}
                className="w-full h-full object-cover"
                aria-label={`Thumbnail video ${index + 1}`}
              />
            ) : (
              <Image
                src={mediaUrl}
                alt={`Thumbnail image ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 25vw, (max-width: 1200px) 12.5vw, 8vw"
              />
            )}
            {isVideo(mediaUrl) && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                <PlayCircle className="h-8 w-8" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};