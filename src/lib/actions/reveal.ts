import type { Action } from 'svelte/action';

interface RevealOptions {
  delay?: number;
  threshold?: number;
  once?: boolean;
}

export const reveal: Action<HTMLElement, RevealOptions | undefined> = (node, options = {}) => {
  const { delay = 0, threshold = 0.1, once = true } = options;

  node.style.opacity = '0';
  node.style.transform = 'translateY(24px)';
  node.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'translateY(0)';
          if (once) observer.unobserve(node);
        } else if (!once) {
          node.style.opacity = '0';
          node.style.transform = 'translateY(24px)';
        }
      });
    },
    { threshold }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.unobserve(node);
    },
  };
};

export const revealLeft: Action<HTMLElement, RevealOptions | undefined> = (node, options = {}) => {
  const { delay = 0, threshold = 0.1, once = true } = options;

  node.style.opacity = '0';
  node.style.transform = 'translateX(-30px)';
  node.style.transition = `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          node.style.opacity = '1';
          node.style.transform = 'translateX(0)';
          if (once) observer.unobserve(node);
        }
      });
    },
    { threshold }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.unobserve(node);
    },
  };
};
