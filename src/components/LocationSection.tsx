import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { IMAGES } from '../config/images';

export const LocationSection: React.FC = () => {
  const handleOpenDirections = () => {
    window.open(
      'https://www.google.com/maps/dir/?api=1&destination=Avenida+Governador+Pl%C3%A1cido+Aderaldo+Castelo+branco+535,+Lagoa+Seca,+Juazeiro+do+Norte+-+CE',
      '_blank'
    );
  };

  return (
    <section className="py-20 px-4 md:px-6 max-w-3xl mx-auto space-y-6">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-extrabold text-center tracking-tight text-foreground"
      >
        Localização
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-[#151515] p-3 md:p-5 rounded-[2rem] border border-white/5 shadow-2xl space-y-4"
      >
        {/* Map iframe */}
        <div className="w-full h-56 md:h-72 rounded-2xl overflow-hidden relative">
          <iframe
            title="Mapa"
            src="https://maps.google.com/maps?q=Avenida%20Governador%20Pl%C3%A1cido%20Aderaldo%20Castelo%20branco%20535%20-%20Lagoa%20Seca%2C%20Juazeiro%20do%20Norte%20-%20CE&t=&z=15&ie=UTF8&iwloc=&output=embed"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleOpenDirections}
          className="w-full py-4 bg-primary text-primary-foreground font-extrabold text-sm rounded-xl transition-all hover:brightness-110 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
        >
          <MapPin className="w-5 h-5" />
          Ir até a Barbearia
        </button>

        {/* Location Image */}
        <div className="w-full h-44 sm:h-56 md:h-64 rounded-xl overflow-hidden">
          <img 
            src={IMAGES.fachada} 
            alt="Fachada A Tradicional Barbearia" 
            onError={(e) => {
              const target = e.currentTarget as HTMLImageElement;
              if (!target.dataset.tried1) {
                target.dataset.tried1 = 'true';
                target.src = '/Barbearia_Tradicional/Fachada_Barbearia.jpg';
              }
            }}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Address */}
        <div className="text-center pt-2 pb-2">
          <p className="text-white font-bold text-base md:text-lg tracking-wide">Avenida Gov. Plácido Aderaldo Castelo branco, 535</p>
          <p className="text-muted-foreground text-[11px] md:text-xs mt-1 font-medium">
            Lagoa Seca, Juazeiro do Norte - CE • 63040-540
          </p>
        </div>
      </motion.div>
    </section>
  );
};

