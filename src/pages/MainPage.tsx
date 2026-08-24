import React from 'react';
import { HeaderHero } from '../components/HeaderHero';
import { BookingWizard } from '../components/BookingWizard';
import { GalleryCarousel } from '../components/GalleryCarousel';
import { AboutGaldino } from '../components/AboutGaldino';
import { LocationSection } from '../components/LocationSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { InstagramSection } from '../components/InstagramSection';
import { FaqSection } from '../components/FaqSection';
import { Footer } from '../components/Footer';

export const MainPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-background text-foreground relative">
      <HeaderHero />
      <BookingWizard />
      <GalleryCarousel />
      <AboutGaldino />
      <LocationSection />
      <ReviewsSection />
      <InstagramSection />
      <FaqSection />
      <Footer />
    </main>
  );
};


