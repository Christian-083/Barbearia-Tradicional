import React from 'react';
import { motion } from 'motion/react';
import { Star, CheckCircle, Quote } from 'lucide-react';
import { INITIAL_REVIEWS } from '../data/services';

export const ReviewsSection: React.FC = () => {
  return (
    <section id="avaliacoes" className="py-20 px-4 md:px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className="flex items-center justify-center gap-1 mb-3">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-5 h-5 fill-primary text-primary" />
          ))}
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
          O que dizem nossos clientes
        </h2>
        <p className="text-muted-foreground text-sm mt-2">
          Avaliações reais de quem frequenta A Tradicional Barbearia.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {INITIAL_REVIEWS.slice(0, 3).map((review, idx) => (
          <motion.div
            key={review.id || idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: idx * 0.1 }}
            className="p-6 rounded-3xl bg-card/70 border border-border/60 card-shadow flex flex-col justify-between space-y-4 relative"
          >
            <Quote className="w-8 h-8 text-primary/20 absolute top-4 right-4" />

            <div className="space-y-3">
              <div className="flex gap-1 text-primary">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary" />
                ))}
              </div>
              <p className="text-sm text-foreground/90 italic leading-relaxed">
                "{review.message}"
              </p>
            </div>

            <div className="pt-3 border-t border-border/40 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-sm text-foreground">
                  <span>{review.name}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-[11px] text-muted-foreground">{review.service}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{review.date}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};
