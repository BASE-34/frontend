export interface Project {
  id: string;
  title: string;
  title_ua: string;
  description: string;
  description_ua: string;
  full_description?: string;
  full_description_ua?: string;
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
  content?: string;
  content_ua?: string;
  category: 'project' | 'research' | 'workshop' | 'report' | 'event';
  date: string;
  image?: string;
  featured?: boolean;
  breaking?: boolean;
  log_id: string;
}

export interface Stats {
  active: number;
  hardware: number;
  workshops: number;
  members: number;
}

export interface ContactSubmission {
  name: string;
  email: string;
  subject: string;
  message: string;
  turnstileToken?: string;
}

export interface ApiResponse<T> {
  data: T;
  ok: boolean;
  error?: string;
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
