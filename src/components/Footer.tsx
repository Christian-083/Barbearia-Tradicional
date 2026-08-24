import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 px-4 text-center border-t border-border flex flex-col items-center gap-4">
      <p className="text-muted-foreground text-sm">
        © 2026 A Tradicional Barbearia. Todos os direitos reservados.
      </p>
      <Link
        to="/admin"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground text-xs font-bold transition-all border border-border hover:border-primary/50"
      >
        <Shield className="w-4 h-4 text-primary" />
        <span>Acessar Painel Administrativo</span>
      </Link>
    </footer>
  );
};
