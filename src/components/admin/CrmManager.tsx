import React, { useState } from 'react';
import { Users, Search, Edit3, Image, Award, Star, Phone, Calendar, Save, Plus, FileText, Check } from 'lucide-react';
import { CustomerProfile } from '../../types';

interface CrmManagerProps {
  profiles: CustomerProfile[];
  onSaveProfiles: (profiles: CustomerProfile[]) => void;
}

export const CrmManager: React.FC<CrmManagerProps> = ({ profiles, onSaveProfiles }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfile, setSelectedProfile] = useState<CustomerProfile | null>(profiles[0] || null);

  // Edit fields for selected profile
  const [editTechnicalNote, setEditTechnicalNote] = useState(selectedProfile?.technicalNote || '');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const filteredProfiles = profiles.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm)
  );

  const handleSelectProfile = (p: CustomerProfile) => {
    setSelectedProfile(p);
    setEditTechnicalNote(p.technicalNote || '');
    setNewPhotoUrl('');
    setSaveSuccess(false);
  };

  const handleSaveNote = () => {
    if (!selectedProfile) return;

    const updated = profiles.map((p) => {
      if (p.id === selectedProfile.id) {
        return {
          ...p,
          technicalNote: editTechnicalNote,
        };
      }
      return p;
    });

    onSaveProfiles(updated);
    setSelectedProfile((prev) => (prev ? { ...prev, technicalNote: editTechnicalNote } : null));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleAddPhoto = () => {
    if (!selectedProfile || !newPhotoUrl.trim()) return;

    const updatedPhotos = [...(selectedProfile.photos || []), newPhotoUrl.trim()];
    const updated = profiles.map((p) => {
      if (p.id === selectedProfile.id) {
        return {
          ...p,
          photos: updatedPhotos,
        };
      }
      return p;
    });

    onSaveProfiles(updated);
    setSelectedProfile((prev) => (prev ? { ...prev, photos: updatedPhotos } : null));
    setNewPhotoUrl('');
  };

  // Top VIP Customers Ranking
  const topVipCustomers = [...profiles].sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Top Ranking Cards */}
      <div className="p-6 rounded-3xl bg-card border border-border card-shadow space-y-4">
        <div className="flex items-center gap-2 text-primary font-bold text-sm">
          <Award className="w-5 h-5" /> Ranking de Clientes VIP
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topVipCustomers.map((vip, idx) => (
            <div
              key={vip.id}
              onClick={() => handleSelectProfile(vip)}
              className="p-4 rounded-2xl bg-secondary/50 border border-primary/30 hover:border-primary transition-all cursor-pointer flex items-center gap-4 group"
            >
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary font-extrabold flex items-center justify-center text-base border border-primary/40">
                #{idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-sm text-foreground truncate group-hover:text-primary transition-colors">
                  {vip.name}
                </h5>
                <p className="text-xs text-muted-foreground">{vip.totalVisits} visitas ativas</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-black text-primary">R$ {vip.totalSpent}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main CRM Layout: Customer List + Ficha Técnica Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Customer Directory (4 cols) */}
        <div className="lg:col-span-4 bg-card border border-border rounded-3xl p-5 card-shadow space-y-4 flex flex-col h-[650px]">
          <div className="space-y-2">
            <h4 className="font-bold text-base text-foreground">Base de Clientes</h4>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou WhatsApp..."
                className="w-full bg-secondary border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground outline-none focus:border-primary"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredProfiles.map((p) => {
              const isSelected = selectedProfile?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelectProfile(p)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-primary/20 border-primary text-foreground'
                      : 'bg-secondary/40 border-border/60 hover:border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.phone}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] font-bold text-primary block">{p.totalVisits} visitas</span>
                    <span className="text-[10px] text-muted-foreground">Última: {p.lastVisit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Customer Ficha Técnica & Photo Evolution (8 cols) */}
        <div className="lg:col-span-8 bg-card border border-border rounded-3xl p-6 card-shadow space-y-6">
          {selectedProfile ? (
            <>
              {/* Profile Top Summary */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-primary/20 text-primary font-black text-2xl flex items-center justify-center border border-primary/30">
                    {selectedProfile.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-foreground">{selectedProfile.name}</h3>
                    <p className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                      <Phone className="w-3.5 h-3.5 text-primary" /> {selectedProfile.phone}
                      {selectedProfile.birthDate && ` • Nasc: ${selectedProfile.birthDate}`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 text-xs">
                  <div className="p-3 rounded-2xl bg-secondary border border-border text-center">
                    <span className="text-muted-foreground block text-[10px] uppercase">Visitas</span>
                    <strong className="text-foreground text-sm font-black">{selectedProfile.totalVisits}</strong>
                  </div>
                  <div className="p-3 rounded-2xl bg-secondary border border-border text-center">
                    <span className="text-muted-foreground block text-[10px] uppercase">Total Gasto</span>
                    <strong className="text-primary text-sm font-black">R$ {selectedProfile.totalSpent}</strong>
                  </div>
                </div>
              </div>

              {/* Technical Note Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <FileText className="w-4 h-4 text-primary" /> Ficha Técnica & Preferências de Corte
                  </label>

                  <button
                    onClick={handleSaveNote}
                    className="px-4 py-1.5 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs flex items-center gap-1.5 hover:bg-primary/90 cursor-pointer"
                  >
                    {saveSuccess ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
                    {saveSuccess ? 'Salvo!' : 'Salvar Ficha'}
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={editTechnicalNote}
                  onChange={(e) => setEditTechnicalNote(e.target.value)}
                  placeholder="Registre preferências de corte (ex: 'Pente 2 nas laterais, tesoura no topo, acerta a barba com navalha')..."
                  className="w-full bg-secondary border border-border rounded-2xl p-4 text-xs sm:text-sm text-foreground outline-none focus:border-primary resize-none leading-relaxed"
                />
              </div>

              {/* Photo Evolution Gallery */}
              <div className="space-y-4 pt-2 border-t border-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Image className="w-4 h-4 text-primary" /> Galeria de Evolução do Visual
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newPhotoUrl}
                      onChange={(e) => setNewPhotoUrl(e.target.value)}
                      placeholder="Cole URL de foto de corte..."
                      className="bg-secondary border border-border rounded-xl px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary w-60"
                    />
                    <button
                      onClick={handleAddPhoto}
                      disabled={!newPhotoUrl.trim()}
                      className="px-3 py-1.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 disabled:opacity-50 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {selectedProfile.photos && selectedProfile.photos.length > 0 ? (
                    selectedProfile.photos.map((photo, i) => (
                      <div key={i} className="aspect-square rounded-2xl overflow-hidden bg-muted border border-border group relative">
                        <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                    ))
                  ) : (
                    <p className="col-span-full text-xs text-muted-foreground text-center py-6 border border-dashed border-border rounded-2xl">
                      Nenhuma foto de visual cadastrada para este cliente. Adicione o link acima para acompanhar a evolução do estilo.
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <p className="text-center text-muted-foreground py-12 text-xs">
              Selecione um cliente no menu à esquerda para visualizar sua Ficha Técnica.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
