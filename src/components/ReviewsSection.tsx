import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const REVIEWS = [
  "https://barbearia-e.netlify.app/assets/depoimento-1-BmKDqp4_.png",
  "https://barbearia-e.netlify.app/assets/depoimento-2-KnB4UowP.png",
  "https://barbearia-e.netlify.app/assets/depoimento-3-CQpzjvcR.png",
  "https://barbearia-e.netlify.app/assets/depoimento-4-FSJQf-XH.png",
  "https://barbearia-e.netlify.app/assets/depoimento-5-DVlb23Bf.png",
  "https://barbearia-e.netlify.app/assets/depoimento-6-CeudhoFU.png",
];

export const ReviewsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    let scrollPosition = 0;
    const interval = setInterval(() => {
      scrollPosition += 1;
      // When reached the end, loop back
      if (scrollPosition >= el.scrollWidth - el.clientWidth) {
        scrollPosition = 0;
        el.scrollTo({ left: 0 });
      } else {
        el.scrollTo({ left: scrollPosition });
      }
    }, 20);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="avaliacoes" className="py-24 px-4 md:px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-2 mb-10"
      >
        <h2 className="text-3xl font-bold text-primary">Avaliações</h2>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star key={s} className="w-5 h-5 fill-primary text-primary" />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-4"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {REVIEWS.map((src, idx) => (
          <div key={idx} className="flex-shrink-0 w-[260px] md:w-[320px] rounded-xl overflow-hidden">
            <img
              src={src}
              alt={`Avaliação ${idx + 1}`}
              loading="lazy"
              className="w-full h-[60px] md:h-[70px] object-cover object-top"
            />
          </div>
        ))}
      </motion.div>
    </section>
  );
};
