import { Link } from 'wouter';
import { motion } from 'framer-motion';

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center z-0"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1590682680695-43b964a3ae17?q=80&w=1200&auto=format&fit=crop')",
          filter: "brightness(0.7)"
        }}
      />
      
      <motion.div 
        className="relative z-10 text-center px-4 max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <div className="bg-black bg-opacity-50 p-8 rounded-lg backdrop-filter backdrop-blur-sm">
          <motion.h1 
            className="font-cinzel text-5xl md:text-7xl font-bold text-zen-gold mb-2 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            ZENJI
          </motion.h1>
          
          <motion.h2 
            className="font-cinzel text-2xl md:text-3xl text-white mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            The Journey of Remembering
          </motion.h2>
          
          <motion.p 
            className="text-white text-lg mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            A strategic card game where you manage your Monkey Mind, accumulate Elemental Points, and achieve Zen mastery.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.1 }}
          >
            <Link href="/shop" className="bg-zen-gold text-jungle-green px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition duration-300 text-lg">
              Shop Now
            </Link>
            
            <Link href="/play" className="bg-white bg-opacity-20 text-white border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-30 transition duration-300 text-lg">
              Play Online
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
