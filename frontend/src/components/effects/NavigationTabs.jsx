import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export function NavigationTabs({ tabs, activeTab, onChange, className }) {
  return (
    <div className={cn('flex items-center gap-1 p-1 rounded-full bg-zinc-900/50 border border-zinc-800', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200',
            activeTab === tab.id ? 'text-black' : 'text-zinc-400 hover:text-white'
          )}
        >
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 bg-white rounded-full"
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{tab.label}</span>
        </button>
      ))}
    </div>
  );
}

export function SpotlightButton({ children, className, onClick, ...props }) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <button
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-full px-8 py-3 font-medium',
        'bg-white text-black',
        'transition-all duration-300',
        'hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]',
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      {isHovered && (
        <div
          className="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 bg-black/10 rounded-full blur-xl pointer-events-none"
          style={{
            left: position.x,
            top: position.y,
          }}
        />
      )}
    </button>
  );
}

export function OutlineButton({ children, className, onClick, ...props }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'relative overflow-hidden rounded-full px-8 py-3 font-medium',
        'bg-transparent text-white border border-zinc-700',
        'transition-all duration-300',
        'hover:border-zinc-500 hover:bg-zinc-900/50',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export default NavigationTabs;
