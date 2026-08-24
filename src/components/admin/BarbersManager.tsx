import React, { useState } from 'react';
import { User, Scissors, Percent, Key, Plus, Trash2, Save, Check, Shield, Camera, Link as LinkIcon, Image as ImageIcon } from 'lucide-react';
import { Barber } from '../../types';

interface BarbersManagerProps {
  barbers: Barber[];
  onSaveBarbers: (barbers: Barber[]) => void;
}

export const BarbersManager: React.FC<BarbersManagerProps> = ({ barbers, onSaveBarbers }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBarberName, setNewBarberName] = useState('');
  const [newBarberPhone, setNewBarberPhone] = useState('');
  const [newBarberPhoto, setNewBarberPhoto] = useState('');
  const [newBarberServComm, setNewBarberServComm] = useState(50);
  const [newBarberProdComm, setNewBarberProdComm] = useState(10);
  const [newBarberPin, setNewBarberPin] = useState('1234');

  const [editingBarber, setEditingBarber] = useState<Barber | null>(null);

  const handleBarberPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (isEditing && editingBarber) {
        setEditingBarber({ ...editingBarber, photo: base64 });
      } else {
        setNewBarberPhoto(base64);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleAddBarber = () => {
    if (!newBarberName.trim()) return;

    const newBarber: Barber = {
      id: `b-${Date.now()}`,
      name: newBarberName.trim(),
      phone: newBarberPhone.trim() || '84999999999',
      photo:
        newBarberPhoto.trim() ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
      commissionServicePercent: Number(newBarberServComm),
      commissionProductPercent: Number(newBarberProdComm),
      role: 'barber',
      pinCode: newBarberPin.trim() || '1234',
    };

    onSaveBarbers([...barbers, newBarber]);
    setShowAddModal(false);
    setNewBarberName('');
    setNewBarberPhone('');
    setNewBarberPhoto('');
  };

  const handleUpdateBarber = (updatedBarber: Barber) => {
    const updated = barbers.map((b) => (b.id === updatedBarber.id ? updatedBarber : b));
    onSaveBarbers(updated);
    setEditingBarber(null);
  };

  const handleDeleteBarber = (id: string) => {
    if (barbers.length <= 1) return;
    if (confirm('Tem certeza que deseja remover este barbeiro?')) {
      onSaveBarbers(barbers.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-card border border-border card-shadow flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-foreground">Gestão da Equipe de Barbeiros</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Configure fotos, taxas de comissão personalizadas (% Serviços e % Produtos) e senhas PIN para acesso restrito.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-3 rounded-2xl bg-primary text-primary-foreground font-extrabold text-xs flex items-center gap-2 hover:bg-primary/90 transition-all cursor-pointer shadow-[0_0_15px_-3px_hsl(45_97%_54%/0.4)]"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Cadastrar Barbeiro
        </button>
      </div>

      {/* Barbers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {barbers.map((barber) => (
          <div
            key={barber.id}
            className="p-6 rounded-3xl bg-card border border-border card-shadow space-y-5 relative overflow-hidden"
          >
            <div className="flex items-center gap-4">
              {barber.photo ? (
                <img
                  src={barber.photo}
                  alt={barber.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-primary/40 shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-2xl border-2 border-primary/40 shrink-0">
                  {barber.name.charAt(0)}
                </div>
              )}
              <div className="overflow-hidden">
                <h4 className="font-bold text-lg text-foreground truncate">{barber.name}</h4>
                <p className="text-xs text-muted-foreground">{barber.phone}</p>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase">
                  {barber.role === 'master' ? 'Mestre / Proprietário' : 'Barbeiro Profissional'}
                </span>
              </div>
            </div>

            {/* Commissions */}
            <div className="p-4 rounded-2xl bg-secondary/50 border border-border space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Comissão em Serviços:</span>
                <strong className="text-primary font-bold text-sm">{barber.commissionServicePercent}%</strong>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Comissão em Produtos:</span>
                <strong className="text-emerald-400 font-bold text-sm">{barber.commissionProductPercent}%</strong>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-border/50">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-muted-foreground" /> PIN de Acesso:
                </span>
                <strong className="font-mono text-foreground">{barber.pinCode}</strong>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setEditingBarber(barber)}
                className="px-3.5 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground hover:text-foreground hover:bg-secondary cursor-pointer transition-all"
              >
                Editar Perfil & Foto
              </button>
              {barber.role !== 'master' && (
                <button
                  onClick={() => handleDeleteBarber(barber.id)}
                  className="px-3.5 py-2 rounded-xl bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 cursor-pointer transition-all"
                >
                  Remover
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Edit Barber Modal */}
      {editingBarber && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-foreground">Editar Barbeiro: {editingBarber.name}</h3>

            <div className="space-y-4">
              {/* Photo Preview & Options */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  Foto de Perfil
                </label>
                <div className="flex items-center gap-4">
                  {editingBarber.photo ? (
                    <img
                      src={editingBarber.photo}
                      alt="Preview"
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-muted-foreground shrink-0 font-bold">
                      {editingBarber.name.charAt(0)}
                    </div>
                  )}

                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-xl cursor-pointer font-bold text-xs transition-all">
                    <Camera className="w-4 h-4" />
                    <span>Enviar foto do Celular</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleBarberPhotoUpload(e, true)}
                    />
                  </label>
                </div>

                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="Ou cole a URL da imagem aqui..."
                    value={editingBarber.photo || ''}
                    onChange={(e) =>
                      setEditingBarber({
                        ...editingBarber,
                        photo: e.target.value,
                      })
                    }
                    className="w-full bg-secondary border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-bold">
                  Nome Profissional
                </label>
                <input
                  type="text"
                  value={editingBarber.name}
                  onChange={(e) =>
                    setEditingBarber({
                      ...editingBarber,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-bold">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={editingBarber.phone}
                  onChange={(e) =>
                    setEditingBarber({
                      ...editingBarber,
                      phone: e.target.value,
                    })
                  }
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-bold">
                    Comissão Serviços (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editingBarber.commissionServicePercent}
                    onChange={(e) =>
                      setEditingBarber({
                        ...editingBarber,
                        commissionServicePercent: Number(e.target.value),
                      })
                    }
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-bold">
                    Comissão Produtos (%)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={editingBarber.commissionProductPercent}
                    onChange={(e) =>
                      setEditingBarber({
                        ...editingBarber,
                        commissionProductPercent: Number(e.target.value),
                      })
                    }
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-bold">
                  PIN Restrito de Login
                </label>
                <input
                  type="text"
                  value={editingBarber.pinCode}
                  onChange={(e) =>
                    setEditingBarber({
                      ...editingBarber,
                      pinCode: e.target.value,
                    })
                  }
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground font-mono outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setEditingBarber(null)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleUpdateBarber(editingBarber)}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Barber Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="bg-card border border-border rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-foreground">Cadastrar Novo Barbeiro</h3>

            <div className="space-y-4">
              {/* Photo Input for New Barber */}
              <div className="space-y-2">
                <label className="block text-xs uppercase tracking-wider text-muted-foreground font-bold">
                  Foto de Perfil
                </label>
                <div className="flex items-center gap-4">
                  {newBarberPhoto ? (
                    <img
                      src={newBarberPhoto}
                      alt="Preview"
                      className="w-14 h-14 rounded-full object-cover border-2 border-primary shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-secondary flex items-center justify-center text-muted-foreground shrink-0 font-bold">
                      <Camera className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                  )}

                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-xl cursor-pointer font-bold text-xs transition-all">
                    <Camera className="w-4 h-4" />
                    <span>Tirar Foto / Enviar do Celular</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleBarberPhotoUpload(e, false)}
                    />
                  </label>
                </div>

                <div className="relative">
                  <LinkIcon className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-3" />
                  <input
                    type="url"
                    placeholder="Ou cole a URL da imagem aqui..."
                    value={newBarberPhoto}
                    onChange={(e) => setNewBarberPhoto(e.target.value)}
                    className="w-full bg-secondary border border-border rounded-xl pl-9 pr-3 py-2 text-xs text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-bold">
                  Nome Profissional
                </label>
                <input
                  type="text"
                  value={newBarberName}
                  onChange={(e) => setNewBarberName(e.target.value)}
                  placeholder="Ex: Alex Silva"
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-bold">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={newBarberPhone}
                  onChange={(e) => setNewBarberPhone(e.target.value)}
                  placeholder="84988776655"
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-bold">
                    % Serviços
                  </label>
                  <input
                    type="number"
                    value={newBarberServComm}
                    onChange={(e) => setNewBarberServComm(Number(e.target.value))}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-bold">
                    % Produtos
                  </label>
                  <input
                    type="number"
                    value={newBarberProdComm}
                    onChange={(e) => setNewBarberProdComm(Number(e.target.value))}
                    className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1 font-bold">
                  PIN de Acesso
                </label>
                <input
                  type="text"
                  value={newBarberPin}
                  onChange={(e) => setNewBarberPin(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-xl px-3 py-2 text-sm text-foreground font-mono outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl border border-border text-xs font-bold text-muted-foreground"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddBarber}
                disabled={!newBarberName.trim()}
                className="px-5 py-2 rounded-xl bg-primary text-primary-foreground font-extrabold text-xs disabled:opacity-50"
              >
                Cadastrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
