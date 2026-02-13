import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ProfileData {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
  phone?: string;
  department?: string;
  position?: string;
  bio?: string;
  company_name?: string;
  company_cnpj?: string;
  skills?: string[];
  created_at?: string;
  updated_at?: string;
}

interface UseProfileReturn {
  profile: ProfileData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  saveProfile: (data: Partial<ProfileData>) => Promise<boolean>;
  uploadAvatar: (file: File) => Promise<string | null>;
  updateField: (field: string, value: any) => void;
  refetch: () => Promise<void>;
}

export const useProfile = (): UseProfileReturn => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, updateUserAvatar } = useAuth();
  const { toast } = useToast();

  // 🔄 FETCH: Buscar dados do perfil
  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Simular dados até a API estar funcionando
      const mockProfile: ProfileData = {
        id: user.id,
        email: user.email,
        full_name: user.full_name || 'Fernando Ramalho',
        role: user.role || 'founder',
        avatar_url: user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.full_name || user.email)}&size=150&background=0D8ABC&color=fff&bold=true`,
        position: 'Founder & CEO',
        company_name: 'Humansys',
        company_cnpj: '61.209.173/0001-09'
      };

      setProfile(mockProfile);
      console.log('✅ Profile loaded (mock data):', mockProfile);

    } catch (error: any) {
      console.error('❌ Error fetching profile:', error);
      setError(error.message);

      toast({
        title: "Erro ao carregar perfil",
        description: "Usando dados locais temporariamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  // 💾 SAVE: Salvar perfil
  const saveProfile = useCallback(async (data: Partial<ProfileData>): Promise<boolean> => {
    if (!user?.id || !profile) {
      toast({
        title: "Erro",
        description: "Perfil não carregado",
        variant: "destructive"
      });
      return false;
    }

    try {
      setSaving(true);
      setError(null);

      // Simular salvamento (substituir por API real depois)
      await new Promise(resolve => setTimeout(resolve, 1000));

      const updatedProfile = {
        ...profile,
        ...data,
        updated_at: new Date().toISOString()
      };

      setProfile(updatedProfile);
      console.log('✅ Profile saved (mock):', updatedProfile);

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso!"
      });

      return true;

    } catch (error: any) {
      console.error('❌ Error saving profile:', error);
      setError(error.message);

      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar as alterações. Tente novamente.",
        variant: "destructive"
      });

      return false;
    } finally {
      setSaving(false);
    }
  }, [user?.id, profile, toast]);

  // 📸 UPLOAD: Upload de avatar
  const uploadAvatar = useCallback(async (file: File): Promise<string | null> => {
    if (!user?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive"
      });
      return null;
    }

    try {
      setSaving(true);
      setError(null);

      console.log('📸 Iniciando upload de avatar:', file.name, file.size, file.type);

      // Criar FormData para enviar o arquivo
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', user.id);

      // Fazer upload real para o servidor
      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      console.log('📤 Server response:', result);

      if (!result.success) {
        throw new Error(result.error || 'Upload failed: Server returned error');
      }

      if (!result.avatar_url) {
        throw new Error('Upload failed: No avatar URL in server response');
      }

      const avatarUrl = result.avatar_url;
      console.log('✅ Avatar uploaded successfully:', avatarUrl);

      // Atualizar avatar no contexto de autenticação PRIMEIRO
      updateUserAvatar(avatarUrl);

      // Depois atualizar perfil local
      if (profile) {
        setProfile(prev => ({
          ...prev!,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        }));
      }

      toast({
        title: "Avatar atualizado",
        description: "Sua foto foi alterada com sucesso!"
      });

      return avatarUrl;

    } catch (error: any) {
      console.error('❌ Error uploading avatar:', error);
      setError(error.message);

      toast({
        title: "Erro no upload",
        description: error.message || "Não foi possível fazer upload da imagem. Tente novamente.",
        variant: "destructive"
      });

      return null;
    } finally {
      setSaving(false);
    }
  }, [user?.id, profile, toast, updateUserAvatar]);

  // 🔧 UPDATE: Atualizar campo individual
  const updateField = useCallback((field: string, value: any) => {
    if (!profile) return;

    setProfile(prev => ({
      ...prev!,
      [field]: value
    }));
  }, [profile]);

  // 🔄 REFETCH: Recarregar dados
  const refetch = useCallback(async () => {
    await fetchProfile();
  }, [fetchProfile]);

  // 🚀 Carregar dados na inicialização
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    saving,
    error,
    saveProfile,
    uploadAvatar,
    updateField,
    refetch
  };
};