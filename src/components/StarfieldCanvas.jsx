import React, { useEffect, useRef } from 'react';

/**
 * High-performance cinematic starfield & shooting stars canvas
 * Supports 3D star drift, nebula clouds, and meteor trails.
 */
export default function StarfieldCanvas({ isHeartMode = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let stars = [];
    let shootingStars = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const isMobile = window.innerWidth < 640;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Scale star count down on mobile for silky smooth 60fps performance
    const divisor = isMobile ? 8000 : 3800;
    const maxStars = isMobile ? 110 : 300;
    const starCount = Math.min(Math.floor((window.innerWidth * window.innerHeight) / divisor), maxStars);

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * 2 + 0.5,
        radius: Math.random() * 1.5 + 0.4,
        alpha: Math.random() * 0.8 + 0.2,
        twinkleSpeed: (Math.random() * 0.02 + 0.005) * (Math.random() > 0.5 ? 1 : -1),
        color: ['#FFF8FF', '#C9B6FF', '#FF8FB8', '#E8C98B'][Math.floor(Math.random() * 4)],
      });
    }

    // Spawn shooting stars periodically (less frequent on mobile)
    const shootingProb = isMobile ? 0.008 : 0.015;
    const spawnShootingStar = () => {
      if (Math.random() < shootingProb && shootingStars.length < (isMobile ? 1 : 3)) {
        shootingStars.push({
          x: Math.random() * canvas.width * 0.8,
          y: Math.random() * canvas.height * 0.4,
          length: Math.random() * 120 + 80,
          speed: Math.random() * 7 + 9,
          angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
          opacity: 1,
          decay: 0.02,
        });
      }
    };

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render Stars
      for (const s of stars) {
        if (!prefersReducedMotion) {
          s.alpha += s.twinkleSpeed;
          if (s.alpha > 1 || s.alpha < 0.15) {
            s.twinkleSpeed = -s.twinkleSpeed;
          }

          // Slight drift upwards
          s.y -= s.z * 0.15;
          if (s.y < 0) {
            s.y = canvas.height;
            s.x = Math.random() * canvas.width;
          }
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(1, s.alpha));
        ctx.fillStyle = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * s.z, 0, Math.PI * 2);
        ctx.fill();

        // Extra glow on larger stars (skip on mobile for maximum GPU performance)
        if (s.radius > 1.2 && !isMobile) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = s.color;
          ctx.fill();
        }
        ctx.restore();
      }

      // Render Shooting Stars
      spawnShootingStar();
      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i];
        const tailX = ss.x - Math.cos(ss.angle) * ss.length;
        const tailY = ss.y - Math.sin(ss.angle) * ss.length;

        const grad = ctx.createLinearGradient(tailX, tailY, ss.x, ss.y);
        grad.addColorStop(0, 'rgba(255, 143, 184, 0)');
        grad.addColorStop(1, `rgba(255, 248, 255, ${ss.opacity})`);

        ctx.save();
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(ss.x, ss.y);
        ctx.stroke();
        ctx.restore();

        ss.x += Math.cos(ss.angle) * ss.speed;
        ss.y += Math.sin(ss.angle) * ss.speed;
        ss.opacity -= ss.decay;

        if (ss.opacity <= 0 || ss.x > canvas.width || ss.y > canvas.height) {
          shootingStars.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHeartMode]);

  return <canvas ref={canvasRef} className="cinematic-starfield" aria-hidden="true" />;
}
