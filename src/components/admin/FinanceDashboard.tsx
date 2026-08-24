import React, { useState, useMemo } from 'react';
import { DollarSign, TrendingUp, Users, CalendarCheck, Percent, PieChart, ShieldCheck, Download, Award, Receipt, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Booking, Barber, Comanda } from '../../types';
import { getExpenses, getSubscriptions } from '../../utils/storage';

interface FinanceDashboardProps {
  bookings: Booking[];
  completedBookings: Booking[];
  comandas: Comanda[];
  barbers: Barber[];
}

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({
  bookings,
  completedBookings,
  comandas,
  barbers,
}) => {
  const [periodFilter, setPeriodFilter] = useState<'today' | 'week' | 'month' | 'all'>('month');

  const expenses = useMemo(() => getExpenses(), []);
  const subscriptions = useMemo(() => getSubscriptions(), []);

  // Revenue breakdown
  const serviceRevenue = useMemo(() => {
    return comandas.reduce((acc, c) => {
      const servSum = c.items
        .filter((i) => i.type === 'service')
        .reduce((sum, i) => sum + i.price * i.quantity, 0);
      return acc + servSum;
    }, 0);
  }, [comandas]);

  const productRevenue = useMemo(() => {
    return comandas.reduce((acc, c) => {
      const prodSum = c.items
        .filter((i) => i.type === 'product')
        .reduce((sum, i) => sum + i.price * i.quantity, 0);
      return acc + prodSum;
    }, 0);
  }, [comandas]);

  const subscriptionRevenue = useMemo(() => {
    // Sum of active subscription monthly fees
    return subscriptions
      .filter((s) => s.status === 'active' || s.status === 'expiring')
      .reduce((acc, s) => {
        if (s.planId === 'plan-1') return acc + 150;
        if (s.planId === 'plan-2') return acc + 100;
        if (s.planId === 'plan-3') return acc + 180;
        return acc + 150;
      }, 0);
  }, [subscriptions]);

  const totalRevenueCompleted = useMemo(() => {
    return serviceRevenue + productRevenue + subscriptionRevenue;
  }, [serviceRevenue, productRevenue, subscriptionRevenue]);

  const totalCommissionsPaid = useMemo(() => {
    return comandas.reduce((acc, c) => acc + c.commissionTotal, 0);
  }, [comandas]);

  const totalExpensesPaid = useMemo(() => {
    return expenses
      .filter((e) => e.status === 'paid')
      .reduce((acc, e) => acc + e.amount, 0);
  }, [expenses]);

  // Real Net Profit Formula: Faturamento Total - Comissões - Despesas = Lucro Líquido Real
  const realNetProfit = useMemo(() => {
    return totalRevenueCompleted - totalCommissionsPaid - totalExpensesPaid;
  }, [totalRevenueCompleted, totalCommissionsPaid, totalExpensesPaid]);

  // Receivables Forecast from Active Bookings
  const receivablesForecast = useMemo(() => {
    return bookings
      .filter((b) => b.status !== 'completed' && !b.paidByPlan)
      .reduce((acc, b) => acc + (b.price || 0), 0);
  }, [bookings]);

  // Average Ticket Per Customer
  const averageTicket = useMemo(() => {
    if (comandas.length === 0) return 0;
    return totalRevenueCompleted / comandas.length;
  }, [comandas, totalRevenueCompleted]);

  // Barber Commission Breakdown
  const barberCommissionStats = useMemo(() => {
    return barbers.map((barber) => {
      const barberComandas = comandas.filter((c) => c.barberId === barber.id || c.barberName === barber.name);
      const totalGenerated = barberComandas.reduce((acc, c) => acc + c.total, 0);
      const commissionEarned = barberComandas.reduce((acc, c) => acc + c.commissionTotal, 0);
      const servicesCount = barberComandas.reduce((acc, c) => {
        return acc + c.items.filter((i) => i.type === 'service').length;
      }, 0);
      const productsCount = barberComandas.reduce((acc, c) => {
        return acc + c.items.filter((i) => i.type === 'product').length;
      }, 0);

      return {
        barber,
        totalGenerated,
        commissionEarned,
        servicesCount,
        productsCount,
        comandasCount: barberComandas.length,
      };
    });
  }, [barbers, comandas]);

  return (
    <div className="space-y-8">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card border border-border p-4 rounded-2xl">
        <div>
          <h3 className="text-lg font-bold text-foreground">Dashboard Financeiro de Alta Precisão</h3>
          <p className="text-xs text-muted-foreground">Faturamento, DRE simplificado, comissões e previsão de caixa.</p>
        </div>

        <div className="flex items-center gap-2">
          {(['today', 'week', 'month', 'all'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriodFilter(p)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                periodFilter === p
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
            >
              {p === 'today' ? 'Hoje' : p === 'week' ? 'Esta Semana' : p === 'month' ? 'Este Mês' : 'Geral'}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Faturamento Total */}
        <div className="p-5 rounded-3xl bg-card border border-border card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Faturamento Total</span>
            <div className="p-2 rounded-xl bg-primary/20 text-primary">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-extrabold text-foreground">R$ {totalRevenueCompleted.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-[11px] text-muted-foreground">
              Serviços (R$ {serviceRevenue}) + Prod (R$ {productRevenue}) + VIP (R$ {subscriptionRevenue})
            </p>
          </div>
        </div>

        {/* Despesas & Comissões */}
        <div className="p-5 rounded-3xl bg-card border border-border card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Custos & Comissões</span>
            <div className="p-2 rounded-xl bg-destructive/20 text-destructive">
              <ArrowDownRight className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-extrabold text-destructive">R$ {(totalCommissionsPaid + totalExpensesPaid).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            <p className="text-[11px] text-muted-foreground">
              Comissões (R$ {totalCommissionsPaid.toFixed(2)}) + Despesas (R$ {totalExpensesPaid.toFixed(2)})
            </p>
          </div>
        </div>

        {/* Lucro Líquido Real */}
        <div className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950/40 via-card to-card border border-emerald-500/40 card-shadow flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">Lucro Líquido Real</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-3xl font-extrabold text-emerald-400">
              R$ {realNetProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
            <p className="text-[11px] text-emerald-300/80 font-bold">
              Faturamento - Comissões - Despesas Realizadas
            </p>
          </div>
        </div>

        {/* Ticket Médio */}
        <div className="p-5 rounded-3xl bg-card border border-border card-shadow flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Ticket Médio & Agenda</span>
            <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <p className="text-2xl font-extrabold text-foreground">R$ {averageTicket.toFixed(2)}</p>
            <p className="text-[11px] text-amber-400 font-bold">
              + R$ {receivablesForecast.toFixed(2)} previstos na agenda
            </p>
          </div>
        </div>
      </div>

      {/* Commission Report Per Barber */}
      <div className="bg-card border border-border rounded-3xl p-6 card-shadow space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/20 text-primary rounded-xl">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-base text-foreground">Relatório de Comissões por Barbeiro</h4>
              <p className="text-xs text-muted-foreground">
                Cálculo automático baseado nas taxas individuais de Serviços e Produtos
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
            Total a Pagar: R$ {totalCommissionsPaid.toFixed(2)}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {barberCommissionStats.map(({ barber, totalGenerated, commissionEarned, servicesCount, productsCount, comandasCount }) => (
            <div
              key={barber.id}
              className="p-5 rounded-2xl bg-secondary/50 border border-border flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xl border-2 border-primary/40 shrink-0">
                  {barber.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold text-base text-foreground">{barber.name}</h5>
                  <p className="text-xs text-muted-foreground">
                    Taxas: <strong className="text-primary">{barber.commissionServicePercent}%</strong> Serv |{' '}
                    <strong className="text-emerald-400">{barber.commissionProductPercent}%</strong> Prod
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-muted-foreground pt-2 border-t border-border/50">
                <div className="flex justify-between">
                  <span>Atendimentos / Comandas:</span>
                  <strong className="text-foreground">{comandasCount}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Serviços x Produtos:</span>
                  <strong className="text-foreground">{servicesCount} serv. / {productsCount} prod.</strong>
                </div>
                <div className="flex justify-between">
                  <span>Faturamento Gerado:</span>
                  <strong className="text-foreground">R$ {totalGenerated.toFixed(2)}</strong>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-primary/10 border border-primary/20 flex justify-between items-center text-sm">
                <span className="font-bold text-foreground text-xs">Comissão A Pagar:</span>
                <span className="font-extrabold text-primary text-base">R$ {commissionEarned.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comandas History Summary Table */}
      <div className="bg-card border border-border rounded-3xl p-6 card-shadow space-y-4">
        <h4 className="font-bold text-base text-foreground">Histórico de Comandas Fechadas</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase bg-secondary/60 text-muted-foreground border-b border-border">
              <tr>
                <th className="p-3">ID Comanda</th>
                <th className="p-3">Cliente</th>
                <th className="p-3">Barbeiro</th>
                <th className="p-3">Itens</th>
                <th className="p-3">Pagamento</th>
                <th className="p-3 text-right">Comissão</th>
                <th className="p-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {comandas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-muted-foreground text-xs">
                    Nenhuma comanda registrada ainda. Utilize a opção "Fechar Comanda" na agenda.
                  </td>
                </tr>
              ) : (
                comandas.map((c) => (
                  <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="p-3 font-mono text-xs text-primary font-bold">{c.id}</td>
                    <td className="p-3 font-bold text-foreground">{c.customerName}</td>
                    <td className="p-3 text-muted-foreground">{c.barberName}</td>
                    <td className="p-3 text-xs text-muted-foreground">
                      {c.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                    </td>
                    <td className="p-3 font-semibold text-xs text-foreground">
                      <span className="px-2.5 py-1 rounded-full bg-secondary border border-border">
                        {c.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3 text-right text-primary font-bold text-xs">
                      R$ {c.commissionTotal.toFixed(2)}
                    </td>
                    <td className="p-3 text-right font-extrabold text-foreground">
                      R$ {c.total.toFixed(2)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
