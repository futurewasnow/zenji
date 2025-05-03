import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'wouter';

// Element icons
import { Sprout, Flame, Droplets, Wind } from 'lucide-react';

const AboutZenji = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  // Animation variants for elements
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };
  
  return (
    <section id="about-zenji" className="py-20 px-4 md:px-10 bg-gradient-zen">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="font-cinzel text-4xl text-center text-jungle-green mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          About Zenji
        </motion.h2>
        
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p className="text-gray-700 text-lg leading-relaxed">
            The "Journey of Remembering" in Zenji is about strategically managing one's Monkey Mind, accumulating Elemental Points, and outsmarting opponents. Through careful card selection, calculated risks, and mindful decisions, players strive to clear their minds and achieve Zen mastery.
          </p>
          <p className="text-xl font-medium text-mystic-purple mt-8">
            Always guided by four mystical allies, the avatars of AIR, EARTH, WATER and FIRE!
          </p>
        </motion.div>
        
        <motion.div 
          ref={ref}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          variants={container}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
        >
          {/* Earth Element */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-6 text-center hover:transform hover:scale-105 transition duration-300"
            variants={item}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-jungle-green">
              <Sprout className="h-10 w-10 text-zen-gold" />
            </div>
            <h3 className="font-cinzel text-xl mb-2">EARTH</h3>
            <p className="text-sm text-gray-600">Stability & Growth</p>
          </motion.div>
          
          {/* Flame Element */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-6 text-center hover:transform hover:scale-105 transition duration-300"
            variants={item}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-fire-red">
              <Flame className="h-10 w-10 text-white" />
            </div>
            <h3 className="font-cinzel text-xl mb-2">FIRE</h3>
            <p className="text-sm text-gray-600">Passion & Energy</p>
          </motion.div>
          
          {/* Water Element */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-6 text-center hover:transform hover:scale-105 transition duration-300"
            variants={item}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-water-blue">
              <Droplets className="h-10 w-10 text-white" />
            </div>
            <h3 className="font-cinzel text-xl mb-2">WATER</h3>
            <p className="text-sm text-gray-600">Flow & Adaptability</p>
          </motion.div>
          
          {/* Air Element */}
          <motion.div 
            className="bg-white rounded-lg shadow-lg p-6 text-center hover:transform hover:scale-105 transition duration-300"
            variants={item}
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-sky-400">
              <Wind className="h-10 w-10 text-white" />
            </div>
            <h3 className="font-cinzel text-xl mb-2">AIR</h3>
            <p className="text-sm text-gray-600">Freedom & Clarity</p>
          </motion.div>
        </motion.div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/shop" className="inline-block bg-jungle-green text-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition duration-300 text-lg">
            Pre-order your ZENJI deck!
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutZenji;
