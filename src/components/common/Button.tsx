import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { colors, animations } from '../../styles/theme';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const getVariantStyles = (variant: ButtonVariant = 'primary') => {
  switch (variant) {
    case 'primary':
      return `bg-gradient-to-r ${colors.accent.primary} ${colors.text.primary} shadow-lg hover:shadow-xl`;
    case 'secondary':
      return `bg-white/10 ${colors.text.primary} backdrop-blur-sm hover:bg-white/20`;
    case 'outline':
      return `border ${colors.border.primary} ${colors.text.primary} hover:bg-white/10`;
    default:
      return '';
  }
};

const getSizeStyles = (size: ButtonSize = 'md') => {
  switch (size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm';
    case 'md':
      return 'px-4 py-2 text-base';
    case 'lg':
      return 'px-6 py-3 text-lg';
    default:
      return '';
  }
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  children,
  disabled,
  ...props
}) => {
  return (
    <motion.button
      className={`
        inline-flex items-center justify-center
        rounded-lg font-medium
        transition-shadow duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${getVariantStyles(variant)}
        ${getSizeStyles(size)}
        ${className}
      `}
      whileHover={animations.scale.hover}
      whileTap={animations.scale.tap}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center space-x-2">
          {leftIcon && <span>{leftIcon}</span>}
          <span>{children}</span>
          {rightIcon && <span>{rightIcon}</span>}
        </div>
      )}
    </motion.button>
  );
}; 