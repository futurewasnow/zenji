import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-jungle-green bg-opacity-95"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="flex flex-col items-center">
        <div className="w-40 h-40 rounded-full bg-mystic-purple flex items-center justify-center mb-6 overflow-hidden">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <svg 
              width="100" 
              height="100" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-zen-gold"
            >
              <path 
                d="M50 10C27.91 10 10 27.91 10 50C10 72.09 27.91 90 50 90C72.09 90 90 72.09 90 50C90 27.91 72.09 10 50 10ZM50 30C55.52 30 60 34.48 60 40C60 45.52 55.52 50 50 50C44.48 50 40 45.52 40 40C40 34.48 44.48 30 50 30ZM50 82C42.5 82 35.73 78.31 31.25 72.5C31.37 61.25 42.5 55 50 55C57.48 55 68.62 61.25 68.75 72.5C64.27 78.31 57.5 82 50 82Z" 
                fill="currentColor"
              />
            </svg>
          </motion.div>
        </div>
        
        <motion.h1 
          className="font-cinzel text-5xl text-zen-gold mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Z e n j i
        </motion.h1>
        
        <motion.div 
          className="animate-pulse mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <p className="text-white text-xl uppercase tracking-widest">LOADING</p>
        </motion.div>
        
        <motion.div 
          className="max-w-md text-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
        >
          <p className="text-white text-sm">The Zenji website needs a little time to load its key elements.</p>
          <p className="text-white text-sm mt-2">Please wait while we prepare your journey...</p>
          <p className="text-white text-sm mt-4">Thanks for your patience and enjoy this moment of Zen...</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;
