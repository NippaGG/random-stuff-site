import React from 'react';

export interface InlineBadgeProps {
  type: 'chameleon' | 'app-store' | 'play-store' | 'tools' | 'star';
  className?: string;
}

export const InlineBadge: React.FC<InlineBadgeProps> = ({ type, className = '' }) => {
  if (type === 'chameleon') {
    return (
      <span
        className={`inline-flex items-center justify-center align-middle mx-1 w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-[#B5FF2E] to-[#73C800] p-1.5 shadow-[0_4px_8px_rgba(115,200,0,0.35),inset_0_1px_1px_rgba(255,255,255,0.8)] border border-white/60 -translate-y-0.5 ${className}`}
      >
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
          <circle cx="68" cy="38" r="12" fill="#14334D" />
          <circle cx="72" cy="34" r="4.5" fill="#FFFFFF" />
          <path
            d="M30 65 C 22 72, 12 70, 10 60 C 8 50, 18 45, 22 52"
            stroke="#14334D"
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </span>
    );
  }

  if (type === 'tools') {
    return (
      <span
        className={`inline-flex items-center justify-center align-middle mx-1 w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#007BE5] shadow-xs border border-white/40 text-white -translate-y-0.5 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
        </svg>
      </span>
    );
  }

  if (type === 'star') {
    return (
      <span
        className={`inline-flex items-center justify-center align-middle mx-1 w-7 h-7 md:w-8 md:h-8 rounded-lg bg-amber-400 shadow-xs border border-white/40 text-amber-950 -translate-y-0.5 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </span>
    );
  }

  if (type === 'app-store') {
    return (
      <span
        className={`inline-flex items-center justify-center align-middle mx-1 w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-sm border border-white/40 -translate-y-0.5 ${className}`}
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.63-.76 1.06-1.82.94-2.87-.91.04-2.02.61-2.67 1.37-.58.67-1.09 1.74-.95 2.78 1.02.08 2.05-.52 2.68-1.28z" />
        </svg>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center justify-center align-middle mx-1 w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white shadow-sm border border-slate-200 -translate-y-0.5 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4">
        <path d="M3.61 2.22c-.37.38-.59.98-.59 1.76v16.04c0 .78.22 1.38.59 1.76l.08.08 9.03-9.03v-.17L3.69 2.14l-.08.08z" fill="#00D2FF" />
        <path d="M15.74 15.86l-3.02-3.02v-.17l3.02-3.02.07.04 3.59 2.04c1.02.58 1.02 1.53 0 2.11l-3.59 2.04-.07-.02z" fill="#FFCF00" />
        <path d="M15.81 15.84l-3.09-3.09-9.11 9.11c.34.36.9.4 1.56.03l10.64-6.05" fill="#FF3A44" />
        <path d="M15.81 8.16L5.17 2.11C4.51 1.74 3.95 1.78 3.61 2.14l9.11 9.11 3.09-3.09z" fill="#00F076" />
      </svg>
    </span>
  );
};
