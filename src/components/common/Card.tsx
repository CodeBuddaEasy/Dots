import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { colors, animations } from '../../styles/theme';

type CardVariant = 'solid' | 'glass' | 'outline';

interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  variant?: CardVariant;
  hoverable?: boolean;
  children?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const getVariantStyles = (variant: CardVariant = 'solid') => {
  switch (variant) {
    case 'solid':
      return `bg-gray-900/90 ${colors.text.primary}`;
    case 'glass':
      return `bg-white/10 backdrop-blur-lg ${colors.text.primary}`;
    case 'outline':
      return `border ${colors.border.primary} ${colors.text.primary}`;
    default:
      return '';
  }
};

export const Card: React.FC<CardProps> = ({
  variant = 'solid',
  hoverable = false,
  children,
  header,
  footer,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      className={`
        rounded-xl overflow-hidden
        ${getVariantStyles(variant)}
        ${hoverable ? 'hover:bg-white/5' : ''}
        ${className}
      `}
      {...(hoverable && {
        whileHover: animations.scale.hover,
        whileTap: animations.scale.tap
      })}
      {...props}
    >
      {header && (
        <div className={`px-6 py-4 border-b ${colors.border.primary}`}>
          {header}
        </div>
      )}
      <div className="px-6 py-4">
        {children}
      </div>
      {footer && (
        <div className={`px-6 py-4 border-t ${colors.border.primary}`}>
          {footer}
        </div>
      )}
    </motion.div>
  );
}; 