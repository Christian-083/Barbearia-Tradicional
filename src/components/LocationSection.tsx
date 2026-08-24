import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { IMAGES } from '../config/images';

export const LocationSection: React.FC = () => {
  const handleOpenDirections = () => {
    window.open(
      'https://www.google.com/maps/dir/?api=1&destination=Avenida+Governador+Pl%C3%A1cido+Aderaldo+Castelo+branco+535,+Lagoa+Seca,+Juazeiro+do+Norte+-+CE',
      '_blank'
    );
  };

  return (
    <section className="py-24 px-4 md:px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-4 md:p-8 card-shadow space-y-6"
      >
        <div className="w-full h-64 md:h-[400px] rounded-2xl overflow-hidden bg-muted relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3972.88!2d-37.3237885!3d-5.2286549!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMTMnNDMuMiJTIDM3wrAxOScyNS42Ilc!5e0!3m2!1spt-BR!2sbr!4v1620000000000!5m2!1spt-BR!2sbr"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            title="Localização Barbearia Seu Galdino"
            className="absolute inset-0"
          />
        </div>

        <button
          onClick={handleOpenDirections}
          className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl transition-all hover:opacity-90 active:scale-[0.98] glow-shadow cursor-pointer"
        >
          📍 Ir até a Barbearia
        </button>

        <img 
          src={IMAGES.fachada} 
          alt="Fachada da Barbearia"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (!target.dataset.tried) {
              target.dataset.tried = 'true';
              target.src = '/Image/Fachada_Barbearia.jpg';
            }
          }}
          className="w-full h-48 md:h-64 object-cover rounded-2xl"
        />

        <div className="text-center pt-2 pb-2">
          <p className="font-bold text-lg">
            Rua Ten. Matoso, 106
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Conjunto Vida Nova • Próximo ao Mercadinho do Bairro
          </p>
        </div>
      </motion.div>
    </section>
  );
};

