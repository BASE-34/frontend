import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = parseInt(process.env.MOCK_PORT ?? '4000', 10);

// Middleware
app.use(cors());
app.use(express.json());

// Load data
function loadJson<T>(filename: string): T {
  const filepath = join(__dirname, 'data', filename);
  return JSON.parse(readFileSync(filepath, 'utf-8')) as T;
}

interface NewsItem {
  id: string;
  [key: string]: unknown;
}

interface ProjectItem {
  id: string;
  [key: string]: unknown;
}

interface Stats {
  active: number;
  hardware: number;
  workshops: number;
  members: number;
}

const news: NewsItem[] = loadJson('news.json');
const projects: ProjectItem[] = loadJson('projects.json');
const stats: Stats = loadJson('stats.json');

// ─── Routes ──────────────────────────────────────────────

// GET /api/news — list all news
app.get('/api/news', (_req, res) => {
  // Return items without full content for listing
  const items = news.map(({ content, content_ua, ...rest }) => rest);
  res.json(items);
});

// GET /api/news/:id — single news article with full content
app.get('/api/news/:id', (req, res) => {
  const item = news.find((n) => n.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Article not found' });
    return;
  }
  res.json(item);
});

// GET /api/projects — list all projects
app.get('/api/projects', (_req, res) => {
  // Return items without full descriptions for listing
  const items = projects.map(({ full_description, full_description_ua, ...rest }) => rest);
  res.json(items);
});

// GET /api/projects/:id — single project with full description
app.get('/api/projects/:id', (req, res) => {
  const item = projects.find((p) => p.id === req.params.id);
  if (!item) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(item);
});

// GET /api/stats — site statistics
app.get('/api/stats', (_req, res) => {
  res.json(stats);
});

// POST /api/contact — contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  const errors: Record<string, string> = {};
  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.name = 'Name is required (min 2 characters)';
  }
  if (!email || typeof email !== 'string' || !email.includes('@')) {
    errors.email = 'Valid email is required';
  }
  if (!subject || typeof subject !== 'string' || subject.trim().length < 2) {
    errors.subject = 'Subject is required';
  }
  if (!message || typeof message !== 'string' || message.trim().length < 10) {
    errors.message = 'Message is required (min 10 characters)';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json({ ok: false, errors });
    return;
  }

  // Mock: log and return success
  console.log(`[CONTACT] From: ${name} <${email}> | Subject: ${subject}`);
  console.log(`[CONTACT] Message: ${message.substring(0, 100)}...`);

  res.json({
    ok: true,
    message: 'Contact form submitted successfully',
    ref: `MSG-${Date.now().toString(36).toUpperCase()}`,
  });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'base34-mock-api', timestamp: new Date().toISOString() });
});

// ─── Start ───────────────────────────────────────────────

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`\n  ┌─────────────────────────────────────────┐`);
  console.log(`  │  B.A.S.E.34 Mock API Server              │`);
  console.log(`  │  Running on http://localhost:${PORT}       │`);
  console.log(`  │  Endpoints:                               │`);
  console.log(`  │    GET  /api/news                         │`);
  console.log(`  │    GET  /api/news/:id                     │`);
  console.log(`  │    GET  /api/projects                     │`);
  console.log(`  │    GET  /api/projects/:id                 │`);
  console.log(`  │    GET  /api/stats                        │`);
  console.log(`  │    POST /api/contact                      │`);
  console.log(`  │    GET  /api/health                       │`);
  console.log(`  └─────────────────────────────────────────┘\n`);
});

