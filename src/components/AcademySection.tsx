import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '../utils/whatsapp';

export const AcademySection: React.FC = () => {
  const courseMessage =
    'Olá! Vi o curso Dona Renata Academy e tenho interesse em aprender a ser barbeiro. Poderia me passar mais informações?';
  const whatsappUrl = buildGeneralWhatsAppLink(courseMessage);

  return (
    <section className="py-24 px-4 md:px-6 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-academy/10 border border-academy/30 text-academy text-sm font-semibold mb-4"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Curso Profissionalizante</span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-extrabold tracking-tight"
        >
          Dona Renata <span className="text-academy academy-text-glow">Academy</span>
        </motion.h2>
      </div>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl overflow-hidden border border-academy/30 academy-glow card-shadow max-w-3xl mx-auto"
        >
          <img
            src="https://i.imgur.com/QOkaCue.png"
            alt="Aluno do curso prático Dona Renata Academy"
            className="w-full h-auto object-contain"
            loading="lazy"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-2xl mx-auto text-center space-y-6"
        >
          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Aprenda a arte da barbearia com quem tem muitos anos de experiência. Curso prático para formar barbeiros profissionais.
          </p>

          <motion.div
            animate={{
              boxShadow: [
                '0 0 20px hsl(167 100% 50% / 0.4), 0 0 40px hsl(167 100% 50% / 0.2)',
                '0 0 30px hsl(167 100% 50% / 0.6), 0 0 60px hsl(167 100% 50% / 0.35)',
                '0 0 20px hsl(167 100% 50% / 0.4), 0 0 40px hsl(167 100% 50% / 0.2)',
              ],
              scale: [1, 1.03, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block rounded-xl"
          >
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-academy text-academy-foreground hover:bg-academy/90 font-bold text-base px-8 py-4 rounded-xl transition-all border-0 shadow-lg cursor-pointer"
            >
              <GraduationCap className="w-5 h-5 mr-1" />
              Quero Aprender
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
