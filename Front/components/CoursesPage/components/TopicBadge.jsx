const TopicBadge = ({ topic, theme }) => {
    // Get badge color based on topic
    const getBadgeColor = () => {
      const topicColors = {
        'JavaScript': theme === 'dark' ? 'bg-yellow-900/50 text-yellow-400' : 'bg-yellow-100 text-yellow-800',
        'React': theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-800',
        'Node.js': theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800',
        'Python': theme === 'dark' ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-800',
        'Marketing': theme === 'dark' ? 'bg-orange-900/50 text-orange-400' : 'bg-orange-100 text-orange-800',
        'SEO': theme === 'dark' ? 'bg-pink-900/50 text-pink-400' : 'bg-pink-100 text-pink-800',
        'Design': theme === 'dark' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-100 text-indigo-800',
        'SQL': theme === 'dark' ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-800',
        'Data Science': theme === 'dark' ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-800',
        'Management': theme === 'dark' ? 'bg-teal-900/50 text-teal-400' : 'bg-teal-100 text-teal-800',
        'AI': theme === 'dark' ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-800',
        'Photography': theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-800',
        'Writing': theme === 'dark' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-800',
        'Finance': theme === 'dark' ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-800',
      };
      
      return topicColors[topic] || (theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-200 text-gray-800');
    };
    
    return (
      <span className={`inline-block px-2 py-1 text-xs font-medium rounded mr-2 mb-2 ${getBadgeColor()}`}>
        {topic}
      </span>
    );
  };
  
  export default TopicBadge;