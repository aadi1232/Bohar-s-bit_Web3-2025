import React, { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface StaggeredAnimationProps {
  children: ReactNode[];
  className?: string;
  staggerDelay?: number;
  duration?: number;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleUp';
  threshold?: number;
}

const StaggeredAnimation: React.FC<StaggeredAnimationProps> = ({
  children,
  className = '',
  staggerDelay = 0.1,
  duration = 0.6,
  animation = 'fadeUp',
  threshold = 0.1,
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold });

  const getAnimationStyles = (index: number) => {
    const delay = index * staggerDelay;
    const baseStyles = {
      transition: `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      transitionDelay: `${delay}s`,
    };

    switch (animation) {
      case 'fadeUp':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        };
      case 'fadeIn':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
        };
      case 'slideLeft':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
        };
      case 'slideRight':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
        };
      case 'scaleUp':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div ref={elementRef} className={className}>
      {children.map((child, index) => (
        <div
          key={index}
          style={getAnimationStyles(index)}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default StaggeredAnimation;
