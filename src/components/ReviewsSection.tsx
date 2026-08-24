import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Star } from 'lucide-react';

const REVIEWS_IMAGES = [
  "https://barbearia-e.netlify.app/assets/depoimento-2-KnB4UowP.png",
  "https://barbearia-e.netlify.app/assets/depoimento-3-CQpzjvcR.png",
  "https://barbearia-e.netlify.app/assets/depoimento-4-FSJQf-XH.png",
  "https://barbearia-e.netlify.app/assets/depoimento-5-DVlb23Bf.png",
  "https://barbearia-e.netlify.app/assets/depoimento-6-CeudhoFU.png",
];

export const ReviewsSection: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [, setScrollPos] = useState(0);
  
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
  }, []);

  const allImages = [...REVIEWS_IMAGES, ...REVIEWS_IMAGES, ...REVIEWS_IMAGES, ...REVIEWS_IMAGES, ...REVIEWS_IMAGES];

  return (
    <section className="py-24 px-4 md:px-6 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center gap-2 mb-10"
      >
        <h2 className="text-3xl font-bold text-primary">Avaliações</h2>
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <Star key={i} className="w-5 h-5 fill-primary text-primary" />
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto no-scrollbar pb-4 select-none"
        style={{ scrollBehavior: 'auto' }}
      >
        {allImages.map((src, idx) => (
          <div key={idx} className="flex-shrink-0 w-[260px] md:w-[320px] rounded-xl overflow-hidden pointer-events-none">
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
