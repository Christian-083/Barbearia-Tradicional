import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { GALLERY_IMAGES } from '../data/services';

export const GalleryCarousel: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState<number>(0);
  const [customImages, setCustomImages] = useState<string[]>([]);
  const [removedDefaults, setRemovedDefaults] = useState<string[]>([]);

  // Listen to custom gallery changes (in case admin updates it in another tab/component)
  useEffect(() => {
    const loadImages = () => {
      const savedCustom = localStorage.getItem('galdino_custom_gallery');
      if (savedCustom) {
        try {
          setCustomImages(JSON.parse(savedCustom));
        } catch (e) {}
      } else {
        setCustomImages([]);
      }

      const savedRemoved = localStorage.getItem('galdino_removed_defaults');
      if (savedRemoved) {
        try {
          setRemovedDefaults(JSON.parse(savedRemoved));
        } catch (e) {}
      } else {
        setRemovedDefaults([]);
      }
    };
    
    loadImages();
    window.addEventListener('storage', loadImages);
    return () => window.removeEventListener('storage', loadImages);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      setScrollPos((prev) => {
        const maxScroll = el.scrollWidth - el.clientWidth;
        const next = prev + 1;
        if (next >= maxScroll) {
          el.scrollTo({ left: 0 });
          return 0;
        } else {
          el.scrollTo({ left: next });
          return next;
        }
      });
    }, 20);

    return () => clearInterval(interval);
  }, [customImages, removedDefaults]);

  const activeDefaults = GALLERY_IMAGES.filter((src) => !removedDefaults.includes(src));
  const baseImages = [...customImages, ...activeDefaults];
  const allImages = baseImages.length > 0 ? [...baseImages, ...baseImages] : [];

  return (
    <section id="galeria" className="py-24 bg-secondary/30 overflow-hidden relative">
      <div className="max-w-5xl mx-auto px-4 md:px-6 mb-12 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          Nossos Trabalhos
        </motion.h2>
        <p className="text-muted-foreground mt-2">
          Confira alguns dos cortes e acabamentos feitos no nosso espaço.
        </p>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto no-scrollbar py-4 px-6 select-none"
      >
        {allImages.map((imgUrl, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-64 md:w-80 h-80 md:h-96 rounded-2xl overflow-hidden card-shadow border border-border/40 group relative"
          >
            <img
              src={imgUrl}
              alt={`Galeria ${index + 1}`}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          </div>
        ))}
      </div>
    </section>
  );
};
