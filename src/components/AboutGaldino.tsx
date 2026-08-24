import React from 'react';
import { motion } from 'motion/react';

export const AboutGaldino: React.FC = () => {
  return (
    <section className="py-24 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        <img
          src="/images/about.jpg"
          alt="Dona Renata"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = '/images/person.jpg';
          }}
          className="rounded-3xl w-full aspect-[4/5] object-cover object-center card-shadow border border-border/40"
        />
        <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-primary text-primary-foreground p-4 md:p-6 rounded-2xl shadow-[0_10px_25px_-5px_hsl(14_65%_38%/0.5)]">
          <p className="font-bold text-lg md:text-xl leading-tight">Muitos Anos</p>
          <p className="text-sm opacity-80 uppercase tracking-tighter">De Experiência</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight">
          Dona Renata{' '}
          <span className="text-primary block text-xl md:text-2xl opacity-80 font-normal mt-1">
            (A Tradicional Barbearia)
          </span>
        </h2>
        <p className="text-lg md:text-xl italic text-muted-foreground leading-relaxed">
          "Um bom corte vai além da aparência — ele levanta a autoestima, valoriza seu estilo e faz você se sentir ainda mais confiante. Visual em dia é respeito com você mesmo."
        </p>
      </motion.div>
    </section>
  );
};

