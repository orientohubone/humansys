import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  position?: string;
  company_name?: string;
  company_cnpj?: string;
  avatar_url?: string;
  phone?: string;
  department?: string;
  bio?: string;
  role?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
}

interface UpdateUserData {
  full_name?: string;
  position?: string;
  company_name?: string;
  company_cnpj?: string;
  phone?: string;
  department?: string;
  bio?: string;
  avatar_url?: string;
}

function normalizeProfileResponse(result: any, fallbackId: string): UserProfile {
  const data = result?.data ?? result;

  return {
    id: data?.id || fallbackId,
    email: data?.email || '',
    full_name: data?.full_name || '',
    position: data?.position || '',
    company_name: data?.company_name || '',
    company_cnpj: data?.company_cnpj || '',
    avatar_url: data?.avatar_url || '',
    phone: data?.phone || '',
    department: data?.department || '',
    bio: data?.bio || '',
    role: data?.role || '',
    status: data?.status || '',
    created_at: data?.created_at,
    updated_at: data?.updated_at,
  };
}

export function useUserProfile(userId: string) {
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);

  // Query para buscar dados do usuário
  const {
    data: user,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      console.log('🔍 Fetching user profile for:', userId);
      
      const response = await fetch(`/api/profile/${userId}`);
      const result = await response.json();

      if (!response.ok) {
        if (response.status === 404) {
          console.warn('⚠️ User profile not found, returning empty profile');
          return normalizeProfileResponse({ id: userId }, userId);
        }

        throw new Error(result?.error || `Failed to fetch user: ${response.status}`);
      }

      const profile = normalizeProfileResponse(result, userId);
      console.log('✅ User profile fetched:', profile);
      return profile;
    },
    enabled: !!userId,
  });

  // Mutation para atualizar dados do usuário
  const updateUserMutation = useMutation({
    mutationFn: async (data: UpdateUserData) => {
      console.log('📝 Updating user profile:', data);
      
      const response = await fetch(`/api/profile/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || `Failed to update user: ${response.status}`);
      }

      return normalizeProfileResponse(result, userId);
    },
    onSuccess: (updatedUser) => {
      console.log('✅ User profile updated:', updatedUser);
      
      // Atualizar contexto de autenticação também
      if (window.dispatchEvent) {
        window.dispatchEvent(new CustomEvent('userProfileUpdated', {
          detail: updatedUser
        }));
      }
      
      // Invalidar cache para recarregar dados
      queryClient.invalidateQueries({ queryKey: ['user', userId] });
      
      // Atualizar cache imediatamente
      queryClient.setQueryData(['user', userId], updatedUser);
    },
    onError: (error) => {
      console.error('❌ Error updating user profile:', error);
    },
  });

  // Upload de avatar
  const uploadAvatar = useCallback(async (file: File) => {
    try {
      setIsUploading(true);
      console.log('📸 Uploading avatar:', file.name);
      
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || `Failed to upload avatar: ${response.status}`);
      }

      const avatarUrl = result?.avatar_url || result?.data?.avatar_url;

      if (avatarUrl) {
        console.log('✅ Avatar uploaded:', avatarUrl);
        
        // Atualizar cache com nova URL do avatar
        queryClient.setQueryData(['user', userId], (oldData: UserProfile | undefined) => {
          if (oldData) {
            return { ...oldData, avatar_url: avatarUrl };
          }
          return oldData;
        });
        
        // Invalidar cache para garantir sincronização
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
        
        return avatarUrl;
      }

      throw new Error(result?.error || 'Failed to upload avatar');
    } catch (error) {
      console.error('❌ Error uploading avatar:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [userId, queryClient]);

  return {
    user,
    isLoading,
    error,
    refetch,
    updateUser: updateUserMutation.mutate,
    isUpdating: updateUserMutation.isPending,
    updateError: updateUserMutation.error,
    uploadAvatar,
    isUploading,
  };
}
