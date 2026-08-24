import React, { useState } from 'react';
import { Database, Code, Check, Copy, X, Server, Layers, FileText } from 'lucide-react';

interface SqlDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SqlDiagramModal: React.FC<SqlDiagramModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'diagram' | 'ddl' | 'guide'>('diagram');

  if (!isOpen) return null;

  const sqlDDL = `-- ============================================================
-- ESQUEMA COMPLETO DE BANCO DE DADOS (PostgreSQL / MySQL)
-- GERENTE VIRTUAL - BARBEARIA SEU GALDINO
-- ============================================================

-- 1. TABELA DE BARBEIROS E COMISSIONAMENTO
CREATE TABLE barbeiros (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    foto_url TEXT,
    comissao_servicos_percent NUMERIC(5, 2) DEFAULT 50.00,
    comissao_produtos_percent NUMERIC(5, 2) DEFAULT 10.00,
    cargo VARCHAR(20) DEFAULT 'barber', -- 'master' ou 'barber'
    pin_code VARCHAR(10) NOT NULL,
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE CLIENTES (CRM)
CREATE TABLE clientes (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20) UNIQUE NOT NULL,
    data_nascimento DATE,
    total_visitas INT DEFAULT 0,
    total_gasto NUMERIC(10, 2) DEFAULT 0.00,
    ultima_visita DATE,
    ficha_tecnica_nota TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. GALERIA DE FOTOS DO CLIENTE
CREATE TABLE fotos_cliente (
    id VARCHAR(36) PRIMARY KEY,
    cliente_id VARCHAR(36) REFERENCES clientes(id) ON DELETE CASCADE,
    foto_url TEXT NOT NULL,
    legenda TEXT,
    criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE PLANOS MENSAIS (RECORRÊNCIA)
CREATE TABLE planos_mensais (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    preco_mensal NUMERIC(10, 2) NOT NULL,
    cortes_por_mes INT DEFAULT -1, -- -1 indica ilimitado
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE
);

-- 5. ASSINATURAS RECORRENTES DOS CLIENTES
CREATE TABLE assinaturas_clientes (
    id VARCHAR(36) PRIMARY KEY,
    cliente_id VARCHAR(36) REFERENCES clientes(id) ON DELETE CASCADE,
    plano_id VARCHAR(36) REFERENCES planos_mensais(id),
    data_inicio DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    cortes_restantes INT DEFAULT -1,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'expiring', 'expired', 'canceled'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. TABELA DE PRODUTOS E INSUMOS
CREATE TABLE produtos (
    id VARCHAR(36) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    categoria VARCHAR(50) NOT NULL, -- 'Pomada', 'Óleo/Barba', 'Shampoo', 'Bebida', 'Tratamento', 'Outros'
    preco_venda NUMERIC(10, 2) NOT NULL,
    preco_custo NUMERIC(10, 2) NOT NULL,
    estoque_atual INT DEFAULT 0,
    estoque_minimo INT DEFAULT 3, -- Alerta de reposição em vermelho
    fornecedor VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABELA DE HISTÓRICO DE MOVIMENTAÇÃO DE ESTOQUE (AUDITORIA)
CREATE TABLE movimentacao_estoque (
    id VARCHAR(36) PRIMARY KEY,
    produto_id VARCHAR(36) REFERENCES produtos(id) ON DELETE CASCADE,
    produto_nome VARCHAR(100) NOT NULL,
    tipo VARCHAR(20) NOT NULL, -- 'in' (entrada), 'out' (saída), 'sale' (venda casada), 'adjustment'
    quantidade INT NOT NULL,
    estoque_anterior INT NOT NULL,
    estoque_novo INT NOT NULL,
    motivo VARCHAR(255) NOT NULL,
    autor VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. TABELA DE DESPESAS (FLUXO DE CAIXA E DRE)
CREATE TABLE despesas (
    id VARCHAR(36) PRIMARY KEY,
    descricao VARCHAR(255) NOT NULL,
    categoria VARCHAR(50) NOT NULL, -- 'Aluguel', 'Água/Luz/Internet', 'Insumos/Produtos', 'Manutenção', 'Taxas de Cartão', 'Outros'
    tipo VARCHAR(20) NOT NULL, -- 'Fixa' ou 'Variável'
    valor NUMERIC(10, 2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    favorecido_fornecedor VARCHAR(100),
    status VARCHAR(20) DEFAULT 'paid', -- 'pending' ou 'paid'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABELA DE AGENDAMENTOS
CREATE TABLE agendamentos (
    id VARCHAR(36) PRIMARY KEY,
    cliente_id VARCHAR(36) REFERENCES clientes(id),
    barbeiro_id VARCHAR(36) REFERENCES barbeiros(id),
    servico_nome TEXT NOT NULL,
    preco NUMERIC(10, 2) NOT NULL,
    data_agendamento DATE NOT NULL,
    horario VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'accepted', 'completed', 'canceled'
    pago_via_plano BOOLEAN DEFAULT FALSE,
    plano_nome VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. FECHAMENTO DE COMANDAS
CREATE TABLE comandas (
    id VARCHAR(36) PRIMARY KEY,
    agendamento_id VARCHAR(36) REFERENCES agendamentos(id),
    cliente_id VARCHAR(36) REFERENCES clientes(id),
    barbeiro_id VARCHAR(36) REFERENCES barbeiros(id) NOT NULL,
    subtotal NUMERIC(10, 2) NOT NULL,
    desconto NUMERIC(10, 2) DEFAULT 0.00,
    total NUMERIC(10, 2) NOT NULL,
    comissao_total NUMERIC(10, 2) NOT NULL,
    forma_pagamento VARCHAR(30) NOT NULL, -- 'PIX', 'Cartão', 'Dinheiro', 'Plano Recorrente'
    status VARCHAR(20) DEFAULT 'closed',
    fechado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. ITENS DA COMANDA (DETALHAMENTO DE SERVIÇOS E PRODUTOS)
CREATE TABLE itens_comanda (
    id VARCHAR(36) PRIMARY KEY,
    comanda_id VARCHAR(36) REFERENCES comandas(id) ON DELETE CASCADE,
    tipo VARCHAR(20) NOT NULL, -- 'service', 'product', 'plan_deduction'
    item_nome VARCHAR(100) NOT NULL,
    preco_unitario NUMERIC(10, 2) NOT NULL,
    quantidade INT DEFAULT 1,
    taxa_comissao_aplicada NUMERIC(5, 2) NOT NULL,
    valor_comissao NUMERIC(10, 2) NOT NULL
);
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sqlDDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
      <div className="bg-card border border-border rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/30">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/20 text-primary rounded-2xl">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Arquitetura de Banco de Dados SQL & Guia</h2>
              <p className="text-xs text-muted-foreground">
                Modelagem Relacional para Comissões, Comandas, Planos Recorrentes e CRM
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-border/60 bg-secondary/20 px-6 gap-2 pt-3">
          <button
            onClick={() => setActiveTab('diagram')}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'diagram'
                ? 'bg-card border-t border-x border-border text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Layers className="w-4 h-4" /> Diagrama Relacional (ER)
          </button>
          <button
            onClick={() => setActiveTab('ddl')}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'ddl'
                ? 'bg-card border-t border-x border-border text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Code className="w-4 h-4" /> Script SQL (DDL)
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 rounded-t-xl font-bold text-sm flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-card border-t border-x border-border text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="w-4 h-4" /> Guia de Integração
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 text-sm space-y-6">
          {activeTab === 'diagram' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-foreground">
                <h3 className="font-bold text-base mb-1 text-primary">Relacionamento das Entidades Principais</h3>
                <p className="text-xs text-muted-foreground">
                  O diagrama descreve a dependência entre Agendamentos, Comandas com Fechamento de Caixa,
                  Desconto de Saldo de Planos em Tempo Real e Ficha CRM do Cliente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <div className="font-bold text-primary flex items-center gap-2 mb-2">
                    <Server className="w-4 h-4" /> 1. BARBEIROS
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                    <li>• id (PK)</li>
                    <li>• nome</li>
                    <li>• comissao_servicos_percent</li>
                    <li>• comissao_produtos_percent</li>
                    <li>• cargo ('master' | 'barber')</li>
                    <li>• pin_code</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <div className="font-bold text-primary flex items-center gap-2 mb-2">
                    <Server className="w-4 h-4" /> 2. CLIENTES & CRM
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                    <li>• id (PK)</li>
                    <li>• telefone (UK - Chave do Plano)</li>
                    <li>• ficha_tecnica_nota</li>
                    <li>• total_gasto / visitas</li>
                    <li>→ fotos_cliente (1:N)</li>
                    <li>→ assinaturas_clientes (1:N)</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <div className="font-bold text-primary flex items-center gap-2 mb-2">
                    <Server className="w-4 h-4" /> 3. PLANOS RECORRENTES
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                    <li>• id (PK)</li>
                    <li>• nome ('VIP Ilimitado')</li>
                    <li>• preco_mensal</li>
                    <li>• cortes_por_mes (-1 = Ilimitado)</li>
                    <li>→ Baixa Automática no Agendamento</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <div className="font-bold text-primary flex items-center gap-2 mb-2">
                    <Server className="w-4 h-4" /> 4. AGENDAMENTOS
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                    <li>• id (PK)</li>
                    <li>• cliente_id (FK)</li>
                    <li>• barbeiro_id (FK)</li>
                    <li>• pago_via_plano (BOOLEAN)</li>
                    <li>• status ('pending', 'completed')</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <div className="font-bold text-primary flex items-center gap-2 mb-2">
                    <Server className="w-4 h-4" /> 5. COMANDAS
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                    <li>• id (PK)</li>
                    <li>• barbeiro_id (FK)</li>
                    <li>• subtotal / desconto / total</li>
                    <li>• comissao_total (Calculada)</li>
                    <li>• forma_pagamento</li>
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-secondary/50 border border-border">
                  <div className="font-bold text-primary flex items-center gap-2 mb-2">
                    <Server className="w-4 h-4" /> 6. ITENS COMANDA
                  </div>
                  <ul className="text-xs text-muted-foreground space-y-1 font-mono">
                    <li>• id (PK)</li>
                    <li>• comanda_id (FK)</li>
                    <li>• tipo ('service' | 'product')</li>
                    <li>• taxa_comissao_aplicada</li>
                    <li>• valor_comissao</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ddl' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">PostgreSQL / MySQL Schema DDL v2.0</span>
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center gap-2 hover:bg-primary/90 cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado!' : 'Copiar DDL SQL'}
                </button>
              </div>
              <pre className="p-4 rounded-2xl bg-slate-950 text-slate-100 font-mono text-xs overflow-x-auto border border-border/80 leading-relaxed max-h-[50vh]">
                {sqlDDL}
              </pre>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-6 leading-relaxed">
              <div className="p-4 rounded-2xl bg-secondary/40 border border-border space-y-2">
                <h3 className="font-bold text-base text-primary">Como Conectar este Gerente Virtual ao Backend</h3>
                <p className="text-xs text-muted-foreground">
                  O sistema possui rotas prontas em Node.js/Express (`server.ts`) para substituir o armazenamento local por chamadas SQL reais quando necessário.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2">
                  <h4 className="font-bold text-foreground text-sm">1. Rota de Fechamento de Comanda (`POST /api/comanda/fechar`)</h4>
                  <p className="text-muted-foreground">
                    Ao finalizar o atendimento no Caixa, o frontend envia os serviços e produtos consumidos. O servidor calcula a taxa de comissão individual do barbeiro para cada item e salva no BD.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2">
                  <h4 className="font-bold text-foreground text-sm">2. Lógica de Baixa Automática (`POST /api/planos/baixa-automatica`)</h4>
                  <p className="text-muted-foreground">
                    Quando um cliente com WhatsApp cadastrado agenda um horário, o sistema verifica se existe um registro ativo em `assinaturas_clientes`. Se houver, consome 1 crédito e zera a cobrança do agendamento sem intervenção manual.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-secondary/30 border border-border space-y-2">
                  <h4 className="font-bold text-foreground text-sm">3. Relatórios em Tempo Real (`GET /api/relatorios/financeiro`)</h4>
                  <p className="text-muted-foreground">
                    Métricas de faturamento diário, semanal, mensal e comissões a pagar por barbeiro são consolidadas instantaneamente via agregação SQL (`SUM`, `AVG`).
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
