import {
  Lightbulb,
  Compass,
  Heart,
  Mountain,
  Star,
  Rocket,
  Brain,
  Clock,
  Target,
  Sparkles,
  TreePine,
  Book,
  Flame,
  Puzzle,
  Smile,
  type LucideIcon
} from 'lucide-react';

interface CategoryIcon {
  icon: LucideIcon;
  className: string;
}

const categoryIcons: Record<string, CategoryIcon> = {
  wisdom: { icon: Lightbulb, className: 'text-amber-500' },
  journey: { icon: Compass, className: 'text-blue-500' },
  love: { icon: Heart, className: 'text-red-500' },
  growth: { icon: Mountain, className: 'text-emerald-500' },
  dreams: { icon: Star, className: 'text-purple-500' },
  innovation: { icon: Rocket, className: 'text-cyan-500' },
  reflection: { icon: Brain, className: 'text-indigo-500' },
  time: { icon: Clock, className: 'text-orange-500' },
  purpose: { icon: Target, className: 'text-rose-500' },
  inspiration: { icon: Sparkles, className: 'text-amber-500' },
  life: { icon: TreePine, className: 'text-green-500' },
  knowledge: { icon: Book, className: 'text-blue-600' },
  passion: { icon: Flame, className: 'text-orange-500' },
  understanding: { icon: Puzzle, className: 'text-purple-600' },
  happiness: { icon: Smile, className: 'text-yellow-500' }
};

export function getCategoryIcon(category: string): CategoryIcon {
  // Remove "On " prefix if it exists and convert to lowercase
  const normalizedCategory = category.replace(/^on\s+/i, '').toLowerCase();
  return categoryIcons[normalizedCategory] || { icon: Lightbulb, className: 'text-gray-500' };
}

export function formatCategory(category: string): string {
  return category.replace(/^on\s+/i, '');
}