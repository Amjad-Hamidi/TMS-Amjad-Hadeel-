import { useTheme } from '@/context/ThemeContext';
import styles from '../styles/CoursesPage.module.css';

const CategorySection = ({ categories, onCategorySelect }) => {
  const { theme } = useTheme();
  
  const bgClass = theme === 'dark' ? 'bg-gray-50 dark:bg-[rgb(22,30,50)]' : 'bg-gray-50';
  const textClass = theme === 'dark' ? 'text-gray-200' : 'text-gray-800';
  
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Web Development': 'code-slash-outline',
      'Data Science': 'analytics-outline',
      'Business': 'briefcase-outline',
      'Design': 'color-palette-outline',
      'Marketing': 'megaphone-outline',
      'IT & Software': 'server-outline',
      'Personal Development': 'person-outline',
      'Project Management': 'clipboard-outline',
      'Language Learning': 'language-outline',
      'Health & Fitness': 'fitness-outline',
      'Music': 'musical-notes-outline',
      'Photography': 'camera-outline',
    };
    
    return iconMap[category] || 'school-outline';
  };
  
  return (
    <section className={`${bgClass} py-16 transition-colors duration-300`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-4 ${textClass}`}>Browse Categories</h2>
          <p className={`text-lg max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Explore our diverse range of course categories designed to meet your learning goals
          </p>
        </div>
        
        <div className={`${styles.categoriesGrid} grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6`}>
          {categories.map((category) => (
            <div 
              key={category.id} 
              className={`${styles.categoryCard} rounded-xl p-6 text-center cursor-pointer transition-all duration-300 ${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 text-white' 
                  : 'bg-white hover:bg-gray-50 text-gray-800'
              } border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} shadow-sm hover:shadow-md`}
              onClick={() => onCategorySelect(category.name)}
            >
              <div className={`${styles.categoryIcon} w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                theme === 'dark' 
                  ? 'bg-indigo-900/30 text-indigo-400' 
                  : 'bg-indigo-100 text-indigo-600'
              }`}>
                <ion-icon name={getCategoryIcon(category.name)} style={{fontSize: '28px'}}></ion-icon>
              </div>
              <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                {category.courseCount} courses
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <button 
            className={`${styles.outlineBtn} px-6 py-3 rounded-lg border ${
              theme === 'dark' 
                ? 'border-indigo-400 text-indigo-400 hover:bg-indigo-400 hover:text-gray-900' 
                : 'border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white'
            } transition-all duration-300`}
          >
            View All Categories
          </button>
        </div>
      </div>
    </section>
  );
};

export default CategorySection;