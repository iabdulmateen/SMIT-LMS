import React from 'react';
import { GraduationCap } from 'lucide-react';

interface SmitLogoProps {
  className?: string;
  collapsed?: boolean;
}

export const SmitLogo: React.FC<SmitLogoProps> = ({ className = '', collapsed = false }) => {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      <div className="relative flex items-center justify-center">
        {/* Stylized SMIT Graduation Icon & Typography */}
        <div className="relative flex flex-col items-center">
          <GraduationCap className="w-6 h-6 text-[#1570EF] mb-0.5" strokeWidth={2.2} />
          <div className="flex items-center tracking-tight">
            <span className="text-[#027A48] font-black text-2xl leading-none">S</span>
            <span className="text-[#1570EF] font-black text-2xl leading-none">M</span>
            <span className="text-[#027A48] font-black text-2xl leading-none">I</span>
            <span className="text-[#1570EF] font-black text-2xl leading-none">T</span>
          </div>
          {!collapsed && (
            <span className="text-[7.5px] font-semibold tracking-wider text-gray-500 uppercase mt-0.5">
              Saylani Mass IT Training
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
