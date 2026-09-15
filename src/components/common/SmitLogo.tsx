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
      {collapsed ? (
        // Collapsed icon emblem: graduation cap + S
        <svg
          viewBox="0 0 190 270"
          className={`${heightClasses} w-auto object-contain transition-all duration-200`}
          fill="none"
        >
          <g transform="translate(14, -4)">
            <polygon points="106,30 38,58 106,86 174,58" fill="#0f75bc" />
            <path d="M 68,60 Q 106,75 144,60" stroke="#ffffff" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>
            <path d="M 62,68 L 62,88 C 62,104 150,104 150,88 L 150,68 C 132,76 80,76 62,68 Z" fill="#0f75bc" />
            <circle cx="106" cy="58" r="3.5" fill="#0b5487" />
            <path d="M 28,142 C 28,78 72,50 148,78" stroke="#78be20" stroke-width="16" stroke-linecap="round" fill="none" />
          </g>
          <path d="M 125,116 C 96,116 60,126 60,162 C 60,198 126,198 126,220 C 126,234 108,238 92,238 C 72,238 52,230 40,220 L 40,248 C 54,256 74,262 96,262 C 128,262 156,246 156,218 C 156,178 90,178 90,158 C 90,144 104,140 120,140 C 136,140 152,146 162,152 L 162,124 C 150,118 138,116 125,116 Z" fill="#0f75bc" />
        </svg>
      ) : (
        // Full Authentic SMIT Vector Logo
        <svg
          viewBox="0 0 500 320"
          className={`${heightClasses} w-auto object-contain transition-all duration-200`}
          fill="none"
        >
          {/* Top Hat / Graduation Cap over S */}
          <g transform="translate(18, -4)">
            {/* Cap Diamond / Mortarboard */}
            <polygon points="106,30 38,58 106,86 174,58" fill="#0f75bc" />
            {/* White inner rim highlight */}
            <path d="M 68,60 Q 106,75 144,60" stroke="#ffffff" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round"/>
            {/* Cap Skullcap / Base Band */}
            <path d="M 62,68 L 62,88 C 62,104 150,104 150,88 L 150,68 C 132,76 80,76 62,68 Z" fill="#0f75bc" />
            <circle cx="106" cy="58" r="3.5" fill="#0b5487" />
            
            {/* Green Arch swooshing over S */}
            <path d="M 28,142 C 28,78 72,50 148,78" stroke="#78be20" strokeWidth="16" strokeLinecap="round" fill="none" />
          </g>

          {/* Blue Letter S */}
          <path d="M 125,116 C 96,116 60,126 60,162 C 60,198 126,198 126,220 C 126,234 108,238 92,238 C 72,238 52,230 40,220 L 40,248 C 54,256 74,262 96,262 C 128,262 156,246 156,218 C 156,178 90,178 90,158 C 90,144 104,140 120,140 C 136,140 152,146 162,152 L 162,124 C 150,118 138,116 125,116 Z" fill="#0f75bc" />

          {/* Blue Letter M */}
          <path d="M 178,120 L 208,120 L 244,204 L 280,120 L 310,120 L 310,258 L 282,258 L 282,168 L 254,232 L 234,232 L 206,168 L 206,258 L 178,258 Z" fill="#0f75bc" />

          {/* Letter I (Green Circle Dot & Styled Sprout Stem) */}
          <g>
            <circle cx="344" cy="78" r="23" fill="#78be20" />
            <path d="M 328,120 L 364,120 L 364,258 L 328,258 Z" fill="#0f75bc" />
            <path d="M 328,252 C 322,234 322,204 336,172 C 348,144 354,128 350,120 C 358,136 360,166 346,200 C 334,230 334,246 338,258 Z" fill="#ffffff" />
            <path d="M 324,250 C 316,228 318,198 334,166 C 348,138 354,124 350,118 C 354,126 358,150 344,184 C 330,218 328,236 334,254 Z" fill="#78be20" />
          </g>

          {/* Blue Letter T */}
          <path d="M 378,120 L 476,120 L 476,148 L 441,148 L 441,258 L 413,258 L 413,148 L 378,148 Z" fill="#0f75bc" />

          {/* Subtitle: SAYLANI MASS IT TRAINING (Adapts to Dark/Light theme) */}
          <text
            x="250"
            y="295"
            fontFamily="'Plus Jakarta Sans', Arial, Helvetica, sans-serif"
            fontWeight="900"
            fontSize="22"
            letterSpacing="4.5"
            className="fill-slate-900 dark:fill-slate-100"
            textAnchor="middle"
          >
            SAYLANI MASS IT TRAINING
          </text>
        </svg>
      )}
    </div>
  );
};
