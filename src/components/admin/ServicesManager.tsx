import React, { useState } from 'react';
import { Scissors, Plus, Save, Trash2, X, Clock, DollarSign, Image as ImageIcon, Check, Camera, Link as LinkIcon } from 'lucide-react';
import { Service } from '../../types';

interface ServicesManagerProps {
  services: Service[];
  onSaveServices: (services: Service[]) => void;
}

export const ServicesManager: React.FC<ServicesManagerProps> = ({ services, onSaveServices }) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState<Service>({
    name: '',
    time: 30,
    price: 30,
    image: '',
  });

  const handleServiceImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isEditing: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (isEditing && editingService) {
        setEditingService({ ...editingService, image: base64 });
      } else {
        setNewService({ ...newService, image: base64 });
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleUpdateService = (updated: Service) => {
    const newServices = services.map((s) => (s.id === updated.id ? updated : s));
    onSaveServices(newServices);
    setEditingService(null);
  };

  const handleAddService = () => {
    if (!newService.name) return;
    const s: Service = {
      ...newService,
      id: `s${Date.now()}`,
    };
    onSaveServices([...services, s]);
    setShowAddModal(false);
    setNewService({ name: '', time: 30, price: 30, image: '' });
  };

  const handleDeleteService = (id: string | undefined) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      onSaveServices(services.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-card p-6 rounded-3xl border border-border card-shadow">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-foreground flex items-center gap-2">
            <Scissors className="w-6 h-6 text-primary" />
            Serviços
          </h2>
          <p className="text-muted-foreground text-sm">Gerencie o catálogo de serviços oferecidos.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-all card-shadow"
        >
          <Plus className="w-5 h-5" /> Novo Serviço
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <div key={service.id} className="p-6 rounded-3xl bg-card border border-border card-shadow space-y-4">
            <div className="flex gap-4">
              {service.image ? (
                <img src={service.image} alt={service.name} className="w-16 h-16 rounded-2xl object-cover shrink-0 border border-border" />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-secondary/50 flex items-center justify-center shrink-0">
                  <Scissors className="w-8 h-8 text-muted-foreground/50" />
                </div>
              )}
              <div className="flex-1 overflow-hidden">
                <h4 className="font-bold text-lg truncate">{service.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs bg-secondary px-2 py-1 rounded-md text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {service.time} min
                  </span>
                  <span className="text-xs bg-primary/20 px-2 py-1 rounded-md text-primary font-bold">
                    R$ {service.price.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-2 pt-2 border-t border-border/50">
              <button
                onClick={() => setEditingService(service)}
                className="px-4 py-2 bg-secondary text-foreground text-xs font-bold rounded-lg hover:bg-secondary/80"
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteService(service.id)}
                className="px-4 py-2 bg-destructive/10 text-destructive text-xs font-bold rounded-lg hover:bg-destructive/20"
              >
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-3xl w-full max-w-md border border-border card-shadow relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEditingService(null)}
              className="absolute top-4 right-4 p-2 bg-secondary rounded-full text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6">Editar Serviço</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Nome do Serviço</label>
                <input
                  type="text"
                  value={editingService.name}
                  onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Preço (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={editingService.price}
                      onChange={(e) => setEditingService({ ...editingService, price: Number(e.target.value) })}
                      className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Tempo (min)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={editingService.time}
                      onChange={(e) => setEditingService({ ...editingService, time: Number(e.target.value) })}
                      className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Service Image Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground block">Imagem do Serviço</label>
                <div className="flex items-center gap-3">
                  {editingService.image ? (
                    <img src={editingService.image} alt="Preview" className="w-14 h-14 rounded-2xl object-cover border border-primary shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                      <Scissors className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                  )}

                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-xl cursor-pointer font-bold text-xs transition-all">
                    <Camera className="w-4 h-4" />
                    <span>Enviar foto do Celular</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleServiceImageUpload(e, true)}
                    />
                  </label>
                </div>

                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={editingService.image}
                    onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                    placeholder="Ou cole a URL da imagem aqui..."
                    className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 text-foreground text-sm"
                  />
                </div>
              </div>

              <button
                onClick={() => handleUpdateService(editingService)}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-all card-shadow"
              >
                <Save className="w-5 h-5" />
                Salvar Alterações
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card p-6 rounded-3xl w-full max-w-md border border-border card-shadow relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 p-2 bg-secondary rounded-full text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-6">Novo Serviço</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-muted-foreground mb-1 block">Nome do Serviço</label>
                <input
                  type="text"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="Ex: Corte Social"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-foreground"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Preço (R$)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={newService.price}
                      onChange={(e) => setNewService({ ...newService, price: Number(e.target.value) })}
                      className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 text-foreground"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-1 block">Tempo (min)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={newService.time}
                      onChange={(e) => setNewService({ ...newService, time: Number(e.target.value) })}
                      className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 text-foreground"
                    />
                  </div>
                </div>
              </div>

              {/* Service Image Section */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground block">Imagem do Serviço</label>
                <div className="flex items-center gap-3">
                  {newService.image ? (
                    <img src={newService.image} alt="Preview" className="w-14 h-14 rounded-2xl object-cover border border-primary shrink-0" />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground shrink-0">
                      <Scissors className="w-6 h-6 text-muted-foreground/50" />
                    </div>
                  )}

                  <label className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 rounded-xl cursor-pointer font-bold text-xs transition-all">
                    <Camera className="w-4 h-4" />
                    <span>Enviar foto do Celular</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleServiceImageUpload(e, false)}
                    />
                  </label>
                </div>

                <div className="relative">
                  <LinkIcon className="absolute left-3 top-3.5 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={newService.image}
                    onChange={(e) => setNewService({ ...newService, image: e.target.value })}
                    placeholder="Ou cole a URL da imagem aqui..."
                    className="w-full bg-secondary/50 border border-border rounded-xl pl-10 pr-4 py-3 text-foreground text-sm"
                  />
                </div>
              </div>

              <button
                onClick={handleAddService}
                className="w-full mt-4 flex items-center justify-center gap-2 bg-primary text-primary-foreground font-bold py-3 rounded-xl hover:bg-primary/90 transition-all card-shadow"
              >
                <Check className="w-5 h-5" />
                Cadastrar Serviço
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
