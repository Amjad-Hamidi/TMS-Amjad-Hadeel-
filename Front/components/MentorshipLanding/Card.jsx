import { useTheme } from '@/context/ThemeContext';
import styles from '../styles/MentorshipLanding.module.css';

const Card = ({ imageSrc, title, description }) => {
  const { theme } = useTheme();
  const cardTextColor = theme === 'dark' ? 'text-gray-200' : 'text-white';

  return (
    <div className="card max-w-[300px] aspect-[3/5] rounded-xl mx-5 overflow-hidden border-t border-l border-white/70 shadow-lg cursor-grab snap-start flex-shrink-0" data-tilt>
      <div className={`${styles.content} relative h-full grid grid-cols-1 grid-rows-9 p-5 bg-gray-600/50 select-none`}>
        <div className="aspect-[3/2] rounded-lg row-span-4 mb-5 overflow-hidden">
          <img 
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover shadow-md"
          />
        </div>
        <h1 className={`text-xl ${cardTextColor} text-center row-span-1`}>{title}</h1>
        <p className={`text-base font-normal ${cardTextColor} row-span-3`}>
          {description}
        </p>
        <button className="btn btn-grad bg-gradient-to-r from-gray-100 to-white text-black shadow-sm p-2 rounded text-sm font-normal row-span-1 mx-auto mt-1 mb-2 flex items-center gap-1">
          <span>Learn More</span>
          <ion-icon name="arrow-forward-outline"></ion-icon>
        </button>
      </div>
    </div>
  );
};

export default Card;