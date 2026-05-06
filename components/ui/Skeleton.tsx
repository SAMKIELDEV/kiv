import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton = ({ className, style, ...props }: SkeletonProps) => {
  return (
    <div
      className={`relative overflow-hidden rounded-md bg-surface/50 ${className || ''}`}
      style={{
        ...style,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
      }}
      {...props}
    >
      <div 
        className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.05), transparent)',
        }}
      />
    </div>
  );
};
