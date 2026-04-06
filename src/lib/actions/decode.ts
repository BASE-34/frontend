import type { Action } from 'svelte/action';

export const decode: Action<HTMLElement, { targetText: string; duration?: number; chars?: string; } | string> = (node, options) => {
  const targetText = typeof options === 'string' ? options : options.targetText;
  const duration = typeof options === 'string' ? 1000 : (options.duration || 1000);
  const chars = typeof options === 'string' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*' : (options.chars || 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*');
  
  let frameId: number;
  let hasRun = false;

  const startDecode = () => {
    node.dataset.decodedTarget = targetText;
    let iteration = 0;
    const maxIterations = targetText.length * Math.max(1, duration / 800);

    const animate = () => {
      node.innerText = targetText
        .split('')
        .map((letter, index) => {
          if (index < iteration) {
            return targetText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= targetText.length) {
        cancelAnimationFrame(frameId);
      } else {
        iteration += targetText.length / (duration / (1000/60)); // Advance iterations based on duration
        frameId = requestAnimationFrame(animate);
      }
    };
    
    frameId = requestAnimationFrame(animate);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasRun) {
        hasRun = true;
        startDecode();
        observer.unobserve(node);
      }
    });
  }, { threshold: 0.1 });

  observer.observe(node);

  return {
    update(newOptions: { targetText: string; duration?: number; chars?: string; } | string) {
      const newTargetText = typeof newOptions === 'string' ? newOptions : newOptions.targetText;
      if (newTargetText !== node.dataset.decodedTarget) {
        node.dataset.decodedTarget = newTargetText;
        startDecode();
      }
    },
    destroy() {
      if (frameId) cancelAnimationFrame(frameId);
      observer.disconnect();
    }
  };
};
