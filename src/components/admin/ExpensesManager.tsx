import React, { useState } from 'react';
import { DollarSign, Plus, CheckCircle2, Clock, Trash2, Tag, Calendar, Building, FileText } from 'lucide-react';
import { Expense } from '../../types';
import { getExpenses, saveExpenses, addExpense } from '../../utils/storage';

export const ExpensesManager: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>(() => getExpenses());

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  // Form State
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<Expense['category']>('Insumos/Produtos');
  const [type, setType] = useState<Expense['type']>('Variável');
  const [amount, setAmount] = useState<number>(150);
  const [dueDate, setDueDate] = useState<string>(new Date().toLocaleDateString('pt-BR'));
  const [recipient, setRecipient] = useState<string>('');
  const [status, setStatus] = useState<'pending' | 'paid'>('paid');

  const refreshData = () => {
    setExpenses(getExpenses());
  };

  const handleSaveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const newExpense: Expense = {
      id: `exp-${Date.now()}`,
      description,
      category,
      type,
      amount,
      dueDate,
      paymentDate: status === 'paid' ? new Date().toLocaleDateString('pt-BR') : undefined,
      status,
      recipient,
    };

    addExpense(newExpense);
    setShowAddModal(false);
    setDescription('');
    setRecipient('');
    setAmount(150);
    refreshData();
  };

  const handleToggleStatus = (id: string) => {
    const list = getExpenses();
    const updated = list.map((exp) => {
      if (exp.id === id) {
        const nextStatus = exp.status === 'paid' ? ('pending' as const) : ('paid' as const);
        return {
          ...exp,
          status: nextStatus,
          paymentDate: nextStatus === 'paid' ? new Date().toLocaleDateString('pt-BR') : undefined,
        };
      }
      return exp;
    });
    saveExpenses(updated);
    refreshData();
  };

  const handleDeleteExpense = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta despesa?')) {
      const updated = getExpenses().filter((exp) => exp.id !== id);
      saveExpenses(updated);
      refreshData();
    }
  };

  const totalFixed = expenses
    .filter((e) => e.type === 'Fixa')
    .reduce((acc, e) => acc + e.amount, 0);

  const totalVariable = expenses
    .filter((e) => e.type === 'Variável')
    .reduce((acc, e) => acc + e.amount, 0);

  const totalPaid = expenses
    .filter((e) => e.status === 'paid')
    .reduce((acc, e) => acc + e.amount, 0);

  const totalPending = expenses
    .filter((e) => e.status === 'pending')
    .reduce((acc, e) => acc + e.amount, 0);

  const filteredExpenses = expenses.filter((e) => {
    if (filterCategory !== 'all' && e.category !== filterCategory) return false;
    if (filterType !== 'all' && e.type !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-card border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-destructive/20 text-destructive border border-destructive/30">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">Gestão de Despesas & Fluxo de Caixa</h2>
            <p className="text-xs text-muted-foreground">
              Lançamento de contas fixas, insumos e custos operacionais para apurar o Lucro Líquido Real.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl hover:bg-primary/90 transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_-3px_hsl(45_97%_54%/0.4)]"
        >
          <Plus className="w-4 h-4" /> Lanzar Nova Despesa
        </button>
      </div>

      {/* Expense KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-wider">Despesas Fixas</span>
          <p className="text-lg font-extrabold text-foreground">R$ {totalFixed.toLocaleString('pt-BR')},00</p>
          <p className="text-[10px] text-muted-foreground">Aluguel, Luz, Água, Internet</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-border space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-muted-foreground tracking-wider">Despesas Variáveis</span>
          <p className="text-lg font-extrabold text-foreground">R$ {totalVariable.toLocaleString('pt-BR')},00</p>
          <p className="text-[10px] text-muted-foreground">Compra de Insumos & Produtos</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-emerald-500/30 bg-emerald-500/5 space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-emerald-400 tracking-wider">Total Já Pago</span>
          <p className="text-lg font-extrabold text-emerald-400">R$ {totalPaid.toLocaleString('pt-BR')},00</p>
          <p className="text-[10px] text-emerald-400/80">Quitadas no caixa</p>
        </div>

        <div className="p-4 rounded-2xl bg-card border border-amber-500/30 bg-amber-500/5 space-y-1">
          <span className="text-[10px] uppercase font-extrabold text-amber-400 tracking-wider">A Pagar (Pendente)</span>
          <p className="text-lg font-extrabold text-amber-400">R$ {totalPending.toLocaleString('pt-BR')},00</p>
          <p className="text-[10px] text-amber-400/80">Contas a vencer</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-border">
        <div className="flex items-center gap-2 flex-wrap text-xs">
          <span className="font-bold text-muted-foreground">Filtros:</span>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-secondary border border-border rounded-xl px-3 py-1.5 font-bold text-foreground outline-none"
          >
            <option value="all">Todas as Categorias</option>
            <option value="Aluguel">Aluguel</option>
            <option value="Água/Luz/Internet">Água/Luz/Internet</option>
            <option value="Insumos/Produtos">Insumos/Produtos</option>
            <option value="Manutenção">Manutenção</option>
            <option value="Taxas de Cartão">Taxas de Cartão</option>
            <option value="Outros">Outros</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-secondary border border-border rounded-xl px-3 py-1.5 font-bold text-foreground outline-none"
          >
            <option value="all">Fixa + Variável</option>
            <option value="Fixa">Apenas Custo Fixo</option>
            <option value="Variável">Apenas Custo Variável</option>
          </select>
        </div>

        <p className="text-xs text-muted-foreground font-bold">Mostrando {filteredExpenses.length} registro(s)</p>
      </div>

      {/* Expenses Table */}
      <div className="bg-card border border-border rounded-3xl p-6 card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-foreground">
            <thead className="bg-secondary/60 text-muted-foreground uppercase text-[10px] font-extrabold tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">Descrição</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Tipo</th>
                <th className="py-3 px-4">Favorecido</th>
                <th className="py-3 px-4">Vencimento</th>
                <th className="py-3 px-4">Valor (R$)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    Nenhuma despesa cadastrada nos filtros selecionados.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="py-3 px-4 font-bold text-foreground">{exp.description}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-secondary border border-border text-[10px] font-bold text-muted-foreground">
                        {exp.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-muted-foreground">{exp.type}</td>
                    <td className="py-3 px-4 text-muted-foreground">{exp.recipient || '-'}</td>
                    <td className="py-3 px-4 font-mono">{exp.dueDate}</td>
                    <td className="py-3 px-4 font-extrabold text-destructive text-sm">
                      R$ {exp.amount.toLocaleString('pt-BR')},00
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleToggleStatus(exp.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold cursor-pointer flex items-center gap-1 transition-all ${
                          exp.status === 'paid'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {exp.status === 'paid' ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" /> Pago
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" /> Pendente
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleDeleteExpense(exp.id)}
                        className="p-1.5 rounded-lg text-destructive hover:bg-destructive/20 cursor-pointer"
                        title="Remover Despesa"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <h3 className="text-lg font-extrabold text-foreground">Lançar Nova Despesa</h3>

            <form onSubmit={handleSaveExpense} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted-foreground mb-1">
                  Descrição da Conta / Compra
                </label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ex: Aluguel do mês, Compra de lâminas..."
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-muted-foreground mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="Aluguel">Aluguel</option>
                    <option value="Água/Luz/Internet">Água/Luz/Internet</option>
                    <option value="Insumos/Produtos">Insumos/Produtos</option>
                    <option value="Manutenção">Manutenção</option>
                    <option value="Taxas de Cartão">Taxas de Cartão</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-muted-foreground mb-1">
                    Tipo de Custo
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="Fixa">Custo Fixo</option>
                    <option value="Variável">Custo Variável</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-muted-foreground mb-1">
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-muted-foreground mb-1">
                    Data Vencimento
                  </label>
                  <input
                    type="text"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-muted-foreground mb-1">
                  Favorecido / Fornecedor
                </label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="Ex: Imobiliária, Cosern, Distribuidora..."
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-bold text-muted-foreground mb-1">
                  Status Inicial
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary font-bold"
                >
                  <option value="paid">Já Pago (Débito do Caixa)</option>
                  <option value="pending">Pendente (A Vencer)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-primary-foreground font-extrabold rounded-xl text-xs hover:bg-primary/90"
                >
                  Salvar Despesa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
