import React from 'react';
import { 
  Droplets, 
  Book, 
  Dumbbell, 
  Brain, 
  Moon, 
  Check, 
  LayoutDashboard, 
  CalendarDays, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Plus, 
  Bell, 
  LogOut, 
  HelpCircle,
  Flame,
  ChevronRight,
  Search,
  Share2,
  Trophy,
  Info,
  CheckCircle2,
  CloudUpload,
  Download,
  User,
  ShieldCheck,
  Smartphone,
  Type,
  MoonStar,
  ListTodo,
  Star,
  Circle,
  Hexagon,
  Diamond,
  Medal,
  Crown,
  Clock,
  Shield,
  Scale
} from 'lucide-react';

const icons = {
  Droplets,
  Book,
  Dumbbell,
  Brain,
  Moon,
  Check,
  LayoutDashboard,
  CalendarDays,
  BookOpen,
  BarChart3,
  Settings,
  Plus,
  Bell,
  LogOut,
  HelpCircle,
  Flame,
  ChevronRight,
  Search,
  Share2,
  Trophy,
  Info,
  CheckCircle2,
  CloudUpload,
  Download,
  User,
  ShieldCheck,
  Smartphone,
  Type,
  MoonStar,
  ListTodo,
  Star,
  Circle,
  Hexagon,
  Diamond,
  Medal,
  Crown,
  Clock,
  Shield,
  Scale
};

export type IconName = keyof typeof icons;

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, className, strokeWidth = 2 }: IconProps) {
  const LucideIcon = icons[name];
  if (!LucideIcon) return null;
  return <LucideIcon size={size} className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
