import React from 'react';
import { motion } from 'motion/react';
import { MessageSquare, Phone, Clock, Sparkles } from 'lucide-react';
import { buildGeneralWhatsAppLink } from '../utils/whatsapp';

export const ContactSection: React.FC = () => {
  const handleContact = () => {
    window.open(buildGeneralWhatsAppLink('Olá, tenho uma dúvida sobre a barbearia.'), '_blank');
  };

  return (
    <section className="py-24 px-4 md:px-6 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="glass rounded-3xl p-8 md:p-12 card-shadow flex flex-col items-center text-center border border-border/40"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4" />
          Atendimento rápido
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">
          Tem alguma <span className="text-primary">dúvida?</span>
        </h2>
        
        <p className="text-muted-foreground mb-10 max-w-lg mx-auto text-sm md:text-base">
          Fale diretamente com a gente pelo WhatsApp.
          <br className="hidden md:block" />
          Respondemos rapidinho!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl mb-10">
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/5 gap-3">
            <MessageSquare className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-gray-300">Resposta rápida</span>
          </div>
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/5 gap-3">
            <Phone className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-gray-300">Atendimento direto</span>
          </div>
          <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-black/40 border border-white/5 gap-3">
            <Clock className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium text-gray-300">Seg a Sáb</span>
          </div>
        </div>

        <button
          onClick={handleContact}
          className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl transition-all active:scale-95 text-base md:text-lg w-full md:w-auto"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
            <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
          </svg>
          Chamar no WhatsApp
        </button>
      </motion.div>
    </section>
  );
};
