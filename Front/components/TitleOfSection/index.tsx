import React, { ReactElement } from 'react';
import { LucideProps } from 'lucide-react'; 

interface TitleOfSectionProps {
  title: string;
  icon?: ReactElement<LucideProps>;
  className?: string; 
  iconColorClass?: string; 
}

const TitleOfSection: React.FC<TitleOfSectionProps> = ({
  title,
  icon,
  className = '',
  iconColorClass = 'text-indigo-600 dark:text-indigo-400' 
}) => {
  return (
    <div className={`flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 mb-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
        {title}
      </h3>

      {icon && (
        React.cloneElement(icon, {
          className: `w-5 h-5 ${iconColorClass} ${icon.props.className || ''}`
        })
      )}
    </div>
  );
};

export default TitleOfSection;