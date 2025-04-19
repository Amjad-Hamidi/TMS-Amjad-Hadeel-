import { useTheme } from '@/context/ThemeContext';
import styles from '../styles/JobsPage.module.css';

const JobBanner = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`${styles.jobBanner} relative overflow-hidden ${theme === 'dark' ? 'bg-[rgb(16,23,42)]' : 'bg-indigo-700'}`}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className={`${styles.bannerCircle} absolute -top-20 -right-20 w-64 h-64 rounded-full ${theme === 'dark' ? 'bg-indigo-900/30' : 'bg-indigo-600/50'}`}></div>
        <div className={`${styles.bannerCircle} absolute -bottom-40 -left-20 w-80 h-80 rounded-full ${theme === 'dark' ? 'bg-purple-900/30' : 'bg-purple-600/50'}`}></div>
        <div className={`${styles.bannerCircle} absolute top-1/2 left-1/3 w-40 h-40 rounded-full ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-600/30'}`}></div>
      </div>
      
      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
            Join ChanceBridge and Shape the Future of Learning
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Discover opportunities to advance your career and make an impact in the world of learning and development
          </p>
          <div className={styles.jobStats}>
            <div className="flex justify-center flex-wrap gap-6 md:gap-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">150+</div>
                <div className="text-white/80">Open Positions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">50+</div>
                <div className="text-white/80">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">20+</div>
                <div className="text-white/80">Countries</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">98%</div>
                <div className="text-white/80">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobBanner;