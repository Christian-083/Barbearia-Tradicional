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
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
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

      <img
        src={IMAGES.hero}
        alt="A Tradicional Barbearia"
        onError={(e) => {
          const target = e.currentTarget as HTMLImageElement;
          if (!target.dataset.tried1) {
            target.dataset.tried1 = 'true';
            target.src = '/Barbearia_Tradicional/Barbearia_Tradicional TOPO.jpg';
          } else if (!target.dataset.tried2) {
            target.dataset.tried2 = 'true';
            target.src = '/Barbearia_Tradicional/Barbearia_Tradicional_TOPO.jpg';
          }
        }}
        className="absolute inset-0 w-full h-full object-cover object-top opacity-40"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 text-center px-6 max-w-4xl"
      >
        <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass card-shadow text-sm font-medium">
          <span
            className={`w-2 h-2 rounded-full animate-pulse ${
              openStatus ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span>{openStatus ? 'Aberto Agora' : 'Fechado Agora'}</span>
        </div>

        <h1 className="text-4xl md:text-7xl font-bold mb-6 tracking-tight">
          Onde a tradição encontra o{' '}
          <span className="text-primary">estilo moderno.</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
          Cortes de precisão, ambiente exclusivo e o cuidado que você merece.
          Agende sua experiência com Dona Renata.
        </p>

        <motion.button
          onClick={scrollToBooking}
          animate={{
            boxShadow: [
              '0 0 20px hsl(14 65% 38% / 0.3), 0 0 40px hsl(14 65% 38% / 0.15)',
              '0 0 30px hsl(14 65% 38% / 0.5), 0 0 60px hsl(14 65% 38% / 0.3)',
              '0 0 20px hsl(14 65% 38% / 0.3), 0 0 40px hsl(14 65% 38% / 0.15)',
            ],
            scale: [1, 1.03, 1],
          }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-flex items-center gap-3 px-8 py-4 bg-primary text-primary-foreground font-bold rounded-xl transition-all active:scale-95 text-lg cursor-pointer"
        >
          Agendar Horário
        </motion.button>
      </motion.div>
    </section>
  );
};

