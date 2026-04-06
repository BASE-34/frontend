import type { Action } from 'svelte/action';

export const typewriter: Action<HTMLElement, { text: string; speed?: number; delay?: number; cursor?: boolean }> = (node, options) => {
  let { text, speed = 50, delay = 0, cursor = true } = typeof options === 'string' ? { text: options } : options;
  
  let currentText = '';
  let index = 0;
  let timeoutId: number;
  let delayId: number;

  const type = () => {
    if (index <= text.length) {
      currentText = text.slice(0, index);
      let suffix = '';
      if (cursor) {
        suffix = index < text.length ? '<span class="animate-pulse">_</span>' : '<span class="animate-cursor-blink">_</span>';
      }
      node.innerHTML = `${currentText}${suffix}`;
      index++;
      timeoutId = setTimeout(type, speed) as unknown as number;
    }
  };

  delayId = setTimeout(() => {
    type();
  }, delay) as unknown as number;

  return {
    update(newOptions) {
      const next = typeof newOptions === 'string' ? { text: newOptions } : newOptions;
      if (next.text !== text) {
        clearTimeout(timeoutId);
        clearTimeout(delayId);
        text = next.text;
        speed = next.speed || 50;
        delay = next.delay || 0;
        cursor = next.cursor !== undefined ? next.cursor : true;
        index = 0;
        type();
      }
    },
    destroy() {
      clearTimeout(timeoutId);
      clearTimeout(delayId);
    }
  };
};
