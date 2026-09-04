import React from 'react';

export interface TextHighlightProps {
  children: React.ReactNode;
  color?: 'lime' | 'blue' | 'yellow';
  className?: string;
}

export const TextHighlight: React.FC<TextHighlightProps> = ({
  children,
  color = 'lime',
  className = '',
}) => {
  const colorMap = {
    lime: 'bg-[#9DF71F] text-[#14334D]',
    blue: 'bg-[#82CCFF] text-[#14334D]',
    yellow: 'bg-[#FDE047] text-[#14334D]',
  }[color];

  return (
    <span
      className={`inline-block px-2 py-0.5 rounded-[4px] font-bold mx-0.5 tracking-tight ${colorMap} ${className}`}
    >
      {children}
    </span>
  );
};
