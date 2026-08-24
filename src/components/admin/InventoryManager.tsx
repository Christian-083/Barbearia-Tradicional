import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, ArrowUpRight, ArrowDownRight, History, Edit, Trash2, MessageCircle, RefreshCw, DollarSign, Tag, Truck } from 'lucide-react';
import { Product, InventoryMovement } from '../../types';
import { getProducts, saveProducts, getInventoryMovements, recordInventoryMovement } from '../../utils/storage';
import { buildWhatsAppLink } from '../../utils/whatsapp';
import { WHITELABEL_CONFIG } from '../../config/whitelabel';

export const InventoryManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(() => getProducts());
  const [movements, setMovements] = useState<InventoryMovement[]>(() => getInventoryMovements());

  const [activeSubTab, setActiveSubTab] = useState<'products' | 'movements'>('products');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Modal States
  const [showProductModal, setShowProductModal] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formName, setFormName] = useState<string>('');
  const [formCategory, setFormCategory] = useState<Product['category']>('Pomada');
  const [formPrice, setFormPrice] = useState<number>(35);
  const [formCostPrice, setFormCostPrice] = useState<number>(15);
  const [formStock, setFormStock] = useState<number>(10);
  const [formMinStock, setFormMinStock] = useState<number>(3);
  const [formSupplier, setFormSupplier] = useState<string>('');

  // Stock Adjustment Modal State
  const [showAdjustModal, setShowAdjustModal] = useState<boolean>(false);
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [adjustType, setAdjustType] = useState<'in' | 'out' | 'adjustment'>('in');
  const [adjustQuantity, setAdjustQuantity] = useState<number>(10);
  const [adjustReason, setAdjustReason] = useState<string>('Reposição de Estoque');

  const refreshData = () => {
    setProducts(getProducts());
    setMovements(getInventoryMovements());
  };

  const handleOpenNewProduct = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Pomada');
    setFormPrice(35);
    setFormCostPrice(15);
    setFormStock(10);
    setFormMinStock(3);
    setFormSupplier('');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setFormName(prod.name);
    setFormCategory(prod.category);
    setFormPrice(prod.price);
    setFormCostPrice(prod.costPrice || Math.round(prod.price * 0.4));
    setFormStock(prod.stock);
    setFormMinStock(prod.minStock || 3);
    setFormSupplier(prod.supplier || '');
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const currentList = getProducts();
    if (editingProduct) {
      const updated = currentList.map((p) => {
        if (p.id === editingProduct.id) {
          return {
            ...p,
            name: formName,
            category: formCategory,
            price: formPrice,
            costPrice: formCostPrice,
            stock: formStock,
            minStock: formMinStock,
            supplier: formSupplier,
          };
        }
        return p;
      });
      saveProducts(updated);
    } else {
      const newProd: Product = {
        id: `p-${Date.now()}`,
        name: formName,
        category: formCategory,
        price: formPrice,
        costPrice: formCostPrice,
        stock: formStock,
        minStock: formMinStock,
        supplier: formSupplier,
      };
      currentList.push(newProd);
      saveProducts(currentList);

      // Record initial movement
      recordInventoryMovement({
        id: crypto.randomUUID(),
        productId: newProd.id,
        productName: newProd.name,
        type: 'in',
        quantity: formStock,
        previousStock: 0,
        newStock: formStock,
        reason: 'Cadastro de Produto Inicial',
        author: 'Gerente / Dono',
        createdAt: new Date().toLocaleString('pt-BR'),
      });
    }

    setShowProductModal(false);
    refreshData();
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este produto do catálogo?')) {
      const updated = getProducts().filter((p) => p.id !== id);
      saveProducts(updated);
      refreshData();
    }
  };

  // Stock Adjustment Submit
  const handleSaveStockAdjust = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustProduct) return;

    const currentProds = getProducts();
    const targetIdx = currentProds.findIndex((p) => p.id === adjustProduct.id);
    if (targetIdx >= 0) {
      const oldStock = currentProds[targetIdx].stock;
      let newStock = oldStock;

      if (adjustType === 'in') {
        newStock = oldStock + adjustQuantity;
      } else if (adjustType === 'out') {
        newStock = Math.max(0, oldStock - adjustQuantity);
      } else {
        newStock = Math.max(0, adjustQuantity);
      }

      currentProds[targetIdx].stock = newStock;
      saveProducts(currentProds);

      recordInventoryMovement({
        id: crypto.randomUUID(),
        productId: adjustProduct.id,
        productName: adjustProduct.name,
        type: adjustType,
        quantity: adjustQuantity,
        previousStock: oldStock,
        newStock,
        reason: adjustReason || 'Ajuste de Estoque Manual',
        author: 'Gerente / Dono',
        createdAt: new Date().toLocaleString('pt-BR'),
      });
    }

    setShowAdjustModal(false);
    setAdjustProduct(null);
    refreshData();
  };

  // Reorder via Supplier WhatsApp
  const handleReorderWA = (prod: Product) => {
    const message = `📦 *PEDIDO DE REPOSIÇÃO DE ESTOQUE - ${WHITELABEL_CONFIG.shortName.toUpperCase()}* 📦
Olá ${prod.supplier || 'Fornecedor'}!

Preciso pedir reposição urgente do produto:
• *Produto:* ${prod.name}
• *Estoque Atual:* ${prod.stock} un. (Abaixo do limite crítico)
• *Quantidade desejada:* 20 unidades.

Pode emitir o pedido e nos informar a data de entrega e chave PIX para pagamento?
Obrigado! 🤝`;

    window.open(buildWhatsAppLink(WHITELABEL_CONFIG.phone, message), '_blank');
  };

  const filteredProducts = products.filter((p) => {
    if (categoryFilter === 'all') return true;
    if (categoryFilter === 'low_stock') return p.stock <= (p.minStock || 3);
    return p.category === categoryFilter;
  });

  const lowStockCount = products.filter((p) => p.stock <= (p.minStock || 3)).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="p-6 rounded-3xl bg-card border border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-primary/20 text-primary border border-primary/30">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-foreground tracking-tight">Gestão de Estoque & Insumos</h2>
            <p className="text-xs text-muted-foreground">
              Controle de saldo em tempo real, alertas de estoque crítico e comissão de vendas.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {lowStockCount > 0 && (
            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-bold animate-pulse">
              <AlertTriangle className="w-4 h-4" />
              <span>{lowStockCount} Produto(s) com Estoque Baixo</span>
            </div>
          )}

          <button
            onClick={handleOpenNewProduct}
            className="px-4 py-2.5 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl hover:bg-primary/90 transition-all cursor-pointer flex items-center gap-2 shadow-[0_0_15px_-3px_hsl(45_97%_54%/0.4)]"
          >
            <Plus className="w-4 h-4" /> Cadastrar Produto
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex justify-between items-center border-b border-border pb-2 gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab('products')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'products'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <Package className="w-4 h-4" /> Catálogo de Produtos ({products.length})
          </button>
          <button
            onClick={() => setActiveSubTab('movements')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeSubTab === 'movements'
                ? 'bg-primary text-primary-foreground shadow-md'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            }`}
          >
            <History className="w-4 h-4" /> Histórico de Movimentações ({movements.length})
          </button>
        </div>

        {activeSubTab === 'products' && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground hidden sm:inline">Filtrar:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-secondary border border-border rounded-xl px-3 py-1.5 text-xs font-bold text-foreground outline-none"
            >
              <option value="all">Todas as Categorias</option>
              <option value="low_stock">⚠️ Estoque Baixo ({lowStockCount})</option>
              <option value="Pomada">Pomada</option>
              <option value="Óleo/Barba">Óleo/Barba</option>
              <option value="Shampoo">Shampoo</option>
              <option value="Bebida">Bebida</option>
              <option value="Tratamento">Tratamento</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
        )}
      </div>

      {/* TAB 1: CATÁLOGO DE PRODUTOS */}
      {activeSubTab === 'products' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full p-12 text-center text-muted-foreground bg-card rounded-3xl border border-border">
              <Package className="w-12 h-12 mx-auto text-muted-foreground/40 mb-2" />
              <p className="font-bold text-foreground">Nenhum produto encontrado nesta categoria</p>
            </div>
          ) : (
            filteredProducts.map((p) => {
              const isLowStock = p.stock <= (p.minStock || 3);

              return (
                <div
                  key={p.id}
                  className={`p-5 rounded-3xl bg-card border ${
                    isLowStock ? 'border-destructive/60 bg-destructive/5' : 'border-border'
                  } card-shadow flex flex-col justify-between space-y-4 relative overflow-hidden`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-secondary border border-border text-muted-foreground">
                        {p.category}
                      </span>

                      {isLowStock ? (
                        <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-destructive text-white flex items-center gap-1 animate-pulse">
                          <AlertTriangle className="w-3 h-3" /> Estoque Crítico ({p.stock})
                        </span>
                      ) : (
                        <span className="text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                          Estoque Normal ({p.stock})
                        </span>
                      )}
                    </div>

                    <h3 className="font-extrabold text-base text-foreground">{p.name}</h3>
                    {p.supplier && (
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Truck className="w-3.5 h-3.5 text-primary" /> {p.supplier}
                      </p>
                    )}

                    <div className="mt-4 p-3 rounded-2xl bg-secondary/50 border border-border/80 grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Preço Venda:</span>
                        <strong className="text-primary font-extrabold text-sm">R$ {p.price},00</strong>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px]">Preço Custo:</span>
                        <strong className="text-foreground font-bold">R$ {p.costPrice || Math.round(p.price * 0.4)},00</strong>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2 pt-2 border-t border-border">
                    {isLowStock && (
                      <button
                        onClick={() => handleReorderWA(p)}
                        className="w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/30 rounded-xl font-extrabold text-xs transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <MessageCircle className="w-3.5 h-3.5" /> Pedir Reposição no WA
                      </button>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setAdjustProduct(p);
                          setAdjustType('in');
                          setAdjustQuantity(10);
                          setShowAdjustModal(true);
                        }}
                        className="flex-1 py-1.5 bg-secondary hover:bg-secondary/80 text-foreground font-bold text-xs rounded-xl cursor-pointer flex items-center justify-center gap-1"
                      >
                        <RefreshCw className="w-3.5 h-3.5 text-primary" /> Entrada/Ajuste
                      </button>

                      <button
                        onClick={() => handleOpenEditProduct(p)}
                        className="p-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl cursor-pointer"
                        title="Editar Produto"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-2 bg-destructive/10 text-destructive hover:bg-destructive/20 rounded-xl cursor-pointer"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: HISTÓRICO DE MOVIMENTAÇÕES */}
      {activeSubTab === 'movements' && (
        <div className="bg-card border border-border rounded-3xl p-6 card-shadow space-y-4">
          <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
            <History className="w-5 h-5 text-primary" /> Registro de Movimentação de Estoque
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-foreground">
              <thead className="bg-secondary/60 text-muted-foreground uppercase text-[10px] font-extrabold tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">Data/Hora</th>
                  <th className="py-3 px-4">Produto</th>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Qtd</th>
                  <th className="py-3 px-4">Saldo (Anterior ➔ Novo)</th>
                  <th className="py-3 px-4">Motivo/Origem</th>
                  <th className="py-3 px-4">Autor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {movements.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-muted-foreground">
                      Nenhuma movimentação registrada no histórico.
                    </td>
                  </tr>
                ) : (
                  movements.map((m) => (
                    <tr key={m.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="py-3 px-4 font-mono text-muted-foreground">{m.createdAt}</td>
                      <td className="py-3 px-4 font-bold text-foreground">{m.productName}</td>
                      <td className="py-3 px-4">
                        {m.type === 'in' && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-extrabold text-[10px] flex items-center gap-1 w-fit">
                            <ArrowUpRight className="w-3 h-3" /> Entrada
                          </span>
                        )}
                        {m.type === 'sale' && (
                          <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary font-extrabold text-[10px] flex items-center gap-1 w-fit">
                            <DollarSign className="w-3 h-3" /> Venda
                          </span>
                        )}
                        {m.type === 'out' && (
                          <span className="px-2 py-0.5 rounded-full bg-destructive/20 text-destructive font-extrabold text-[10px] flex items-center gap-1 w-fit">
                            <ArrowDownRight className="w-3 h-3" /> Saída
                          </span>
                        )}
                        {m.type === 'adjustment' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-extrabold text-[10px] flex items-center gap-1 w-fit">
                            Ajuste
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-extrabold">{m.quantity} un.</td>
                      <td className="py-3 px-4 font-mono">
                        {m.previousStock} ➔ <strong className="text-primary">{m.newStock}</strong>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">{m.reason}</td>
                      <td className="py-3 px-4 font-medium">{m.author}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Product Register/Edit Modal */}
      {showProductModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl relative">
            <h3 className="text-lg font-extrabold text-foreground">
              {editingProduct ? 'Editar Produto' : 'Cadastrar Novo Produto'}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-bold text-muted-foreground mb-1">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ex: Pomada Efeito Matte 100g"
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-muted-foreground mb-1">
                    Categoria
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  >
                    <option value="Pomada">Pomada</option>
                    <option value="Óleo/Barba">Óleo/Barba</option>
                    <option value="Shampoo">Shampoo</option>
                    <option value="Bebida">Bebida</option>
                    <option value="Tratamento">Tratamento</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-muted-foreground mb-1">
                    Fornecedor
                  </label>
                  <input
                    type="text"
                    value={formSupplier}
                    onChange={(e) => setFormSupplier(e.target.value)}
                    placeholder="Ex: Distribuidora Barber"
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-muted-foreground mb-1">
                    Preço Venda (R$)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-muted-foreground mb-1">
                    Preço Custo (R$)
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formCostPrice}
                    onChange={(e) => setFormCostPrice(Number(e.target.value))}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase font-bold text-muted-foreground mb-1">
                    Estoque Inicial
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formStock}
                    onChange={(e) => setFormStock(Number(e.target.value))}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold text-muted-foreground mb-1">
                    Estoque Mínimo (Alerta)
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formMinStock}
                    onChange={(e) => setFormMinStock(Number(e.target.value))}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-primary-foreground font-extrabold rounded-xl text-xs hover:bg-primary/90"
                >
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stock Adjustment Modal */}
      {showAdjustModal && adjustProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-card border border-border rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <h3 className="text-base font-extrabold text-foreground">
              Entrada / Ajuste: {adjustProduct.name}
            </h3>
            <p className="text-xs text-muted-foreground">Estoque atual no sistema: <strong>{adjustProduct.stock} un.</strong></p>

            <form onSubmit={handleSaveStockAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Tipo de Operação</label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as any)}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none font-bold"
                >
                  <option value="in">Entrada / Compra (+) </option>
                  <option value="out">Saída / Perda (-)</option>
                  <option value="adjustment">Ajuste de Inventário (Definir Valor)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Quantidade</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={adjustQuantity}
                  onChange={(e) => setAdjustQuantity(Number(e.target.value))}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground mb-1">Motivo / Observação</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Ex: Nota Fiscal #1234 / Reposição de estoque"
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAdjustModal(false)}
                  className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-primary text-primary-foreground font-extrabold rounded-xl text-xs hover:bg-primary/90"
                >
                  Confirmar Operação
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
