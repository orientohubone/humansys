
// 🔧 Profile API Service - Centralized API calls
interface ProfileApiResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class ProfileService {
  private baseUrl = '/api/profiles';

  async getProfile(userId: string): Promise<ProfileApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
      
    } catch (error: any) {
      console.error('ProfileService.getProfile error:', error);
      return { success: false, error: error.message };
    }
  }

  async updateProfile(userId: string, profileData: any): Promise<ProfileApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
      
    } catch (error: any) {
      console.error('ProfileService.updateProfile error:', error);
      return { success: false, error: error.message };
    }
  }

  async uploadAvatar(userId: string, file: File): Promise<ProfileApiResponse> {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      formData.append('userId', userId);

      const response = await fetch(`${this.baseUrl}/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userId}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return { success: true, data };
      
    } catch (error: any) {
      console.error('ProfileService.uploadAvatar error:', error);
      return { success: false, error: error.message };
    }
  }

  async deleteProfile(userId: string): Promise<ProfileApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userId}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return { success: true };
      
    } catch (error: any) {
      console.error('ProfileService.deleteProfile error:', error);
      return { success: false, error: error.message };
    }
  }
}

export const profileService = new ProfileService();
