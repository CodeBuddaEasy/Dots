import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { colors } from '../../styles/theme';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends Omit<HTMLMotionProps<"span">, "children"> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children?: React.ReactNode;
  withDot?: boolean;
}

const getVariantStyles = (variant: BadgeVariant = 'default') => {
  switch (variant) {
    case 'success':
      return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'warning':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'error':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'info':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    default:
      return `bg-white/10 ${colors.text.secondary} ${colors.border.primary}`;
  }
};

const getSizeStyles = (size: BadgeSize = 'md') => {
  switch (size) {
    case 'sm':
      return 'px-2 py-0.5 text-xs';
    case 'md':
      return 'px-2.5 py-1 text-sm';
    default:
      return '';
  }
};

const getDotStyles = (variant: BadgeVariant = 'default') => {
  switch (variant) {
    case 'success':
      return 'bg-green-400';
    case 'warning':
      return 'bg-yellow-400';
    case 'error':
      return 'bg-red-400';
    case 'info':
      return 'bg-blue-400';
    default:
      return 'bg-gray-400';
  }
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  size = 'md',
  withDot = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.span
      className={`
        inline-flex items-center
        rounded-full border
        font-medium
        ${getVariantStyles(variant)}
        ${getSizeStyles(size)}
        ${className}
      `}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      {...props}
    >
      {withDot && (
        <span
          className={`
            w-1.5 h-1.5
            rounded-full
            mr-1.5
            ${getDotStyles(variant)}
          `}
        />
      )}
      {children}
    </motion.span>
  );
}; 