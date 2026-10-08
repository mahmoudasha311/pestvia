import type { IconName } from '@/shared/ui/icons';
export interface ServiceCardContent {
  id: string;
  title: string;
  description: string;
  points: readonly string[];
  linkLabel: string;
  icon: IconName;
  variant: 'default' | 'featured' | 'brand';
  badge?: string;
}
