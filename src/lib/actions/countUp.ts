import type { Action } from 'svelte/action';

interface CountUpOptions {
  target: number;
  duration?: number;
  delay?: number;
  suffix?: string;
  updateWidth?: boolean; // If true, also updates width property
}

const easeOutExpo = (t: number): number => {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
};

export const countUp: Action<HTMLElement, CountUpOptions> = (node, options) => {
  const { target, duration = 1500, delay = 0, suffix = '', updateWidth = false } = options;
  let startTime: number | null = null;
  let animationFrame: number;
  let hasRun = false;

  const animate = (timestamp: number) => {
    if (!startTime) startTime = timestamp;
    const progress = timestamp - startTime;
    const timeRatio = Math.min(progress / duration, 1);
    const easeRatio = easeOutExpo(timeRatio);
    
    const currentValue = Math.floor(easeRatio * target);
    
    // Update text
    node.innerText = `${currentValue}${suffix}`;
    
    // Attempt to find a sibling or self that acts as a progress bar if this node is the text,
    // or if the node is the bar, update itself. 
    // Actually, handling both text and width in one action can be tricky if they are different nodes.
    if (updateWidth) {
      node.style.width = `${easeRatio * target}%`;
    }

    if (progress < duration) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      node.innerText = `${target}${suffix}`;
      if (updateWidth) {
        node.style.width = `${target}%`;
      }
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !hasRun) {
          hasRun = true;
          setTimeout(() => {
            animationFrame = requestAnimationFrame(animate);
          }, delay);
          observer.unobserve(node);
        }
      });
    },
    { threshold: 0.1 }
  );

  observer.observe(node);

  return {
    destroy() {
      observer.unobserve(node);
      if (animationFrame) cancelAnimationFrame(animationFrame);
    },
  };
};
