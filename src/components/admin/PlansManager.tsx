import React, { useState } from 'react';
import { ShieldCheck, Plus, Sparkles, Clock, AlertTriangle, RefreshCw, MessageCircle, User, Phone, Check, Scissors } from 'lucide-react';
import { Plan, CustomerSubscription } from '../../types';
import { PLANS } from '../../data/services';
import { buildWhatsAppLink } from '../../utils/whatsapp';

interface PlansManagerProps {
  plans: Plan[];
  subscriptions: CustomerSubscription[];
  onSavePlans: (plans: Plan[]) => void;
  onSaveSubscriptions: (subs: CustomerSubscription[]) => void;
}

export const PlansManager: React.FC<PlansManagerProps> = ({
  plans,
  subscriptions,
  onSavePlans,
  onSaveSubscriptions,
}) => {
  // New Subscription Modal state
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubPhone, setNewSubPhone] = useState('');
  const [newSubPlanId, setNewSubPlanId] = useState(plans[0]?.id || 'plan-1');

  // Add New Subscription
  const handleAddSubscription = () => {
    if (!newSubName.trim() || !newSubPhone.trim()) return;

    const plan = plans.find((p) => p.id === newSubPlanId) || plans[0];
    const today = new Date();
    const expiry = new Date();
    expiry.setDate(today.getDate() + 30);

    const newSub: CustomerSubscription = {
      id: `sub-${Date.now()}`,
      customerName: newSubName.trim(),
      customerPhone: newSubPhone.trim(),
      planId: plan.id,
      planName: plan.name,
      startDate: today.toLocaleDateString('pt-BR'),
      expiryDate: expiry.toLocaleDateString('pt-BR'),
      remainingCuts: plan.cutsPerMonth,
      status: 'active',
    };

    onSaveSubscriptions([newSub, ...subscriptions]);

    setNewSubName('');
    setNewSubPhone('');
    setShowAddSubModal(false);
  };

  // Send Renewal Link via WhatsApp
  const handleSendRenewalWhatsApp = (sub: CustomerSubscription) => {
    const text = `✂️ *BARBEARIA SEU GALDINO* ✂️
Olá *${sub.customerName}*! 👋
Seu plano recorrente *${sub.planName}* está vencendo ou com saldo baixo.

Deseja realizar a renovação para garantir seus horários no mês?
Basta responder com 'SIM' para enviarmos a chave PIX de renovação! 💈`;

    const cleanPhone = sub.customerPhone.replace(/\D/g, '');
    window.open(buildWhatsAppLink(cleanPhone, text), '_blank');
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border border-primary/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" /> Gestão de Recorrência & Fidelização
          </div>
          <h3 className="text-xl font-extrabold text-foreground">Planos Mensais & Baixa Automática</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-xl">
            Quando o cliente mensalista agendar no site ou no WhatsApp, o sistema reconhece o plano ativo e abate o crédito automaticamente.
          </p>
        </div>

        <button
          onClick={() => setShowAddSubModal(true)}
          className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-extrabold text-xs flex items-center gap-2 hover:bg-primary/90 transition-all cursor-pointer shadow-[0_0_15px_-3px_hsl(45_97%_54%/0.4)]"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Novo Cliente Mensalista
        </button>
      </div>

      {/* Available Plans Grid */}
      <div className="space-y-4">
        <h4 className="font-bold text-base text-foreground">Planos Oferecidos pela Barbearia</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-2xl bg-card border border-border card-shadow flex flex-col justify-between space-y-4 relative overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-extrabold text-lg text-foreground">{p.name}</h5>
                  <ShieldCheck className="w-5 h-5 text-primary" />
                </div>
                <p className="text-2xl font-black text-primary">
                  R$ {p.priceMonthly},00
                  <span className="text-xs font-normal text-muted-foreground">/mês</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{p.description}</p>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Franquia:</span>
                <span className="font-bold text-foreground">
                  {p.cutsPerMonth === -1 ? 'Cortes Ilimitados ⚡' : `${p.cutsPerMonth} cortes/mês`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subscriptions List (Active & Expiring Alerts) */}
      <div className="bg-card border border-border rounded-3xl p-6 card-shadow space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <h4 className="font-bold text-base text-foreground">Assinaturas Ativas de Clientes</h4>
            <p className="text-xs text-muted-foreground">
              Monitoramento em tempo real de saldo e vencimentos
            </p>
          </div>

          {/* Alert badge count */}
          <div className="flex gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-xs">
              {subscriptions.filter((s) => s.status === 'active').length} Ativos
            </span>
            <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {subscriptions.filter((s) => s.status === 'expiring' || s.remainingCuts === 0).length} Vencendo / Perto do Fim
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-secondary/60 text-muted-foreground border-b border-border">
              <tr>
                <th className="p-3">Cliente</th>
                <th className="p-3">WhatsApp</th>
                <th className="p-3">Plano</th>
                <th className="p-3">Início / Vencimento</th>
                <th className="p-3 text-center">Saldo de Cortes</th>
                <th className="p-3 text-center">Status</th>
                <th className="p-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {subscriptions.map((sub) => {
                const isExpiring = sub.status === 'expiring' || sub.remainingCuts === 0;

                return (
                  <tr key={sub.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-3 font-bold text-foreground">{sub.customerName}</td>
                    <td className="p-3 text-xs text-muted-foreground">{sub.customerPhone}</td>
                    <td className="p-3 font-semibold text-xs text-primary">{sub.planName}</td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {sub.startDate} até <strong className="text-foreground">{sub.expiryDate}</strong>
                    </td>
                    <td className="p-3 text-center font-bold text-sm">
                      {sub.remainingCuts === -1 ? (
                        <span className="text-emerald-400">Ilimitado 🔥</span>
                      ) : (
                        <span className={sub.remainingCuts === 0 ? 'text-destructive font-black' : 'text-foreground'}>
                          {sub.remainingCuts} restante(s)
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          sub.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : sub.status === 'expiring'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                            : 'bg-destructive/10 text-destructive border border-destructive/20'
                        }`}
                      >
                        {sub.status === 'active'
                          ? 'Ativo'
                          : sub.status === 'expiring'
                          ? 'Vencendo Logo'
                          : 'Vencido'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleSendRenewalWhatsApp(sub)}
                        className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-xs flex items-center gap-1.5 ml-auto cursor-pointer"
                        title="Enviar lembrete de renovação via WhatsApp"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Renovar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Registering New Customer Subscription */}
      {showAddSubModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl">
            <h3 className="text-lg font-bold text-foreground">Cadastrar Assinante Mensalista</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                  Nome do Cliente
                </label>
                <input
                  type="text"
                  value={newSubName}
                  onChange={(e) => setNewSubName(e.target.value)}
                  placeholder="Ex: Carlos Eduardo"
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                  WhatsApp (Formato do agendamento)
                </label>
                <input
                  type="tel"
                  value={newSubPhone}
                  onChange={(e) => setNewSubPhone(e.target.value)}
                  placeholder="(84) 99999-9999"
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                  Plano Escolhido
                </label>
                <select
                  value={newSubPlanId}
                  onChange={(e) => setNewSubPlanId(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none font-bold"
                >
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - R$ {p.priceMonthly}/mês
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setShowAddSubModal(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddSubscription}
                disabled={!newSubName.trim() || !newSubPhone.trim()}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs disabled:opacity-50"
              >
                Ativar Plano
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
