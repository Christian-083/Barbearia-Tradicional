import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// --- API ENDPOINTS FOR "GERENTE VIRTUAL" ---

// 1. Fechamento de Comanda (Serviços + Produtos + Comissões)
app.post("/api/comanda/fechar", (req, res) => {
  const { barberId, barberName, items, paymentMethod, discount = 0, customerName, customerPhone } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Comanda deve conter ao menos um item (Serviço ou Produto)." });
  }

  let subtotal = 0;
  let commissionTotal = 0;

  const processedItems = items.map((item: any) => {
    const itemTotal = (item.price || 0) * (item.quantity || 1);
    subtotal += itemTotal;
    const itemCommission = itemTotal * ((item.commissionRate || 0) / 100);
    commissionTotal += itemCommission;

    return {
      ...item,
      itemTotal,
      itemCommission,
    };
  });

  const total = Math.max(0, subtotal - discount);

  const comanda = {
    id: `cmd-${Date.now()}`,
    customerName: customerName || "Cliente Avulso",
    customerPhone: customerPhone || "",
    barberId: barberId || "b1",
    barberName: barberName || "Seu Galdino",
    items: processedItems,
    subtotal,
    discount,
    total,
    commissionTotal,
    paymentMethod: paymentMethod || "PIX",
    createdAt: new Date().toLocaleString("pt-BR"),
    status: "closed",
  };

  return res.json({
    success: true,
    message: "Comanda fechada e comissões calculadas com sucesso!",
    comanda,
  });
});

// 2. Baixa Automática em Plano Recorrente
app.post("/api/planos/baixa-automatica", (req, res) => {
  const { customerPhone, serviceName } = req.body;

  if (!customerPhone) {
    return res.status(400).json({ error: "Telefone do cliente é obrigatório." });
  }

  // Simulation logic for backend endpoint
  return res.json({
    success: true,
    hasActivePlan: true,
    planName: "Plano VIP Ilimitado",
    creditDeducted: true,
    remainingCuts: -1, // Unlimited
    message: `Crédito abatido com sucesso para o serviço '${serviceName || "Corte"}' sem cobrança adicional.`,
  });
});

// 3. Relatórios Financeiros e DRE Simplificado
app.get("/api/relatorios/financeiro", (req, res) => {
  return res.json({
    success: true,
    faturamentoHoje: 380.0,
    faturamentoSemana: 2450.0,
    faturamentoMes: 9800.0,
    comissoesPagarMes: 3430.0,
    lucroLiquidoMes: 6370.0,
    ticketMedio: 48.5,
    previsaoRecebeveisSemana: 1250.0,
    topBarbeiro: "Seu Galdino",
  });
});

// 4. Lembretes Automáticos WhatsApp 24h Antes
app.post("/api/whatsapp/lembrete-24h", (req, res) => {
  const { bookingName, bookingPhone, date, time, serviceName, barberName } = req.body;

  const text = `✂️ *LEMBRETE SEU GALDINO* ✂️
Olá *${bookingName || "Cliente"}*! Passando para lembrar do seu agendamento:

🗓️ *Amanhã (${date || "24h"})* às *${time || "14:00"}*
💈 *Profissional:* ${barberName || "Seu Galdino"}
📋 *Serviço:* ${serviceName || "Corte de Cabelo"}
📍 *Endereço:* Rua Ten. Matoso, 106 - Conjunto Vida Nova

Para confirmar ou reagendar, basta responder a esta mensagem. Te esperamos! 💈`;

  const phoneClean = (bookingPhone || "").replace(/\D/g, "");
  const waUrl = `https://wa.me/${phoneClean}?text=${encodeURIComponent(text)}`;

  return res.json({
    success: true,
    bookingName,
    whatsappUrl: waUrl,
    messageText: text,
  });
});

// --- VITE MIDDLEWARE & STATIC SERVING ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`💈 Barbearia Seu Galdino Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
