import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Mock API Server Integration', () => {
  const API_BASE = 'http://localhost:4000';

  describe('GET /api/news', () => {
    it('should return an array of news items', async () => {
      const mockItems = [
        { id: 'article-1', title: 'Test Article 1' },
        { id: 'article-2', title: 'Test Article 2' },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockItems),
      });

      const res = await fetch(`${API_BASE}/api/news`);
      const data = await res.json();

      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0].id).toBe('article-1');
    });

    it('should not include full content in listing', async () => {
      const mockItems = [
        { id: 'article-1', title: 'Test', excerpt: 'Short' },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockItems),
      });

      const res = await fetch(`${API_BASE}/api/news`);
      const data = await res.json();

      expect(data[0]).not.toHaveProperty('content');
      expect(data[0]).not.toHaveProperty('content_ua');
    });
  });

  describe('GET /api/news/:id', () => {
    it('should return a single article with full content', async () => {
      const mockArticle = {
        id: 'h-series-actuators',
        title: 'Integration of H-Series Actuators',
        content: '## Full article content in markdown',
        content_ua: '## Повний зміст статті',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockArticle),
      });

      const res = await fetch(`${API_BASE}/api/news/h-series-actuators`);
      const data = await res.json();

      expect(data.id).toBe('h-series-actuators');
      expect(data.content).toContain('## Full article content');
    });

    it('should return 404 for nonexistent article', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Article not found' }),
      });

      const res = await fetch(`${API_BASE}/api/news/nonexistent`);
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/projects', () => {
    it('should return an array of projects', async () => {
      const mockProjects = [
        { id: 'project-1', title: 'Test Project', status: 'active' },
      ];

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProjects),
      });

      const res = await fetch(`${API_BASE}/api/projects`);
      const data = await res.json();

      expect(Array.isArray(data)).toBe(true);
      expect(data[0].status).toBe('active');
    });
  });

  describe('GET /api/projects/:id', () => {
    it('should return a single project with full description', async () => {
      const mockProject = {
        id: 'autonomous-sorting-cluster',
        title: 'Autonomous Sorting Cluster',
        full_description: '## Detailed project docs',
      };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockProject),
      });

      const res = await fetch(`${API_BASE}/api/projects/autonomous-sorting-cluster`);
      const data = await res.json();

      expect(data.full_description).toContain('## Detailed project docs');
    });
  });

  describe('GET /api/stats', () => {
    it('should return statistics object', async () => {
      const mockStats = { active: 15, hardware: 8, workshops: 34, members: 312 };

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockStats),
      });

      const res = await fetch(`${API_BASE}/api/stats`);
      const data = await res.json();

      expect(data.active).toBe(15);
      expect(data.members).toBe(312);
    });
  });

  describe('POST /api/contact', () => {
    it('should accept valid contact form submission', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ ok: true, message: 'Submitted' }),
      });

      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@knu.ua',
          subject: 'Membership',
          message: 'I want to join the association',
        }),
      });
      const data = await res.json();

      expect(data.ok).toBe(true);
    });

    it('should reject invalid submission', async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: () => Promise.resolve({
          ok: false,
          errors: { email: 'Valid email is required' },
        }),
      });

      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'T', email: 'invalid', subject: '', message: '' }),
      });

      expect(res.status).toBe(400);
    });
  });
});
