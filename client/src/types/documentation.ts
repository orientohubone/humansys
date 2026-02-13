
import { LucideIcon } from 'lucide-react';

export interface DocumentationSection {
  title: string;
  description: string;
  icon?: LucideIcon;
  items?: string[];
}

export interface DocumentationItem {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryLabel: string;
  icon: LucideIcon;
  content: DocumentationSection[];
  downloadUrl?: string;
  externalUrl?: string;
  estimatedReadTime: number;
  viewCount?: number;
  lastUpdated: string;
}
