<script lang="ts">
  import { onMount } from 'svelte';
  import { decode } from '$lib/actions/decode';

  type Sticker = {
    id: string;
    val: string;
    face: number; // 0=F, 1=B, 2=L, 3=R, 4=U, 5=D
    r: number;
    c: number;
  };

  let cube = $state<Sticker[][][]>([]);
  let currentMove = $state<{ axis: 'x'|'y'|'z'; slice: number; angle: number; active: boolean }>({
    axis: 'y', slice: 0, angle: 0, active: false
  });

  let containerRef: HTMLDivElement;
  let containerWidth = $state(192);
  let mouseTiltX = $state(0);
  let mouseTiltY = $state(0);
  let autoRotateY = $state(0);
  let autoRotateX = $state(0);

  function initCube() {
    cube = Array.from({ length: 6 }, (_, f) => 
      Array.from({ length: 4 }, (_, r) => 
        Array.from({ length: 4 }, (_, c) => ({
          id: `s-${f}-${r}-${c}`,
          val: String(Math.floor(Math.random() * 90) + 10),
          face: f, r, c
        }))
      )
    );
  }

  function rotateMatrix(matrix: any[][], clockwise: boolean) {
    const n = 4;
    const res = Array.from({ length: 4 }, () => Array(4).fill(null));
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        if (clockwise) res[c][n - 1 - r] = matrix[r][c];
        else res[n - 1 - c][r] = matrix[r][c];
      }
    }
    return res;
  }

  async function performMove(axis: 'x'|'y'|'z', slice: number, clockwise: boolean) {
    if (currentMove.active) return;
    currentMove = { axis, slice, angle: clockwise ? 90 : -90, active: true };
    await new Promise(r => setTimeout(r, 600));

    const newCube = JSON.parse(JSON.stringify(cube));
    if (axis === 'y') {
      if (slice === 0) newCube[4] = rotateMatrix(newCube[4], clockwise);
      if (slice === 3) newCube[5] = rotateMatrix(newCube[5], !clockwise);
      const r = slice;
      const temp = [...newCube[0][r]];
      if (clockwise) {
        newCube[0][r] = [...newCube[3][r]]; newCube[3][r] = [...newCube[1][r]];
        newCube[1][r] = [...newCube[2][r]]; newCube[2][r] = temp;
      } else {
        newCube[0][r] = [...newCube[2][r]]; newCube[2][r] = [...newCube[1][r]];
        newCube[1][r] = [...newCube[3][r]]; newCube[3][r] = temp;
      }
    } else if (axis === 'x') {
      if (slice === 3) newCube[3] = rotateMatrix(newCube[3], clockwise);
      if (slice === 0) newCube[2] = rotateMatrix(newCube[2], !clockwise);
      const c = slice;
      const getCol = (f: number, col: number) => [newCube[f][0][col], newCube[f][1][col], newCube[f][2][col], newCube[f][3][col]];
      const setCol = (f: number, col: number, v: any[]) => { newCube[f][0][col]=v[0]; newCube[f][1][col]=v[1]; newCube[f][2][col]=v[2]; newCube[f][3][col]=v[3]; };
      const f_col = getCol(0, c);
      if (clockwise) {
        setCol(0, c, getCol(5, c)); setCol(5, c, getCol(1, 3-c).reverse());
        setCol(1, 3-c, getCol(4, c).reverse()); setCol(4, c, f_col);
      } else {
        setCol(0, c, getCol(4, c)); setCol(4, c, getCol(1, 3-c).reverse());
        setCol(1, 3-c, getCol(5, c).reverse()); setCol(5, c, f_col);
      }
    } else if (axis === 'z') {
      if (slice === 0) newCube[0] = rotateMatrix(newCube[0], clockwise);
      if (slice === 3) newCube[1] = rotateMatrix(newCube[1], !clockwise);
      const s = slice;
      const getR = (f: number, row: number) => [...newCube[f][row]];
      const getC = (f: number, col: number) => [newCube[f][0][col], newCube[f][1][col], newCube[f][2][col], newCube[f][3][col]];
      const setR = (f: number, row: number, v: any[]) => { newCube[f][row] = v; };
      const setC = (f: number, col: number, v: any[]) => { newCube[f][0][col]=v[0]; newCube[f][1][col]=v[1]; newCube[f][2][col]=v[2]; newCube[f][3][col]=v[3]; };
      if (clockwise) {
        const top = getR(4, 3-s); setR(4, 3-s, getC(2, 3-s).reverse());
        setC(2, 3-s, getR(5, s)); setR(5, s, getC(3, s).reverse()); setC(3, s, top);
      } else {
        const top = getR(4, 3-s); setR(4, 3-s, getC(3, s));
        setC(3, s, getR(5, s).reverse()); setR(5, s, getC(2, 3-s)); setC(2, 3-s, top.reverse());
      }
    }
    cube = newCube;
    currentMove.active = false;
    currentMove.angle = 0;
  }

  function handleMouseMove(e: MouseEvent) {
    if (!containerRef) return;
    const rect = containerRef.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    mouseTiltY = (x / rect.width) * 40;
    mouseTiltX = (y / rect.height) * -40;
  }

  onMount(() => {
    initCube();
    const interval = setInterval(() => {
      const axis = ['x', 'y', 'z'][Math.floor(Math.random() * 3)] as 'x'|'y'|'z';
      performMove(axis, Math.floor(Math.random() * 4), Math.random() > 0.5);
    }, 3200);
    let last = performance.now();
    const loop = (t: number) => {
      autoRotateY += (t - last) * 0.015; autoRotateX += (t - last) * 0.01;
      last = t; requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    return () => clearInterval(interval);
  });

  function getStickerTransform(f: number, r: number, c: number) {
    const size = containerWidth / 4;
    const half = containerWidth / 2;
    const offset = -half + size / 2;
    
    // Local plane position
    let tx = offset + c * size;
    let ty = offset + r * size;
    let tz = half;

    // Face orientation
    let rx = 0, ry = 0;
    if (f === 1) ry = 180;
    if (f === 2) ry = -90;
    if (f === 3) ry = 90;
    if (f === 4) rx = 90;
    if (f === 5) rx = -90;

    // Move rotation logic
    let isIn = false;
    if (currentMove.active) {
      if (currentMove.axis === 'y' && ((f < 4 && r === currentMove.slice) || (f === 4 && currentMove.slice === 0) || (f === 5 && currentMove.slice === 3))) isIn = true;
      if (currentMove.axis === 'x' && ((f === 0 && c === currentMove.slice) || (f === 1 && c === 3-currentMove.slice) || (f === 4 && c === currentMove.slice) || (f === 5 && c === currentMove.slice) || (f === 2 && currentMove.slice === 0) || (f === 3 && currentMove.slice === 3))) isIn = true;
      if (currentMove.axis === 'z' && ((f === 0 && currentMove.slice === 0) || (f === 1 && currentMove.slice === 3) || (f === 4 && 3-r === currentMove.slice) || (f === 5 && r === currentMove.slice) || (f === 2 && 3-c === currentMove.slice) || (f === 3 && c === currentMove.slice))) isIn = true;
    }

    const moveRot = isIn ? `rotate${currentMove.axis.toUpperCase()}(${currentMove.angle}deg)` : '';
    const faceRot = `rotateY(${ry}deg) rotateX(${rx}deg)`;
    const pos = `translate3d(${tx}px, ${ty}px, ${tz}px)`;

    return {
      transform: `${moveRot} ${faceRot} ${pos}`,
      transition: currentMove.active && isIn ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none'
    };
  }
</script>

<div 
  bind:this={containerRef}
  bind:clientWidth={containerWidth}
  class="relative w-full max-w-[200px] aspect-square perspective-1200 cursor-none group mx-auto my-12"
  onmousemove={handleMouseMove}
  onmouseleave={() => { mouseTiltX = 0; mouseTiltY = 0; }}
  role="presentation"
>
  <div class="cube-world absolute inset-0 style-3d" style="transform: rotateX({mouseTiltX}deg) rotateY({mouseTiltY}deg);">
    <div class="cube-auto absolute inset-0 style-3d" style="transform: rotateX({autoRotateX}deg) rotateY({autoRotateY}deg);">
      {#each cube as face, f}
        {#each face as row, r}
          {#each row as sticker, c (sticker.id)}
            {@const style = getStickerTransform(f, r, c)}
            <div 
              class="sticker absolute flex items-center justify-center nav-glass backdrop-blur-sm border border-primary/20 bg-surface-container/60"
              style="
                width: {containerWidth/4 - 2}px; height: {containerWidth/4 - 2}px;
                left: 50%; top: 50%; margin-left: -{containerWidth/8 - 1}px; margin-top: -{containerWidth/8 - 1}px;
                transform: {style.transform}; transition: {style.transition};
              "
            >
              <span class="text-[10px] font-mono text-primary/80 font-bold" use:decode={{targetText: sticker.val, duration: 8000}}>
                {sticker.val}
              </span>
            </div>
          {/each}
        {/each}
      {#each [0,1,2,3,4,5] as dummy}<!-- Empty for stability -->{/each}
      {/each}
    </div>
  </div>
</div>

<style>
  .perspective-1200 { perspective: 1200px; }
  .style-3d { transform-style: preserve-3d; }
  .sticker { backface-visibility: visible; transform-origin: center center; }
</style>
