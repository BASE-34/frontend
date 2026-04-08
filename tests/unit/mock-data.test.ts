import { describe, it, expect } from 'vitest';

/**
 * Tests to verify mock data integrity — ensures the JSON files
 * in mock-server/data/ match expected structures.
 */
describe('Mock Data Integrity', () => {
  describe('news.json', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const news = require('../../mock-server/data/news.json');

    it('should be a non-empty array', () => {
      expect(Array.isArray(news)).toBe(true);
      expect(news.length).toBeGreaterThan(0);
    });

    it('should have all required fields on each item', () => {
      const required = ['id', 'title', 'title_ua', 'excerpt', 'excerpt_ua', 'category', 'date', 'log_id'];
      news.forEach((item: any) => {
        required.forEach((field) => {
          expect(item).toHaveProperty(field);
          expect(typeof item[field]).toBe('string');
        });
      });
    });

    it('should have unique IDs', () => {
      const ids = news.map((n: any) => n.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should have valid categories', () => {
      const validCategories = ['project', 'research', 'workshop', 'report', 'event'];
      news.forEach((item: any) => {
        expect(validCategories).toContain(item.category);
      });
    });

    it('should have exactly one featured article', () => {
      const featured = news.filter((n: any) => n.featured);
      expect(featured.length).toBe(1);
    });

    it('should have markdown content on all articles', () => {
      news.forEach((item: any) => {
        expect(item).toHaveProperty('content');
        expect(item).toHaveProperty('content_ua');
        expect(item.content.length).toBeGreaterThan(100);
        expect(item.content_ua.length).toBeGreaterThan(100);
      });
    });
  });

  describe('projects.json', () => {
    const projects = require('../../mock-server/data/projects.json');

    it('should be a non-empty array', () => {
      expect(Array.isArray(projects)).toBe(true);
      expect(projects.length).toBeGreaterThan(0);
    });

    it('should have all required fields', () => {
      const required = ['id', 'title', 'title_ua', 'description', 'description_ua', 'status', 'metric_label', 'metric_value', 'tags', 'tags_ua'];
      projects.forEach((item: any) => {
        required.forEach((field) => {
          expect(item).toHaveProperty(field);
        });
      });
    });

    it('should have unique IDs', () => {
      const ids = projects.map((p: any) => p.id);
      expect(new Set(ids).size).toBe(ids.length);
    });

    it('should have valid statuses', () => {
      const validStatuses = ['active', 'dev', 'mock', 'completed'];
      projects.forEach((item: any) => {
        expect(validStatuses).toContain(item.status);
      });
    });

    it('should have tags as arrays', () => {
      projects.forEach((item: any) => {
        expect(Array.isArray(item.tags)).toBe(true);
        expect(Array.isArray(item.tags_ua)).toBe(true);
        expect(item.tags.length).toBeGreaterThan(0);
      });
    });

    it('should have full descriptions on all projects', () => {
      projects.forEach((item: any) => {
        expect(item).toHaveProperty('full_description');
        expect(item).toHaveProperty('full_description_ua');
        expect(item.full_description.length).toBeGreaterThan(100);
      });
    });
  });

  describe('stats.json', () => {
    const stats = require('../../mock-server/data/stats.json');

    it('should have all required stat fields', () => {
      expect(stats).toHaveProperty('active');
      expect(stats).toHaveProperty('hardware');
      expect(stats).toHaveProperty('workshops');
      expect(stats).toHaveProperty('members');
    });

    it('should have positive numbers', () => {
      expect(stats.active).toBeGreaterThan(0);
      expect(stats.hardware).toBeGreaterThan(0);
      expect(stats.workshops).toBeGreaterThan(0);
      expect(stats.members).toBeGreaterThan(0);
    });
  });
});
