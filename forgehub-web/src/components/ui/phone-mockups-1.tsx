'use client';
// components/ui/phone-mockups-1.tsx
import React from 'react';
import { type ImageItem, PhoneCarousel } from './phone-mockups-1-utils/phone-carousel';

export default function PhoneMockupBasic({ images }: { images: ImageItem[] }) {
  return <PhoneCarousel images={images} />;
}
