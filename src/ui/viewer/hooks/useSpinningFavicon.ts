import { useEffect, useRef } from 'react';

/**
 * Hook that makes the browser tab favicon spin when isProcessing is true.
 * Uses the logo PNG image and rotates it on canvas.
 */
export function useSpinningFavicon(isProcessing: boolean) {
  const animationRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const rotationRef = useRef(0);
  const originalFaviconRef = useRef<string | null>(null);

  useEffect(() => {
    // Create canvas once
    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas');
      canvasRef.current.width = 32;
      canvasRef.current.height = 32;
    }

    // Store original favicon
    if (!originalFaviconRef.current) {
      const link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (link) {
        originalFaviconRef.current = link.href;
      }
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    const updateFavicon = (dataUrl: string) => {
      let link = document.querySelector<HTMLLinkElement>('link[rel="icon"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'icon';
        document.head.appendChild(link);
      }
      link.href = dataUrl;
    };

    // Load logo image
    const loadLogo = (): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (imageRef.current && imageRef.current.complete) {
          resolve();
          return;
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          imageRef.current = img;
          resolve();
        };
        img.onerror = () => {
          // Fallback: if logo fails to load, use original favicon
          if (originalFaviconRef.current) {
            updateFavicon(originalFaviconRef.current);
          }
          reject(new Error('Failed to load logo'));
        };
        img.src = 'logoclauderecall.png';
      });
    };

    const drawLogo = (rotation: number) => {
      if (!imageRef.current) return;

      ctx.clearRect(0, 0, 32, 32);
      ctx.save();
      ctx.translate(16, 16);
      ctx.rotate(rotation);
      
      // Draw logo centered, scaled to fit 32x32 canvas
      const size = 28; // Slightly smaller than canvas for padding
      ctx.drawImage(imageRef.current, -size / 2, -size / 2, size, size);
      
      ctx.restore();
    };

    const animate = () => {
      // Rotate by ~4 degrees per frame (matches 1.5s for full rotation at 60fps)
      rotationRef.current += (2 * Math.PI) / 90;
      drawLogo(rotationRef.current);
      updateFavicon(canvas.toDataURL('image/png'));
      animationRef.current = requestAnimationFrame(animate);
    };

    // Load logo and set up favicon
    loadLogo()
      .then(() => {
        if (isProcessing) {
          rotationRef.current = 0;
          animate();
        } else {
          // Stop animation and show static logo
          if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
          }
          drawLogo(0);
          updateFavicon(canvas.toDataURL('image/png'));
        }
      })
      .catch(() => {
        // Logo failed to load, keep original favicon
      });

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [isProcessing]);
}
