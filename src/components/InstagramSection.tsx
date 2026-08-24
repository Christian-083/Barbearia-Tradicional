import React from 'react';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';

export const InstagramSection: React.FC = () => {
  return (
    <section className="py-24 px-4 md:px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass p-6 md:p-8 rounded-3xl card-shadow space-y-6 border border-border/40"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center tracking-tight">
          Siga no Instagram
        </h2>

        <div className="w-full flex justify-center">
          <img
            src="/images/Barbearia-Instragram.jpeg"
            alt="Instagram A Tradicional Barbearia"
            className="w-full h-auto max-h-[500px] object-contain rounded-2xl"
          />
        </div>

        <a
          href="https://www.instagram.com/a_tradicional_barbearia"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-xl font-bold text-foreground transition-all hover:opacity-90 active:scale-95 text-base cursor-pointer shadow-lg"
        >
          <Instagram className="w-5 h-5" />
          Seguir no Instagram
        </a>
      </motion.div>
    </section>
  );
};
