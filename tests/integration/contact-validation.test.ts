import { describe, it, expect } from 'vitest';

describe('Contact Form Validation', () => {
  const validate = (data: Record<string, string>) => {
    const errors: Record<string, string> = {};

    if (!data.name || data.name.trim().length < 2) {
      errors.name = 'Name is required (min 2 characters)';
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.email = 'Valid email is required';
    }
    if (!data.subject || data.subject.trim().length < 2) {
      errors.subject = 'Subject is required';
    }
    if (!data.message || data.message.trim().length < 10) {
      errors.message = 'Message must be at least 10 characters';
    }

    return errors;
  };

  it('should pass with valid data', () => {
    const errors = validate({
      name: 'John Doe',
      email: 'john@knu.ua',
      subject: 'Membership',
      message: 'I would like to join the association',
    });
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it('should require name with min 2 characters', () => {
    const errors = validate({ name: 'J', email: 'j@knu.ua', subject: 'Test', message: 'This is a test message' });
    expect(errors.name).toBeDefined();
  });

  it('should reject empty name', () => {
    const errors = validate({ name: '', email: 'j@knu.ua', subject: 'Test', message: 'This is a test message' });
    expect(errors.name).toBeDefined();
  });

  it('should require valid email format', () => {
    const errors = validate({ name: 'John', email: 'invalid', subject: 'Test', message: 'This is a test message' });
    expect(errors.email).toBeDefined();
  });

  it('should reject email without @', () => {
    const errors = validate({ name: 'John', email: 'john.knu.ua', subject: 'Test', message: 'This is a test message' });
    expect(errors.email).toBeDefined();
  });

  it('should accept valid email formats', () => {
    const validEmails = ['user@knu.ua', 'test.user@gmail.com', 'a@b.co'];
    validEmails.forEach((email) => {
      const errors = validate({ name: 'John', email, subject: 'Test', message: 'This is a test message' });
      expect(errors.email).toBeUndefined();
    });
  });

  it('should require subject with min 2 characters', () => {
    const errors = validate({ name: 'John', email: 'j@knu.ua', subject: 'T', message: 'This is a test message' });
    expect(errors.subject).toBeDefined();
  });

  it('should require message with min 10 characters', () => {
    const errors = validate({ name: 'John', email: 'j@knu.ua', subject: 'Test', message: 'Short' });
    expect(errors.message).toBeDefined();
  });

  it('should collect multiple errors simultaneously', () => {
    const errors = validate({ name: '', email: '', subject: '', message: '' });
    expect(Object.keys(errors)).toHaveLength(4);
  });
});
