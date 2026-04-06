import type { Action } from 'svelte/action';

export const tilt: Action<HTMLElement, { max?: number; scale?: number; speed?: number; perspective?: number }> = (node, options = {}) => {
  const { max = 15, scale = 1.05, speed = 400, perspective = 1000 } = options;

  let width = node.offsetWidth;
  let height = node.offsetHeight;
  let left = 0;
  let top = 0;

  const updateRect = () => {
    const rect = node.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    left = rect.left;
    top = rect.top;
  };

  const handleMouseEnter = () => {
    updateRect();
    node.style.transition = `transform ${speed}ms cubic-bezier(.03,.98,.52,.99)`;
  };

  const handleMouseMove = (e: MouseEvent) => {
    const x = e.clientX - left;
    const y = e.clientY - top;

    const rotateX = max / 2 - (x / width) * max;
    const rotateY = (y / height) * max - max / 2;

    node.style.transform = `perspective(${perspective}px) rotateX(${rotateY}deg) rotateY(${rotateX}deg) scale3d(${scale}, ${scale}, ${scale})`;
  };

  const handleMouseLeave = () => {
    node.style.transition = `transform ${speed}ms cubic-bezier(.03,.98,.52,.99)`;
    node.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
  };

  // Necessary to wrap container in transform-style preserve-3d if we want proper 3d effects on children, 
  // but applying it directly to node should suffice for 3D card tilt.
  node.style.transformStyle = 'preserve-3d';
  node.style.willChange = 'transform';

  node.addEventListener('mouseenter', handleMouseEnter);
  node.addEventListener('mousemove', handleMouseMove);
  node.addEventListener('mouseleave', handleMouseLeave);
  window.addEventListener('resize', updateRect);
  window.addEventListener('scroll', updateRect);

  return {
    destroy() {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mousemove', handleMouseMove);
      node.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', updateRect);
      window.removeEventListener('scroll', updateRect);
    }
  };
};
