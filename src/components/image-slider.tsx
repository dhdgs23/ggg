'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import Autoplay from "embla-carousel-autoplay"

const sliderImages = [
  { src: 'https://placehold.co/1200x500.png', alt: 'Epic battle scene from Free Fire', dataAiHint: 'gaming battle' },
  { src: 'https://placehold.co/1200x500.png', alt: 'Promotional banner for new game items', dataAiHint: 'gaming characters' },
  { src: 'https://placehold.co/1200x500.png', alt: 'Close-up of a rare in-game weapon', dataAiHint: 'game weapon' },
  { src: 'https://placehold.co/1200x500.png', alt: 'Characters showing off new skins', dataAiHint: 'action scene' },
];

export default function ImageSlider() {
  return (
    <section className="w-full py-6 md:py-8">
      <div className="container mx-auto px-4 md:px-6">
        <Carousel 
          className="w-full group"
          plugins={[
            Autoplay({
              delay: 5000,
            }),
          ]}
          opts={{
            loop: true,
          }}
        >
          <CarouselContent>
            {sliderImages.map((image, index) => (
              <CarouselItem key={index}>
                <div className="relative h-[250px] md:h-[350px] lg:h-[450px] w-full overflow-hidden rounded-lg">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority={index === 0}
                    data-ai-hint={image.dataAiHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/40 border-none hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 text-white bg-black/20 hover:bg-black/40 border-none hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity" />
        </Carousel>
      </div>
    </section>
  );
}
