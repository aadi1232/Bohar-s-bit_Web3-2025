import React, { ReactNode } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  animation?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scaleUp' | 'rotateIn';
  threshold?: number;
}

const AnimatedSection: React.FC<AnimatedSectionProps> = ({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
  animation = 'fadeUp',
  threshold = 0.1,
}) => {
  const { elementRef, isVisible } = useScrollAnimation({ threshold });

  const getAnimationStyles = () => {
    const baseStyles = {
      transition: `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      transitionDelay: `${delay}s`,
    };

    switch (animation) {
      case 'fadeUp':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
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
          transform: isVisible ? 'translateX(0)' : 'translateX(-50px)',
        };
      case 'slideRight':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateX(0)' : 'translateX(50px)',
        };
      case 'scaleUp':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
        };
      case 'rotateIn':
        return {
          ...baseStyles,
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'rotate(0deg) scale(1)' : 'rotate(-5deg) scale(0.95)',
        };
      default:
        return baseStyles;
    }
  };

  return (
    <div
      ref={elementRef}
      className={className}
      style={getAnimationStyles()}
    >
      {children}
    </div>
  );
};

export default AnimatedSection;
