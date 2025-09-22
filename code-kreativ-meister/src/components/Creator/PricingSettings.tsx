import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Plus, Edit, Euro, Clock, Gift, MessageCircle, Coffee, Timer } from 'lucide-react';
import { useCreatorServices, type CreatorService } from '@/hooks/useCreatorServices';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

const serviceTypeOptions = [
  { value: 'tip', label: 'Trinkgeld', icon: Euro },
  { value: 'gift', label: 'Geschenk', icon: Gift },
  { value: 'private_chat', label: 'Privat Chat', icon: MessageCircle },
  { value: 'extend_time', label: 'Zeit verlängern', icon: Timer },
  { value: 'drink', label: 'Getränke', icon: Coffee },
] as const;

export const PricingSettings = () => {
  const { user } = useAuth();
  const { services, profile, loading, getServicesByType, updateService, createService } = useCreatorServices(user?.id);
  const [editingService, setEditingService] = useState<CreatorService | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newService, setNewService] = useState({
    service_type: 'tip' as CreatorService['service_type'],
    service_name: '',
    price: 0,
    duration_minutes: undefined as number | undefined,
    description: '',
    icon: '',
    is_active: true
  });

  const handleSaveService = async (service: CreatorService, updates: Partial<CreatorService>) => {
    await updateService(service.id, updates);
    setEditingService(null);
  };

  const handleCreateService = async () => {
    if (!newService.service_name || newService.price <= 0) {
      toast.error('Bitte alle Pflichtfelder ausfüllen');
      return;
    }

    await createService(newService);
    setShowCreateDialog(false);
    setNewService({
      service_type: 'tip',
      service_name: '',
      price: 0,
      duration_minutes: undefined,
      description: '',
      icon: '',
      is_active: true
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Lädt Preiseinstellungen...</p>
        </div>
      </div>
    );
  }

  const renderServiceGroup = (type: CreatorService['service_type'], title: string, Icon: any) => {
    const servicesOfType = getServicesByType(type);
    
    return (
      <Card key={type}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="h-5 w-5" />
            {title}
            <Badge variant="secondary">{servicesOfType.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {servicesOfType.map((service) => (
            <div key={service.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{service.icon}</span>
                  <div>
                    <h4 className="font-medium">{service.service_name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {service.price}€ {service.duration_minutes && `• ${service.duration_minutes} Min`}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Switch 
                  checked={service.is_active}
                  onCheckedChange={(checked) => updateService(service.id, { is_active: checked })}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditingService(service)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Preise & Services
          </h2>
          <p className="text-muted-foreground">
            Lege deine eigenen Preise für Tips, Geschenke und private Chats fest
          </p>
        </div>
        
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Neuer Service
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Neuen Service erstellen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Service-Typ</Label>
                <Select 
                  value={newService.service_type} 
                  onValueChange={(value) => 
                    setNewService({ ...newService, service_type: value as CreatorService['service_type'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Name</Label>
                <Input
                  value={newService.service_name}
                  onChange={(e) => setNewService({ ...newService, service_name: e.target.value })}
                  placeholder="z.B. Premium Tip"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preis (€)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={newService.price}
                    onChange={(e) => setNewService({ ...newService, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                
                {(newService.service_type === 'private_chat' || newService.service_type === 'extend_time') && (
                  <div>
                    <Label>Dauer (Minuten)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={newService.duration_minutes || ''}
                      onChange={(e) => setNewService({ ...newService, duration_minutes: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <Label>Icon/Emoji</Label>
                <Input
                  value={newService.icon}
                  onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                  placeholder="🎉"
                />
              </div>
              
              <div>
                <Label>Beschreibung</Label>
                <Textarea
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Kurze Beschreibung des Services"
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                  Abbrechen
                </Button>
                <Button onClick={handleCreateService}>
                  Service erstellen
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Profile Info */}
      {profile && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div>
                <h3 className="font-semibold">{profile.display_name}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline">{profile.tier}</Badge>
                  <span>•</span>
                  <span>{profile.followers_count} Follower</span>
                  <span>•</span>
                  <span>{profile.total_earnings}€ verdient</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      {/* Service Groups */}
      <div className="grid gap-6">
        {serviceTypeOptions.map(({ value, label, icon }) => 
          renderServiceGroup(value, label, icon)
        )}
      </div>

      {/* Edit Service Dialog */}
      {editingService && (
        <Dialog open={!!editingService} onOpenChange={() => setEditingService(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Service bearbeiten</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={editingService.service_name}
                  onChange={(e) => setEditingService({ ...editingService, service_name: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Preis (€)</Label>
                  <Input
                    type="number"
                    min="0"
                    step="0.5"
                    value={editingService.price}
                    onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                
                {(editingService.service_type === 'private_chat' || editingService.service_type === 'extend_time') && (
                  <div>
                    <Label>Dauer (Minuten)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={editingService.duration_minutes || ''}
                      onChange={(e) => setEditingService({ ...editingService, duration_minutes: parseInt(e.target.value) || undefined })}
                    />
                  </div>
                )}
              </div>
              
              <div>
                <Label>Icon/Emoji</Label>
                <Input
                  value={editingService.icon || ''}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                />
              </div>
              
              <div>
                <Label>Beschreibung</Label>
                <Textarea
                  value={editingService.description || ''}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                />
              </div>
              
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setEditingService(null)}>
                  Abbrechen
                </Button>
                <Button onClick={() => handleSaveService(editingService, editingService)}>
                  Speichern
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};