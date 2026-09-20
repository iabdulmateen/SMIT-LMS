import React, { useEffect, useState } from 'react';

interface AnimatedProgressRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  showText?: boolean;
  textColor?: string;
  duration?: number; // ms
}

export const AnimatedProgressRing: React.FC<AnimatedProgressRingProps> = ({
  percentage,
  size = 50,
  strokeWidth = 4,
  className = '',
  showText = true,
  textColor,
  duration = 1400,
}) => {
  const [currentPercent, setCurrentPercent] = useState<number>(0);
  const [displayValue, setDisplayValue] = useState<number>(0);

  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;

  // Run the animation smoothly whenever percentage changes or on mount
  useEffect(() => {
    // Reset to 0 first for crisp visual running effect
    setCurrentPercent(0);
    setDisplayValue(0);

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const interpolatedVal = easeOut * percentage;

      setCurrentPercent(interpolatedVal);
      setDisplayValue(Math.round(interpolatedVal));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCurrentPercent(percentage);
        setDisplayValue(percentage);
      }
    };

    // Small delay to ensure render layout is ready
    const timer = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, 80);

    return () => {
      clearTimeout(timer);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [percentage, duration]);

  const offset = circumference - (currentPercent / 100) * circumference;

  // Colors matching Image 3 (100% is emerald/green, 1-99% is vibrant blue, 0% is muted slate)
  const isComplete = percentage >= 100;
  const strokeColor = isComplete
    ? '#10B981'
    : percentage > 0
    ? '#2563EB'
    : '#E2E8F0';

  const defaultTextColorClass = isComplete
    ? 'text-emerald-600 dark:text-emerald-400'
    : percentage > 0
    ? 'text-blue-600 dark:text-blue-400'
    : 'text-slate-400 dark:text-slate-500';

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90 transform overflow-visible"
      >
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-100 dark:text-slate-800"
          fill="transparent"
        />

        {/* Dynamic Animated Progress Stroke */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          fill="transparent"
          style={{
            transition: 'stroke 0.3s ease',
          }}
        />
      </svg>

      {showText && (
        <span
          className={`absolute text-xs font-bold tracking-tight select-none ${
            textColor || defaultTextColorClass
          }`}
          style={{
            fontSize: size <= 44 ? '10px' : size <= 52 ? '11px' : '13px',
          }}
        >
          {displayValue}%
        </span>
      )}
    </div>
  );
};
