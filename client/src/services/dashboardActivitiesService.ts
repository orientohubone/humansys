export const getDashboardActivities = async (userId?: string) => {
  try {
    // For now, return empty array since we don't have a working database
    const activities: any[] = [];
    return activities;
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

export const fetchRecentActivities = async (userId?: string) => {
  try {
    // For now, return empty array since we don't have a working database
    const activities: any[] = [];
    return activities;
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return [];
  }
};

export const logActivity = async (
  type: string,
  description: string,
  entityType: string = '',
  entityId: string = '',
  userId: string = ''
) => {
  try {
    return [{
      id: `activity_${Date.now()}`,
      type,
      description,
      entity_type: entityType,
      entity_id: entityId,
      user_id: userId,
      created_at: new Date().toISOString()
    }];
  } catch (error) {
    console.error('Error logging activity:', error);
    return [];
  }
};