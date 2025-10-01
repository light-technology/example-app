export interface Service {
  name: string;
  status: string;
  lastService: string;
  nextService: string;
  efficiency: string;
}

export interface UpcomingService {
  date: string;
  service: string;
  type: string;
  time: string;
}

export interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  current: boolean;
}

export interface QuickAction {
  id: number;
  name: string;
  href: string;
  initial: string;
  current: boolean;
  emergency?: boolean;
}
