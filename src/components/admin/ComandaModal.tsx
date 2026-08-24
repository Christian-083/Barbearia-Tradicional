import React, { useState, useMemo } from 'react';
import { ShoppingCart, Plus, Trash2, DollarSign, X, Check, Scissors, Package, User } from 'lucide-react';
import { Booking, Barber, Product, ComandaItem, Comanda } from '../../types';
import { addComanda, addCompletedBooking, getBookings, saveBookings, getProducts, deductProductStock, getServices } from '../../utils/storage';

interface ComandaModalProps {
  isOpen: boolean;
  booking?: Booking | null;
  barbers: Barber[];
  onClose: () => void;
  onSuccess: () => void;
}

export const ComandaModal: React.FC<ComandaModalProps> = ({
  isOpen,
  booking,
  barbers,
  onClose,
  onSuccess,
}) => {
  if (!isOpen) return null;
  const SERVICES = getServices();

  const [customerName, setCustomerName] = useState(booking?.name || 'Cliente Avulso');
  const [customerPhone, setCustomerPhone] = useState(booking?.phone || '');
  const [selectedBarberId, setSelectedBarberId] = useState<string>(
    booking?.barberId || barbers[0]?.id || 'b1'
  );

  const selectedBarber = useMemo(() => {
    return barbers.find((b) => b.id === selectedBarberId) || barbers[0];
  }, [barbers, selectedBarberId]);

  // Items list in the comanda
  const [items, setItems] = useState<ComandaItem[]>(() => {
    const list: ComandaItem[] = [];
    if (booking) {
      list.push({
        id: crypto.randomUUID(),
        type: 'service',
        name: booking.service,
        price: booking.paidByPlan ? 0 : booking.price,
        quantity: 1,
        commissionRate: selectedBarber?.commissionServicePercent || 50,
      });
    }
    return list;
  });

  const [discount, setDiscount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro' | 'Plano Recorrente'>(
    booking?.paidByPlan ? 'Plano Recorrente' : 'PIX'
  );

  // Form helpers for adding products/services
  const availableProducts = useMemo(() => getProducts(), [isOpen]);
  const [selectedProductToAdd, setSelectedProductToAdd] = useState<string>('');
  const [selectedServiceToAdd, setSelectedServiceToAdd] = useState<string>('');

  const handleAddProduct = () => {
    if (!selectedProductToAdd) return;
    const prod = availableProducts.find((p) => p.id === selectedProductToAdd);
    if (!prod) return;

    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: 'product',
        name: prod.name,
        price: prod.price,
        quantity: 1,
        commissionRate: selectedBarber?.commissionProductPercent || 10,
      },
    ]);
    setSelectedProductToAdd('');
  };

  const handleAddExtraService = () => {
    if (!selectedServiceToAdd) return;
    const serv = SERVICES.find((s) => s.name === selectedServiceToAdd);
    if (!serv) return;

    setItems((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type: 'service',
        name: serv.name,
        price: serv.price,
        quantity: 1,
        commissionRate: selectedBarber?.commissionServicePercent || 50,
      },
    ]);
    setSelectedServiceToAdd('');
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  // Subtotal, Discount & Totals
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discount);
  }, [subtotal, discount]);

  // Commission Calculation
  const commissionTotal = useMemo(() => {
    return items.reduce((acc, item) => {
      const itemTotal = item.price * item.quantity;
      const rate = item.type === 'service'
        ? (selectedBarber?.commissionServicePercent ?? 50)
        : (selectedBarber?.commissionProductPercent ?? 10);
      return acc + itemTotal * (rate / 100);
    }, 0);
  }, [items, selectedBarber]);

  const handleCloseComanda = () => {
    if (items.length === 0) return;

    const newComanda: Comanda = {
      id: `cmd-${Date.now()}`,
      bookingId: booking?.id,
      customerName,
      customerPhone,
      barberId: selectedBarber.id,
      barberName: selectedBarber.name,
      items,
      subtotal,
      discount,
      total,
      commissionTotal,
      paymentMethod,
      createdAt: new Date().toLocaleString('pt-BR'),
      status: 'closed',
    };

    addComanda(newComanda);

    // Automatic Stock Reduction for any product item
    items.forEach((item) => {
      if (item.type === 'product') {
        const prodMatch = availableProducts.find((p) => p.name === item.name);
        if (prodMatch) {
          deductProductStock(
            prodMatch.id,
            item.quantity,
            selectedBarber.name,
            `Venda Casada em Comanda #${newComanda.id}`
          );
        }
      }
    });

    // If linked to booking, complete the booking
    if (booking) {
      addCompletedBooking({
        ...booking,
        status: 'completed',
        price: total,
      });
      const remainingBookings = getBookings().filter((b) => b.id !== booking.id);
      saveBookings(remainingBookings);
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-card border border-border rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 text-primary rounded-2xl">
              <ShoppingCart className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Fechamento de Comanda</h2>
              <p className="text-xs text-muted-foreground">
                Lance serviços, produtos consumidos e garanta o cálculo de comissões.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Customer & Barber info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                Cliente
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl pl-9 pr-3 py-2 text-sm text-foreground focus:border-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                Barbeiro Atendente
              </label>
              <select
                value={selectedBarberId}
                onChange={(e) => setSelectedBarberId(e.target.value)}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary outline-none"
              >
                {barbers.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name} ({b.commissionServicePercent}% Serv / {b.commissionProductPercent}% Prod)
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Add Product / Extra Service */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-secondary/40 border border-border">
            {/* Add Product */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">
                + Adicionar Produto Consumido
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedProductToAdd}
                  onChange={(e) => setSelectedProductToAdd(e.target.value)}
                  className="flex-1 bg-card border border-border rounded-xl px-3 py-1.5 text-xs text-foreground outline-none"
                >
                  <option value="">Selecione produto...</option>
                  {availableProducts.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - R$ {p.price},00 (Estoque: {p.stock})
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddProduct}
                  disabled={!selectedProductToAdd}
                  className="px-3 py-1.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add Extra Service */}
            <div>
              <label className="block text-xs font-bold text-muted-foreground mb-1">
                + Adicionar Serviço Adicional
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedServiceToAdd}
                  onChange={(e) => setSelectedServiceToAdd(e.target.value)}
                  className="flex-1 bg-card border border-border rounded-xl px-3 py-1.5 text-xs text-foreground outline-none"
                >
                  <option value="">Selecione serviço...</option>
                  {SERVICES.map((s) => (
                    <option key={s.name} value={s.name}>
                      {s.name} - R$ {s.price},00
                    </option>
                  ))}
                </select>
                <button
                  onClick={handleAddExtraService}
                  disabled={!selectedServiceToAdd}
                  className="px-3 py-1.5 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <label className="block text-xs uppercase tracking-wider text-muted-foreground font-bold">
              Itens da Comanda ({items.length})
            </label>
            <div className="border border-border rounded-2xl overflow-hidden divide-y divide-border">
              {items.length === 0 ? (
                <p className="p-4 text-center text-xs text-muted-foreground">
                  Nenhum item adicionado à comanda.
                </p>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="p-3 bg-card flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      {item.type === 'service' ? (
                        <Scissors className="w-4 h-4 text-primary" />
                      ) : (
                        <Package className="w-4 h-4 text-emerald-400" />
                      )}
                      <div>
                        <p className="font-bold text-foreground text-xs sm:text-sm">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground">
                          {item.type === 'service' ? 'Serviço' : 'Produto'} • Comissão para {selectedBarber.name}:{' '}
                          <span className="text-primary font-semibold">{item.commissionRate}%</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-bold text-foreground">
                        R$ {item.price * item.quantity},00
                      </span>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="p-1 rounded-lg hover:bg-destructive/20 text-destructive cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Discounts & Payment Method */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                Desconto Especial (R$)
              </label>
              <input
                type="number"
                min={0}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value) || 0)}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5 font-bold">
                Forma de Pagamento
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as any)}
                className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground focus:border-primary outline-none font-bold"
              >
                <option value="PIX">PIX (Instantâneo)</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Dinheiro">Dinheiro em Espécie</option>
                <option value="Plano Recorrente">Plano Recorrente (Débito do Pacote)</option>
              </select>
            </div>
          </div>

          {/* Financial Totals Breakdown Box */}
          <div className="p-4 rounded-2xl bg-secondary/80 border border-border space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal dos Itens:</span>
              <span>R$ {subtotal},00</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-destructive font-medium">
                <span>Desconto Concedido:</span>
                <span>- R$ {discount},00</span>
              </div>
            )}
            <div className="flex justify-between text-primary font-medium text-xs pt-1 border-t border-border/50">
              <span>Comissão Calculada para {selectedBarber.name}:</span>
              <span>R$ {commissionTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-foreground font-extrabold text-lg pt-2 border-t border-border">
              <span>Total da Comanda:</span>
              <span className="text-primary">R$ {total},00</span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-border bg-secondary/30 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-border text-sm font-bold text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleCloseComanda}
            disabled={items.length === 0}
            className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2 shadow-[0_0_15px_-3px_hsl(45_97%_54%/0.4)]"
          >
            <Check className="w-4 h-4 stroke-[3]" /> Fechar Comanda
          </button>
        </div>
      </div>
    </div>
  );
};
