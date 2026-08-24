import React, { useState, useEffect } from 'react';
import { Smartphone, Download, X, Share, PlusSquare, Check } from 'lucide-react';
import { WHITELABEL_CONFIG } from '../config/whitelabel';

export const PwaInstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIos, setIsIos] = useState<boolean>(false);
  const [showIosGuide, setShowIosGuide] = useState<boolean>(false);
  const [installed, setInstalled] = useState<boolean>(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(isIosDevice);

    // Listen for Chrome/Android install prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already in standalone mode
    if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
      setInstalled(true);
      setShowBanner(false);
    } else if (isIosDevice) {
      // Show iOS banner if not standalone
      setShowBanner(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstalled(true);
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else if (isIos) {
      setShowIosGuide(true);
    }
  };

  if (!showBanner || installed) return null;

  return (
    <>
      {/* Floating Bottom PWA Banner */}
      <div className="fixed bottom-4 left-4 right-4 z-50 max-w-md mx-auto bg-card/95 backdrop-blur-xl border border-primary/30 rounded-2xl p-4 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-foreground flex items-center gap-1.5">
                Instalar App {WHITELABEL_CONFIG.shortName}
              </h4>
              <p className="text-xs text-muted-foreground">
                Agende rápido em 1-clique direto da tela do seu celular!
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInstallClick}
              className="px-3.5 py-2 bg-primary text-primary-foreground font-extrabold text-xs rounded-xl hover:bg-primary/90 transition-all shadow-[0_0_15px_-3px_hsl(45_97%_54%/0.5)] cursor-pointer whitespace-nowrap flex items-center gap-1"
            >
              <Download className="w-3.5 h-3.5" /> Baixar
            </button>
            <button
              onClick={() => setShowBanner(false)}
              className="p-2 text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS Modal Guide */}
      {showIosGuide && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-card border border-border rounded-3xl w-full max-w-sm p-6 space-y-5 text-center relative shadow-2xl">
            <button
              onClick={() => setShowIosGuide(false)}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto text-primary">
              <Smartphone className="w-8 h-8" />
            </div>

            <h3 className="text-lg font-bold text-foreground">Como instalar no seu iPhone:</h3>

            <ol className="text-xs text-muted-foreground space-y-3 text-left bg-secondary/50 p-4 rounded-2xl border border-border">
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-[11px] shrink-0">
                  1
                </span>
                <span>
                  Toque no ícone de <strong>Compartilhar</strong> <Share className="w-3.5 h-3.5 inline text-primary" /> na barra inferior do Safari.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-[11px] shrink-0">
                  2
                </span>
                <span>
                  Role a lista e selecione <strong>"Adicionar à Tela de Início"</strong> <PlusSquare className="w-3.5 h-3.5 inline text-primary" />.
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-[11px] shrink-0">
                  3
                </span>
                <span>
                  Confirme no canto superior direito para criar o ícone nativo no seu iPhone!
                </span>
              </li>
            </ol>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full py-3 bg-primary text-primary-foreground font-bold rounded-xl text-xs hover:bg-primary/90"
            >
              Entendido!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
