import styles from '../styles/CoursesPage.module.css';

const InstructorCard = ({ instructor, theme }) => {
  const cardClass = theme === 'dark'
    ? 'bg-gray-800 border-gray-700'
    : 'bg-white border-gray-200';
  
  return (
    <div className={`${styles.instructorCard} ${cardClass} rounded-lg border p-5`}>
      <div className="flex items-center mb-4">
        <img 
          src={instructor.image} 
          alt={instructor.name}
          className="w-16 h-16 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} font-bold`}>
            {instructor.name}
          </h4>
          <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-sm`}>
            {instructor.title}
          </p>
        </div>
      </div>
      
      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-sm mb-4`}>
        {instructor.bio}
      </p>
      
      <div className="flex items-center text-sm mb-3">
        <div className="flex items-center mr-4">
          <ion-icon name="star-outline" class="mr-1"></ion-icon>
          <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {instructor.rating} Instructor Rating
          </span>
        </div>
      </div>
      
      <div className="flex items-center text-sm mb-3">
        <div className="flex items-center mr-4">
          <ion-icon name="people-outline" class="mr-1"></ion-icon>
          <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {instructor.students.toLocaleString()} Students
          </span>
        </div>
      </div>
      
      <div className="flex items-center text-sm">
        <div className="flex items-center mr-4">
          <ion-icon name="document-text-outline" class="mr-1"></ion-icon>
          <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
            {instructor.courses} Courses
          </span>
        </div>
      </div>
      
      <button className={`${styles.viewProfileBtn} mt-4 w-full py-2 border rounded-lg ${
        theme === 'dark' 
          ? 'border-indigo-500 text-indigo-400 hover:bg-indigo-900/30' 
          : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
      } transition-colors duration-300`}>
        View Full Profile
      </button>
    </div>
  );
};

export default InstructorCard;