import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CreatorService {
  id: string;
  creator_id: string;
  service_type: 'tip' | 'gift' | 'private_chat' | 'extend_time' | 'drink';
  service_name: string;
  price: number;
  duration_minutes?: number;
  description?: string;
  icon?: string;
  is_active: boolean;
}

export interface CreatorProfile {
  id: string;
  user_id: string;
  display_name?: string;
  bio?: string;
  avatar_url?: string;
  is_verified: boolean;
  tier: 'bronze' | 'silver' | 'gold' | 'diamond';
  followers_count: number;
  total_earnings: number;
}

export const useCreatorServices = (creatorUserId?: string) => {
  const [services, setServices] = useState<CreatorService[]>([]);
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Default services template for new creators
  const defaultServices = [
    // Tips
    { service_type: 'tip', service_name: 'Kleiner Tip', price: 1, icon: '💸', description: 'Kleiner Tip' },
    { service_type: 'tip', service_name: 'Netter Tip', price: 5, icon: '💰', description: 'Netter Tip' },
    { service_type: 'tip', service_name: 'Großer Tip', price: 10, icon: '🎉', description: 'Großer Tip' },
    { service_type: 'tip', service_name: 'Super Tip', price: 20, icon: '🔥', description: 'Super Tip' },
    { service_type: 'tip', service_name: 'VIP Tip', price: 50, icon: '💎', description: 'VIP Tip' },
    { service_type: 'tip', service_name: 'König Tip', price: 100, icon: '👑', description: 'König Tip' },
    
    // Gifts
    { service_type: 'gift', service_name: 'Rose', price: 2, icon: '🌹', description: 'Eine schöne Rose' },
    { service_type: 'gift', service_name: 'Herz', price: 5, icon: '💖', description: 'Ein liebevolles Herz' },
    { service_type: 'gift', service_name: 'Diamant', price: 10, icon: '💎', description: 'Ein funkelnder Diamant' },
    { service_type: 'gift', service_name: 'Krone', price: 20, icon: '👑', description: 'Eine königliche Krone' },
    { service_type: 'gift', service_name: 'Ferrari', price: 50, icon: '🏎️', description: 'Ein luxuriöser Sportwagen' },
    { service_type: 'gift', service_name: 'Yacht', price: 100, icon: '🛥️', description: 'Eine elegante Yacht' },
    
    // Drinks
    { service_type: 'drink', service_name: 'Kaffee', price: 3, icon: '☕', description: 'Ein heißer Kaffee' },
    { service_type: 'drink', service_name: 'Cocktail', price: 8, icon: '🍹', description: 'Ein erfrischender Cocktail' },
    { service_type: 'drink', service_name: 'Champagner', price: 25, icon: '🍾', description: 'Luxuriöser Champagner' },
    { service_type: 'drink', service_name: 'Wein', price: 15, icon: '🍷', description: 'Ein guter Wein' },
    
    // Private Chat Packages
    { service_type: 'private_chat', service_name: 'Privat Chat', price: 15, duration_minutes: 10, icon: '💬', description: '10 Minuten privater Chat' },
    { service_type: 'private_chat', service_name: 'VIP Experience', price: 25, duration_minutes: 20, icon: '⭐', description: '20 Minuten VIP-Zeit' },
    { service_type: 'private_chat', service_name: 'Royal Package', price: 40, duration_minutes: 30, icon: '👑', description: '30 Minuten exklusive Zeit' },
    
    // Time Extensions
    { service_type: 'extend_time', service_name: 'Kurz verlängern', price: 5, duration_minutes: 5, icon: '⏰', description: '5 Minuten verlängern' },
    { service_type: 'extend_time', service_name: 'Standard verlängern', price: 8, duration_minutes: 10, icon: '⏱️', description: '10 Minuten verlängern' },
    { service_type: 'extend_time', service_name: 'Lange verlängern', price: 12, duration_minutes: 15, icon: '⏲️', description: '15 Minuten verlängern' },
    { service_type: 'extend_time', service_name: 'Premium verlängern', price: 20, duration_minutes: 30, icon: '🕐', description: '30 Minuten verlängern' },
  ];

  useEffect(() => {
    if (creatorUserId) {
      loadCreatorServices(creatorUserId);
    }
  }, [creatorUserId]);

  const loadCreatorServices = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      // First, get or create creator profile
      let { data: existingProfile } = await supabase
        .from('creator_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (!existingProfile) {
        // Create new creator profile
        const { data: newProfile, error: profileError } = await supabase
          .from('creator_profiles')
          .insert({
            user_id: userId,
            display_name: `Creator ${userId.slice(0, 8)}`,
            tier: 'bronze'
          })
          .select()
          .single();

        if (profileError) throw profileError;
        existingProfile = newProfile;

        // Create default services for new creator
        if (existingProfile) {
          const servicesToInsert = defaultServices.map(service => ({
            ...service,
            creator_id: existingProfile.id,
            is_active: true
          }));

          await supabase
            .from('creator_services')
            .insert(servicesToInsert);
        }
      }

      setProfile(existingProfile as CreatorProfile);

      // Load services
      const { data: servicesData, error: servicesError } = await supabase
        .from('creator_services')
        .select('*')
        .eq('creator_id', existingProfile.id)
        .eq('is_active', true)
        .order('service_type', { ascending: true })
        .order('price', { ascending: true });

      if (servicesError) throw servicesError;
      setServices((servicesData || []) as CreatorService[]);

    } catch (err: any) {
      console.error('Error loading creator services:', err);
      setError(err.message);
      toast.error('Fehler beim Laden der Creator-Services');
    } finally {
      setLoading(false);
    }
  };

  const getServicesByType = (type: CreatorService['service_type']) => {
    return services.filter(service => service.service_type === type);
  };

  const updateService = async (serviceId: string, updates: Partial<CreatorService>) => {
    try {
      const { error } = await supabase
        .from('creator_services')
        .update(updates)
        .eq('id', serviceId);

      if (error) throw error;

      setServices(prev => prev.map(service => 
        service.id === serviceId ? { ...service, ...updates } : service
      ));

      toast.success('Service aktualisiert');
    } catch (err: any) {
      console.error('Error updating service:', err);
      toast.error('Fehler beim Aktualisieren des Services');
    }
  };

  const createService = async (serviceData: Omit<CreatorService, 'id' | 'creator_id'>) => {
    if (!profile) return;

    try {
      const { data, error } = await supabase
        .from('creator_services')
        .insert({
          ...serviceData,
          creator_id: profile.id
        })
        .select()
        .single();

      if (error) throw error;

      setServices(prev => [...prev, data as CreatorService]);
      toast.success('Service erstellt');
    } catch (err: any) {
      console.error('Error creating service:', err);
      toast.error('Fehler beim Erstellen des Services');
    }
  };

  const toggleServiceActive = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (!service) return;

    await updateService(serviceId, { is_active: !service.is_active });
  };

  return {
    services,
    profile,
    loading,
    error,
    getServicesByType,
    updateService,
    createService,
    toggleServiceActive,
    reload: () => creatorUserId && loadCreatorServices(creatorUserId)
  };
};