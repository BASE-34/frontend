import { describe, it, expect } from 'vitest';
import type { NewsItem, Project, Stats, ContactSubmission, ApiResponse } from '$lib/types';

describe('Type Definitions', () => {
  it('should validate a NewsItem structure', () => {
    const item: NewsItem = {
      id: 'test-article',
      title: 'Test Article',
      title_ua: 'Тестова стаття',
      excerpt: 'Short excerpt',
      excerpt_ua: 'Короткий витяг',
      category: 'project',
      date: '2024.10.12',
      log_id: '001-BS34',
    };

    expect(item.id).toBe('test-article');
    expect(item.category).toBe('project');
    expect(item.featured).toBeUndefined();
    expect(item.content).toBeUndefined();
  });

  it('should validate a NewsItem with full content', () => {
    const item: NewsItem = {
      id: 'full-article',
      title: 'Full Article',
      title_ua: 'Повна стаття',
      excerpt: 'Short excerpt',
      excerpt_ua: 'Короткий витяг',
      content: '## Full markdown content',
      content_ua: '## Повний markdown контент',
      category: 'research',
      date: '2024.09.01',
      image: 'https://example.com/img.jpg',
      featured: true,
      breaking: true,
      log_id: '887-RD34',
    };

    expect(item.content).toBe('## Full markdown content');
    expect(item.featured).toBe(true);
  });

  it('should validate a Project structure', () => {
    const project: Project = {
      id: 'test-project',
      title: 'Test Project',
      title_ua: 'Тестовий проект',
      description: 'Test description',
      description_ua: 'Тестовий опис',
      status: 'active',
      metric_label: 'Efficiency',
      metric_label_ua: 'Ефективність',
      metric_value: '94.2%',
      tags: ['Python', 'ML'],
      tags_ua: ['Python', 'ML'],
    };

    expect(project.status).toBe('active');
    expect(project.tags).toHaveLength(2);
    expect(project.full_description).toBeUndefined();
  });

  it('should validate a Project with full description', () => {
    const project: Project = {
      id: 'full-project',
      title: 'Full Project',
      title_ua: 'Повний проект',
      description: 'Short desc',
      description_ua: 'Короткий опис',
      full_description: '## Full project documentation',
      full_description_ua: '## Повна документація проекту',
      status: 'dev',
      metric_label: 'Latency',
      metric_label_ua: 'Затримка',
      metric_value: '0.4ms',
      icon: 'neurology',
      tags: ['FPGA', 'C++'],
      tags_ua: ['FPGA', 'C++'],
    };

    expect(project.full_description).toContain('Full project documentation');
    expect(project.icon).toBe('neurology');
  });

  it('should validate project status enum', () => {
    const statuses: Project['status'][] = ['active', 'dev', 'mock', 'completed'];
    expect(statuses).toHaveLength(4);
  });

  it('should validate a Stats structure', () => {
    const stats: Stats = {
      active: 15,
      hardware: 8,
      workshops: 34,
      members: 312,
    };

    expect(stats.active).toBe(15);
    expect(stats.members).toBe(312);
  });

  it('should validate a ContactSubmission structure', () => {
    const submission: ContactSubmission = {
      name: 'John Doe',
      email: 'john@knu.ua',
      subject: 'Membership',
      message: 'I want to join',
    };

    expect(submission.name).toBe('John Doe');
    expect(submission.turnstileToken).toBeUndefined();
  });

  it('should validate news categories', () => {
    const categories: NewsItem['category'][] = ['project', 'research', 'workshop', 'report', 'event'];
    expect(categories).toHaveLength(5);
  });
});
