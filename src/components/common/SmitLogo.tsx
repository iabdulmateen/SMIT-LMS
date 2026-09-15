import React from 'react';

interface SmitLogoProps {
  className?: string;
  collapsed?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const SmitLogo: React.FC<SmitLogoProps> = ({
  className = '',
  collapsed = false,
  size = 'md',
}) => {
  const heightClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
    xl: 'h-18',
  }[size];

  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Authentic SMIT Vector Logo */}
      <img
        src="/smit-logo.svg"
        alt="Saylani Mass IT Training (SMIT)"
        className={`${heightClasses} w-auto object-contain transition-transform`}
        referrerPolicy="no-referrer"
      />
    </div>
  );
};
