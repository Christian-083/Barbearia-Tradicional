import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { isOpenNow } from '../utils/whatsapp';
import { IMAGES } from '../config/images';

export const HeaderHero: React.FC = () => {
  const [openStatus, setOpenStatus] = useState<boolean>(isOpenNow());

  useEffect(() => {
    const interval = setInterval(() => setOpenStatus(isOpenNow()), 60000);
    return () => clearInterval(interval);
  }, []);

  const scrollToBooking = () => {
    const el = document.getElementById('agendar');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-background">
      {/* Background Image */}
      <img
        src={IMAGES.hero}
        alt="Barbearia Tradicional TOPO"
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          if (!target.dataset.tried) {
            target.dataset.tried = 'true';
            target.src = '/Image/Barbearia_Tradicional TOPO.jpg';
          }
        }}
        className="absolute inset-0 w-full h-full object-cover object-top opacity-50"
      />
      
      {/* Bottom Shading Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />

      {/* Top Header Bar with Admin Link */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-card/80 hover:bg-card border border-border text-xs font-bold text-foreground backdrop-blur-md transition-all shadow-lg cursor-pointer hover:border-primary/50"
        >
          <Shield className="w-4 h-4 text-primary" />
          <span>Painel Administrativo</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm text-sm font-medium">
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              openStatus ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-gray-200">{openStatus ? 'Aberto Agora' : 'Fechado Agora'}</span>
        </div>

        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          Onde a tradição encontra <br />
          o <span className="text-primary font-black">estilo moderno.</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto font-normal">
          Cortes de precisão, ambiente exclusivo e o cuidado que você merece. <br className="hidden md:block" />
          Agende sua experiência com o mestre Seu Galdino.
        </p>

        <button
          onClick={scrollToBooking}
          className="inline-flex items-center justify-center px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all active:scale-95 text-lg"
        >
          Agendar Horário
        </button>
      </motion.div>
    </section>
  );
};
