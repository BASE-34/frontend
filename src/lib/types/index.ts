export interface Project {
  id: string;
  title: string;
  title_ua: string;
  description: string;
  description_ua: string;
  status: 'active' | 'dev' | 'mock' | 'completed';
  metric_label: string;
  metric_label_ua: string;
  metric_value: string;
  image?: string;
  icon?: string;
  tags: string[];
  tags_ua: string[];
  docs_url?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  title_ua: string;
  excerpt: string;
  excerpt_ua: string;
  category: 'project' | 'research' | 'workshop' | 'report' | 'event';
  date: string;
  image?: string;
  featured?: boolean;
  breaking?: boolean;
  log_id: string;
}

export interface FaqItem {
  q: string;
  q_ua: string;
  a: string;
  a_ua: string;
}

export interface FaqSection {
  id: string;
  title: string;
  title_ua: string;
  faqs: FaqItem[];
}
