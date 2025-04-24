
import React, { useEffect, useRef } from 'react';

const images = [
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=100&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?w=100&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=100&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=100&auto=format&fit=crop',
];

const NetworkBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<{ x: number; y: number; img: HTMLImageElement }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Create nodes with images
    const createNodes = async () => {
      const nodes = await Promise.all(images.map(async (src) => {
        const img = new Image();
        img.src = src;
        await new Promise((resolve) => { img.onload = resolve; });
        return {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          img
        };
      }));
      nodesRef.current = nodes;
    };

    // Draw the network
    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw connections
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(14, 165, 233, 0.2)';
      nodesRef.current.forEach((node, i) => {
        nodesRef.current.forEach((otherNode, j) => {
          if (i !== j) {
            ctx.moveTo(node.x + 25, node.y + 25);
            ctx.lineTo(otherNode.x + 25, otherNode.y + 25);
          }
        });
      });
      ctx.stroke();

      // Draw nodes
      nodesRef.current.forEach((node) => {
        ctx.drawImage(node.img, node.x, node.y, 50, 50);
      });

      requestAnimationFrame(draw);
    };

    createNodes().then(() => {
      draw();
    });

    return () => {
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-10"
      style={{ zIndex: 0 }}
    />
  );
};

export default NetworkBackground;
