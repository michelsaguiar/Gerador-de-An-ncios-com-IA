
import React from 'react';

type IconName = 'upload' | 'fullscreen' | 'download' | 'close' | 'sparkles';

interface IconProps {
  name: IconName;
  className?: string;
}

const ICONS: Record<IconName, React.FC<{className?: string}>> = {
  upload: ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
  ),
  fullscreen: ({ className }) => (
     <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11 5v4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11-5v-4m0 0h-4m4 0l-5 5" />
    </svg>
  ),
  download: ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  ),
  close: ({ className }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  sparkles: ({ className }) => (
     <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M4 17v4M2 19h4M17 3v4M15 5h4M18 17v4m-2 2h4M12 9a3 3 0 100-6 3 3 0 000 6zM21 15a3 3 0 100-6 3 3 0 000 6zM3 15a3 3 0 100-6 3 3 0 000 6zM12 21a3 3 0 100-6 3 3 0 000 6z" />
     </svg>
  ),
};

export const Icon: React.FC<IconProps> = ({ name, className = 'w-6 h-6' }) => {
  const SvgIcon = ICONS[name];
  if (!SvgIcon) return null;
  return <SvgIcon className={className} />;
};
