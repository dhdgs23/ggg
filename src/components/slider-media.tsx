
'use client';

import Image from 'next/image';

interface SliderMediaProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export default function SliderMedia({ src, alt, priority = false }: SliderMediaProps) {
  const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');

  if (isVideo) {
    return (
      <video
        src={src}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className="object-cover"
      priority={priority}
    />
  );
}
