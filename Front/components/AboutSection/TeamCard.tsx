import { ForwardedRef, forwardRef } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { ArrowForward } from 'react-ionicons';
import styles from './styles/About.module.css';

export interface TeamCardProps {
  title: string;
  imageSrc: string;
  description: string;
  theme?: 'light' | 'dark';
}

const TeamCard = forwardRef<HTMLDivElement, TeamCardProps>(
  ({ title, imageSrc, description, theme }, ref) => {
    const { theme: contextTheme } = useTheme();
    const currentTheme = theme || contextTheme;

    return (
      <div 
        ref={ref}
        className={`card max-w-[300px] aspect-[3/5] rounded-xl mx-5 overflow-hidden shadow-lg cursor-grab snap-start flex-shrink-0 ${styles.cardContainer}`}
        data-tilt
      >
        <div className={`relative h-full grid grid-cols-1 grid-rows-9 p-5 ${
          currentTheme === 'dark' 
            ? 'bg-gradient-to-br from-purple-800 via-pink-700 to-purple-900' 
            : 'bg-gradient-to-br from-purple-400 via-pink-300 to-purple-500'
        } select-none`}>
          <div className="aspect-[3/2] rounded-lg row-span-4 mb-5 overflow-hidden">
            <img 
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover shadow-md"
            />
          </div>
          <h1 className={`text-xl ${currentTheme === 'dark' ? 'text-gray-100' : 'text-gray-800'} text-center row-span-1`}>
            {title}
          </h1>
          <p className={`text-base font-normal ${currentTheme === 'dark' ? 'text-gray-300' : 'text-gray-600'} row-span-3`}>
            {description}
          </p>
          <button className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-sm p-2 rounded text-sm font-normal row-span-1 mx-auto mt-1 mb-2 flex items-center gap-1 hover:scale-105 transition-all`}>
            <span>Learn More</span>
            <ArrowForward
              color={currentTheme === 'dark' ? '#e5e7eb' : '#f9fafb'}
              height="16px"
              width="16px"
            />
          </button>
        </div>
      </div>
    );
  }
);

export default TeamCard;