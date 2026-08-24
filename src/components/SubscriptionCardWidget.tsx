import React, { useState } from 'react';
import { Sparkles, Shield, Check, Phone, ArrowRight, CreditCard, Award } from 'lucide-react';
import { WHITELABEL_CONFIG } from '../config/whitelabel';
import { findActiveSubscriptionByPhone } from '../utils/storage';
import { buildWhatsAppLink, formatPhoneMask } from '../utils/whatsapp';

export const SubscriptionCardWidget: React.FC = () => {
  const [searchPhone, setSearchPhone] = useState<string>('');
  const [activeSub, setActiveSub] = useState<any | null>(null);
  const [searched, setSearched] = useState<boolean>(false);

  const handleCheckPass = () => {
    if (!searchPhone || searchPhone.length < 10) return;
    const sub = findActiveSubscriptionByPhone(searchPhone);
    setActiveSub(sub);
    setSearched(true);
  };

  const handleSubscribeWA = (planName: string, price: number) => {
    const message = `👑 *ASSINATURA VIP ${WHITELABEL_CONFIG.shortName.toUpperCase()}* 👑
Olá! Quero assinar o *${planName}* no valor de *R$ ${price},00/mês*.

Por favor, me envie a chave PIX ou link de pagamento para ativar meu cartão VIP! ✂️💳`;

    window.open(buildWhatsAppLink(WHITELABEL_CONFIG.phone, message), '_blank');
  };

  return (
    <section id="assinaturas" className="py-20 px-4 md:px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          CLUBE VIP & RECORRÊNCIA
        </span>
        <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mt-3">
          Corte Cabelo & Barba sem Limites
        </h2>
        <p className="text-muted-foreground mt-2 text-sm md:text-base max-w-2xl mx-auto">
          Economize até 40% no mês com nossos Cartões de Assinatura VIP. Baixa automática direto no seu WhatsApp!
        </p>
      </div>

      {/* Subscription Card Checker Widget */}
      <div className="mb-14 p-6 md:p-8 rounded-3xl bg-gradient-to-r from-card via-card/90 to-primary/10 border border-primary/30 card-shadow max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2.5 rounded-2xl bg-primary text-primary-foreground font-extrabold">
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base text-foreground">Consulte seu Cartão VIP</h3>
            <p className="text-xs text-muted-foreground">Digite seu WhatsApp para ver saldo de cortes e validade</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="tel"
            value={searchPhone}
            onChange={(e) => {
              setSearchPhone(formatPhoneMask(e.target.value));
              setSearched(false);
            }}
            placeholder="(84) 99999-9999"
            className="flex-1 bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
          />
          <button
            onClick={handleCheckPass}
            className="px-6 py-3 bg-primary text-primary-foreground font-extrabold rounded-xl text-sm hover:bg-primary/90 transition-all cursor-pointer whitespace-nowrap"
          >
            Ver Meus Cortes
          </button>
        </div>

        {searched && (
          <div className="mt-4 pt-4 border-t border-border">
            {activeSub ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm flex items-center gap-1.5">
                    <Award className="w-4 h-4" /> {activeSub.planName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500 text-black font-extrabold text-[10px] uppercase">
                    Status: Plano Ativo
                  </span>
                </div>
                <p className="text-xs text-foreground font-semibold">
                  Cliente: {activeSub.customerName} ({activeSub.customerPhone})
                </p>
                <div className="flex justify-between text-xs text-muted-foreground pt-1 border-t border-emerald-500/20">
                  <span>Cortes Restantes: <strong className="text-emerald-400">{activeSub.remainingCuts === -1 ? 'Ilimitado' : activeSub.remainingCuts}</strong></span>
                  <span>Validade: <strong className="text-foreground">{activeSub.expiryDate}</strong></span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-secondary/80 border border-border text-center text-xs text-muted-foreground">
                Nenhum Cartão VIP ativo encontrado para o WhatsApp informando. Assine um plano abaixo!
              </div>
            )}
          </div>
        )}
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {WHITELABEL_CONFIG.defaultPlans.map((plan, idx) => (
          <div
            key={plan.id}
            className={`p-6 md:p-8 rounded-3xl bg-card border ${
              idx === 0 ? 'border-primary/50 shadow-[0_0_30px_-5px_hsl(45_97%_54%/0.2)]' : 'border-border'
            } flex flex-col justify-between space-y-6 relative overflow-hidden group`}
          >
            {idx === 0 && (
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full shadow-md">
                Mais Vendido
              </div>
            )}

            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-4">
                <Sparkles className="w-6 h-6" />
              </div>

              <h3 className="font-extrabold text-xl text-foreground">{plan.name}</h3>
              <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{plan.description}</p>

              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-3xl md:text-4xl font-extrabold text-primary">R$ {plan.priceMonthly}</span>
                <span className="text-xs text-muted-foreground font-semibold">/mês</span>
              </div>
            </div>

            <button
              onClick={() => handleSubscribeWA(plan.name, plan.priceMonthly)}
              className="w-full py-3.5 bg-primary text-primary-foreground font-extrabold rounded-xl text-xs hover:bg-primary/90 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-[0_0_15px_-3px_hsl(45_97%_54%/0.4)]"
            >
              Assinar via WhatsApp <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
