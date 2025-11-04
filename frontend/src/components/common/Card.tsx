import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/helpers';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

const Card = ({ children, className, hover = false, onClick }: CardProps) => {
  const Component = motion.div;

  return (
    <Component
      className={cn(
        'card',
        hover && 'cursor-pointer hover:scale-[1.02]',
        onClick && 'cursor-pointer',
        className
      )}
      whileHover={hover ? { y: -4 } : undefined}
      onClick={onClick}
    >
      {children}
    </Component>
  );
};

export default Card;
