import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/helpers';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  className,
  disabled,
  ...props
}: ButtonProps) => {
  const baseStyles = 'rounded-button font-semibold transition-all duration-300 inline-flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-primary-main text-white hover:bg-primary-dark hover:-translate-y-0.5 shadow-lg',
    secondary: 'bg-transparent text-primary-main border-2 border-neutral-lightGray hover:border-primary-main hover:bg-primary-main/5',
    outline: 'bg-transparent text-primary-main border-2 border-primary-main hover:bg-primary-main hover:text-white',
    ghost: 'bg-transparent text-primary-main hover:bg-primary-main/10',
  };

  const sizes = {
    small: 'px-6 py-2.5 text-sm',
    medium: 'px-8 py-3.5 text-base',
    large: 'px-10 py-4 text-lg',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        (disabled || isLoading) && 'opacity-50 cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          Loading...
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
