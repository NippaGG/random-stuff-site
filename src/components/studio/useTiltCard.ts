import { useRef } from 'react';
import { useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';

export interface UseTiltCardOptions {
  /** Maximum rotation angle in degrees (default: 12) */
  maxTilt?: number;
  /** Spring stiffness (default: 150) */
  stiffness?: number;
  /** Spring damping (default: 20) */
  damping?: number;
  /** Spring mass (default: 0.5) */
  mass?: number;
}

export function useTiltCard({
  maxTilt = 12,
  stiffness = 150,
  damping = 20,
  mass = 0.5,
}: UseTiltCardOptions = {}) {
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Normalized mouse coordinates: -0.5 to 0.5
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { stiffness, damping, mass };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Calculate 3D rotations: Y tilts with X, X tilts inverted with Y
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [maxTilt, -maxTilt]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-maxTilt, maxTilt]);

  // Glare position coordinates in percentages (0% to 100%)
  const glareX = useTransform(smoothX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(smoothY, [-0.5, 0.5], ['0%', '100%']);

  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255, 255, 255, 0.25) 0%, transparent 65%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const normalizedX = (e.clientX - rect.left) / rect.width - 0.5;
    const normalizedY = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(normalizedX);
    mouseY.set(normalizedY);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return {
    cardRef,
    rotateX,
    rotateY,
    glareBackground,
    handleMouseMove,
    handleMouseLeave,
  };
}
