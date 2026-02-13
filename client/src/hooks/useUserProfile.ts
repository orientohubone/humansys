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
      
      const response = await fetch(`/api/users/${userId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch user: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ User profile fetched:', result.data);
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to fetch user');
      }
    },
    enabled: !!userId,
  });

  // Mutation para atualizar dados do usuário
  const updateUserMutation = useMutation({
    mutationFn: async (data: UpdateUserData) => {
      console.log('📝 Updating user profile:', data);
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to update user');
      }
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
      
      const response = await fetch(`/api/users/${userId}/avatar`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Failed to upload avatar: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Avatar uploaded:', result.data.avatar_url);
        
        // Atualizar cache com nova URL do avatar
        queryClient.setQueryData(['user', userId], (oldData: UserProfile | undefined) => {
          if (oldData) {
            return { ...oldData, avatar_url: result.data.avatar_url };
          }
          return oldData;
        });
        
        // Invalidar cache para garantir sincronização
        queryClient.invalidateQueries({ queryKey: ['user', userId] });
        
        return result.data.avatar_url;
      } else {
        throw new Error(result.error || 'Failed to upload avatar');
      }
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