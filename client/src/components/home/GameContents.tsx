import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Check } from 'lucide-react';

const GameContents = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <section id="game-contents" className="py-20 px-4 md:px-10 bg-white" ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="font-cinzel text-4xl text-center text-jungle-green mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Game Contents
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-cinzel text-2xl text-earth-brown mb-6">What's in your Zenji box?</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="bg-zen-gold rounded-full p-1 mt-1 mr-3">
                  <Check className="h-4 w-4 text-jungle-green" />
                </div>
                <div>
                  <span className="font-medium">A STARTER'S DECK with 61 cards:</span>
                  <ul className="ml-8 mt-2 space-y-2 list-disc text-gray-700">
                    <li>52 elemental playing cards</li>
                    <li>4 Avatar cards (Earth, Fire, Water and Air)</li>
                    <li>4 Zero Mind cards</li>
                    <li>1 ZENJI card (Zenji, the meditating monkey!)</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-zen-gold rounded-full p-1 mt-1 mr-3">
                  <Check className="h-4 w-4 text-jungle-green" />
                </div>
                <div>
                  <span className="font-medium">THE EXPANSION PACK:</span>
                  <ul className="ml-8 mt-2 space-y-2 list-disc text-gray-700">
                    <li>20 magic cards to expand your gameplay!</li>
                  </ul>
                </div>
              </li>
              <li className="flex items-start">
                <div className="bg-zen-gold rounded-full p-1 mt-1 mr-3">
                  <Check className="h-4 w-4 text-jungle-green" />
                </div>
                <div>
                  <span className="font-medium">Also included:</span>
                  <ul className="ml-8 mt-2 space-y-2 list-disc text-gray-700">
                    <li>Rule book in multiple languages</li>
                    <li>Reference cards for quick play</li>
                  </ul>
                </div>
              </li>
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1576769267415-9b497cdf1f27?q=80&w=800&auto=format&fit=crop" 
                alt="Zenji card deck" 
                className="w-full h-auto rounded-lg shadow-lg" 
              />
              <div className="absolute -bottom-6 -right-6 bg-zen-gold text-jungle-green rounded-full w-24 h-24 flex items-center justify-center font-bold transform rotate-12">
                <div className="text-center">
                  <div className="text-sm">INCLUDES</div>
                  <div>EXPANSION</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default GameContents;
