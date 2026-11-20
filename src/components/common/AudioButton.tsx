import React, { useState } from 'react';
import { Volume2, Volume1, Loader2 } from 'lucide-react';
import { speakText } from '../../utils/speech';

interface AudioButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  showSlowToggle?: boolean;
  className?: string;
  title?: string;
}

export const AudioButton: React.FC<AudioButtonProps> = ({
  text,
  size = 'md',
  showSlowToggle = false,
  className = '',
  title = 'Nghe phát âm tiếng Anh'
}) => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [rate, setRate] = useState<number>(0.9); // 0.9 = normal, 0.7 = slow

  const handlePlay = (playbackRate: number) => {
    if (isPlaying) return;
    setIsPlaying(true);
    speakText(text, playbackRate, () => {
      setIsPlaying(false);
    });
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const btnPaddings = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-2.5 text-base'
  };

  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      {/* Normal speed button */}
      <button
        type="button"
        onClick={() => handlePlay(0.9)}
        disabled={isPlaying}
        title={title}
        aria-label={title}
        className={`${btnPaddings[size]} rounded-full bg-primary-50 dark:bg-primary-950/60 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/80 active:scale-95 transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-60 flex items-center justify-center`}
      >
        {isPlaying ? (
          <Loader2 className={`${iconSizes[size]} animate-spin`} />
        ) : (
          <Volume2 className={iconSizes[size]} />
        )}
      </button>

      {/* Optional Slow speed button */}
      {showSlowToggle && (
        <button
          type="button"
          onClick={() => handlePlay(0.68)}
          disabled={isPlaying}
          title="Nghe tốc độ chậm (0.7x)"
          aria-label="Nghe tốc độ chậm"
          className="px-2 py-1 text-[11px] font-medium rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 active:scale-95 transition-all flex items-center gap-0.5"
        >
          <Volume1 className="w-3.5 h-3.5" />
          <span>0.7x</span>
        </button>
      )}
    </div>
  );
};

