import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  role?: string;
  department?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  preferences?: {
    notifications: boolean;
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
}

interface UpdateProfileData {
  full_name?: string;
  department?: string;
  phone?: string;
  bio?: string;
  skills?: string[];
  preferences?: {
    notifications?: boolean;
    theme?: 'light' | 'dark' | 'system';
    language?: string;
  };
}

// API Functions for Profile Management
const fetchProfile = async (userId: string): Promise<UserProfile> => {
  const response = await fetch(`/api/users/${userId}/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch profile: ${response.statusText}`);
  }

  return response.json();
};

const updateProfileAPI = async (userId: string, data: UpdateProfileData): Promise<UserProfile> => {
  const response = await fetch(`/api/users/${userId}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to update profile: ${response.statusText}`);
  }

  return response.json();
};

const uploadAvatar = async (userId: string, file: File): Promise<{ avatar_url: string }> => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await fetch(`/api/users/${userId}/avatar`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload avatar: ${response.statusText}`);
  }

  return response.json();
};

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Query para buscar dados do perfil
  const {
    data: profile,
    isLoading: loading,
    error,
    refetch
  } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutos
    cacheTime: 10 * 60 * 1000, // 10 minutos
  });

  // Mutation para atualizar perfil
  const updateProfileMutation = useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfileAPI(user!.id, data),
    onSuccess: (updatedProfile) => {
      // Atualizar cache do React Query
      queryClient.setQueryData(['profile', user!.id], updatedProfile);

      toast({
        title: "Perfil atualizado",
        description: "Suas informações foram salvas com sucesso."
      });
    },
    onError: (error: Error) => {
      console.error('Profile update error:', error);
      toast({
        title: "Erro ao atualizar perfil",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  });

  // Mutation para upload de avatar
  const uploadAvatarMutation = useMutation({
    mutationFn: (file: File) => uploadAvatar(user!.id, file),
    onSuccess: (result) => {
      // Atualizar apenas o avatar_url no cache
      queryClient.setQueryData(['profile', user!.id], (old: UserProfile | undefined) => 
        old ? { ...old, avatar_url: result.avatar_url } : old
      );

      toast({
        title: "Avatar atualizado",
        description: "Sua foto de perfil foi alterada com sucesso."
      });
    },
    onError: (error: Error) => {
      console.error('Avatar upload error:', error);
      toast({
        title: "Erro ao atualizar avatar",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  });

  // Wrapper functions para facilitar uso nos componentes
  const updateProfile = async (data: UpdateProfileData): Promise<boolean> => {
    try {
      await updateProfileMutation.mutateAsync(data);
      return true;
    } catch (error) {
      return false;
    }
  };

  const uploadProfileAvatar = async (file: File): Promise<boolean> => {
    try {
      await uploadAvatarMutation.mutateAsync(file);
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    profile,
    loading: loading || updateProfileMutation.isPending || uploadAvatarMutation.isPending,
    error,
    updateProfile,
    uploadProfileAvatar,
    refetch,
    // Estados das mutations para UI feedback
    isUpdating: updateProfileMutation.isPending,
    isUploadingAvatar: uploadAvatarMutation.isPending,
  };
};