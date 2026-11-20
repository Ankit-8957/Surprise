import React, { useEffect, useRef } from 'react';

/**
 * Romantic stardust trail following cursor on desktop.
 * Uses requestAnimationFrame and Canvas for zero DOM-overhead performance.
 */
export default function SparkleTrail() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Skip on touch screens or if prefers-reduced-motion is enabled
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (isTouch || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#f472b6', '#fb7185', '#fef08a', '#c084fc', '#ffd1dc'];

    const handleMouseMove = (e) => {
      // Add 2-3 stardust particles on move
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          size: Math.random() * 3 + 1.5,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 1.2,
          vy: Math.random() * 1.2 + 0.3,
          alpha: 1,
          decay: Math.random() * 0.025 + 0.02,
          rotation: Math.random() * Math.PI,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        // Draw a tiny 4-point sparkle star
        ctx.beginPath();
        const s = p.size;
        ctx.moveTo(0, -s * 2);
        ctx.quadraticCurveTo(0, 0, s * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, s * 2);
        ctx.quadraticCurveTo(0, 0, -s * 2, 0);
        ctx.quadraticCurveTo(0, 0, 0, -s * 2);
        ctx.fill();

        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="sparkle-trail-canvas"
      aria-hidden="true"
    />
  );
}
