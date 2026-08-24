import React, { useState, useEffect } from 'react';
import { Camera, Trash2, Image as ImageIcon, Link as LinkIcon, Plus, RefreshCw } from 'lucide-react';
import { GALLERY_IMAGES } from '../../data/services';

export const GalleryManager: React.FC = () => {
  const [customImages, setCustomImages] = useState<string[]>([]);
  const [removedDefaults, setRemovedDefaults] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');

  useEffect(() => {
    const savedCustom = localStorage.getItem('galdino_custom_gallery');
    if (savedCustom) {
      try {
        setCustomImages(JSON.parse(savedCustom));
      } catch (e) {}
    }

    const savedRemoved = localStorage.getItem('galdino_removed_defaults');
    if (savedRemoved) {
      try {
        setRemovedDefaults(JSON.parse(savedRemoved));
      } catch (e) {}
    }
  }, []);

  const notifyChange = () => {
    window.dispatchEvent(new Event('storage'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      const newImages = [base64, ...customImages];
      setCustomImages(newImages);
      try {
        localStorage.setItem('galdino_custom_gallery', JSON.stringify(newImages));
        notifyChange();
      } catch (err) {
        alert('Memória cheia! Não foi possível salvar a imagem localmente.');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddByUrl = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!urlInput.trim()) return;

    const newImages = [urlInput.trim(), ...customImages];
    setCustomImages(newImages);
    try {
      localStorage.setItem('galdino_custom_gallery', JSON.stringify(newImages));
      notifyChange();
    } catch (err) {
      alert('Não foi possível salvar a imagem.');
    }
    setUrlInput('');
  };

  const removeCustomImage = (index: number) => {
    const newImages = customImages.filter((_, i) => i !== index);
    setCustomImages(newImages);
    localStorage.setItem('galdino_custom_gallery', JSON.stringify(newImages));
    notifyChange();
  };

  const removeDefaultImage = (srcToRemove: string) => {
    const newRemoved = [...removedDefaults, srcToRemove];
    setRemovedDefaults(newRemoved);
    localStorage.setItem('galdino_removed_defaults', JSON.stringify(newRemoved));
    notifyChange();
  };

  const restoreDefaultImages = () => {
    setRemovedDefaults([]);
    localStorage.removeItem('galdino_removed_defaults');
    notifyChange();
  };

  const visibleDefaults = GALLERY_IMAGES.filter((src) => !removedDefaults.includes(src));

  return (
    <div className="bg-card border border-border rounded-3xl p-6 md:p-8 card-shadow space-y-8">
      <div>
        <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 text-foreground">
          <ImageIcon className="w-6 h-6 text-primary" />
          Galeria de Fotos
        </h2>
        <p className="text-muted-foreground mt-1">
          Gerencie as fotos dos cortes que aparecem na página inicial. Adicione ou remova qualquer foto (personalizada ou padrão do sistema).
        </p>
      </div>

      {/* Upload & URL Box */}
      <div className="p-5 rounded-2xl bg-secondary/50 border border-border grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Mobile / File upload */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Enviar Foto (Celular / Galeria)
          </label>
          <label className="flex items-center justify-center gap-3 px-6 py-3.5 bg-primary text-primary-foreground font-extrabold rounded-xl cursor-pointer hover:bg-primary/90 transition-all card-shadow w-full">
            <Camera className="w-5 h-5" />
            <span>Tirar Foto ou Enviar do Celular</span>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileUpload} 
            />
          </label>
        </div>

        {/* URL Input */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground block">
            Adicionar por URL de Imagem
          </label>
          <form onSubmit={handleAddByUrl} className="flex gap-2">
            <div className="relative flex-1">
              <LinkIcon className="w-4 h-4 text-muted-foreground absolute left-3 top-3.5" />
              <input
                type="url"
                placeholder="https://exemplo.com/foto.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="w-full bg-background border border-border rounded-xl pl-9 pr-3 py-2.5 text-sm text-foreground outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              disabled={!urlInput.trim()}
              className="px-4 py-2.5 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-all flex items-center gap-1 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add
            </button>
          </form>
        </div>
      </div>

      {/* Gallery list */}
      <div className="space-y-8">
        {customImages.length > 0 && (
          <div>
            <h3 className="font-bold text-lg mb-4">Fotos Adicionadas ({customImages.length})</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {customImages.map((src, index) => (
                <div key={index} className="relative aspect-[3/4] rounded-xl overflow-hidden group border border-border">
                  <img src={src} alt="Custom" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeCustomImage(index)}
                      className="p-3 bg-destructive text-white rounded-full hover:scale-110 transition-transform cursor-pointer"
                      title="Excluir Foto"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg text-foreground">
              Fotos Padrão do Sistema ({visibleDefaults.length})
            </h3>
            {removedDefaults.length > 0 && (
              <button
                onClick={restoreDefaultImages}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary hover:bg-secondary/80 text-xs font-bold text-primary transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Restaurar Fotos Padrão ({removedDefaults.length} removida{removedDefaults.length > 1 ? 's' : ''})
              </button>
            )}
          </div>

          {visibleDefaults.length === 0 ? (
            <p className="text-sm text-muted-foreground italic py-4">
              Todas as fotos padrão foram removidas.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {visibleDefaults.map((src, index) => (
                <div key={index} className="relative aspect-[3/4] rounded-xl overflow-hidden group border border-border">
                  <img src={src} alt="Padrão" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeDefaultImage(src)}
                      className="p-3 bg-destructive text-white rounded-full hover:scale-110 transition-transform cursor-pointer"
                      title="Excluir Foto Padrão"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
