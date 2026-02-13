
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import type { Collaborator } from '@/types/collaborators';

export const useCollaboratorStats = () => {
  const calculateStats = useCallback((collaborators: Collaborator[]) => {
    const active = collaborators.filter(c => c.status === 'active').length;
    const inactive = collaborators.filter(c => c.status === 'inactive').length;
    const vacation = collaborators.filter(c => c.status === 'vacation').length;
    const departments = new Set(collaborators.map(c => c.department)).size;

    return {
      total: collaborators.length,
      active,
      inactive,
      vacation,
      departments
    };
  }, []);

  return { calculateStats };
};
