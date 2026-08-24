import React from 'react';
import { HeaderHero } from '../components/HeaderHero';
import { BookingWizard } from '../components/BookingWizard';
import { GalleryCarousel } from '../components/GalleryCarousel';
import { InstagramSection } from '../components/InstagramSection';
import { LocationSection } from '../components/LocationSection';
import { AboutGaldino } from '../components/AboutGaldino';
import { ContactSection } from '../components/ContactSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { Footer } from '../components/Footer';

export const MainPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-background text-foreground relative">
      <HeaderHero />
      <BookingWizard />
      <GalleryCarousel />
      <InstagramSection />
      <LocationSection />
      <AboutGaldino />
      <ReviewsSection />
      <ContactSection />
      <Footer />
    </main>
  );
};
