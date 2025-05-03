import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { PlayCircle, Download } from 'lucide-react';

const HowToPlay = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <section id="how-to-play" className="py-20 px-4 md:px-10 bg-gradient-to-b from-jungle-green to-mystic-purple text-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="font-cinzel text-4xl text-center text-zen-gold mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          How to Play?
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-16 items-center mb-16" ref={ref}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-cinzel text-2xl text-zen-gold mb-6">Zenji's Objective</h3>
            <p className="mb-4 leading-relaxed">
              The first player to score 15 ELEMENTAL POINTS wins the game!
            </p>
            <p className="mb-6 leading-relaxed">
              Zenji is a card game for 2-4 players where the goal is to become the Zen master by collecting Elemental Points (EP). The game utilizes a unique "Monkey Mind" and "Higher Mind" mechanic where players aim to minimize points in their "Monkey Mind" to transfer EP cards to their scorecard from their "Higher Mind."
            </p>
            <div className="p-4 bg-white bg-opacity-10 rounded-lg mb-6">
              <h4 className="font-cinzel text-xl text-zen-gold mb-2">Zenji's Golden Rule:</h4>
              <p className="text-lg italic text-center">" LESS IS MORE "</p>
              <p className="text-sm mt-2 text-center">
                The players with LESS monkey points in their monkey mind will score MORE elemental points from the higher mind.
              </p>
            </div>
            <div className="flex justify-center">
              <Link href="/tutorial" className="flex items-center bg-zen-gold text-jungle-green px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition duration-300">
                <PlayCircle className="mr-2 h-5 w-5" /> Play Tutorial
              </Link>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <h3 className="font-cinzel text-xl text-zen-gold mb-4">Basic Gameplay Summary</h3>
              <ul className="space-y-4">
                <li className="flex">
                  <span className="bg-zen-gold text-jungle-green rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">1</span>
                  <span>Each player has a "Monkey Mind" (4 cards) and a "Higher Mind" (initially empty).</span>
                </li>
                <li className="flex">
                  <span className="bg-zen-gold text-jungle-green rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">2</span>
                  <span>On your turn, draw a card from the Future pile or Past pile.</span>
                </li>
                <li className="flex">
                  <span className="bg-zen-gold text-jungle-green rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">3</span>
                  <span>Exchange cards in your Monkey Mind, moving EP cards to your Higher Mind.</span>
                </li>
                <li className="flex">
                  <span className="bg-zen-gold text-jungle-green rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">4</span>
                  <span>"Knock Out" matching cards to empty your Monkey Mind faster.</span>
                </li>
                <li className="flex">
                  <span className="bg-zen-gold text-jungle-green rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">5</span>
                  <span>Call "Zenji" when you think you have the lowest points in your Monkey Mind.</span>
                </li>
                <li className="flex">
                  <span className="bg-zen-gold text-jungle-green rounded-full w-6 h-6 flex items-center justify-center mr-3 flex-shrink-0">6</span>
                  <span>Score EP cards from your Higher Mind to your scorecard.</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <a 
                  href="https://drive.google.com/file/d/13J5QPeW30DGftCyIheZXXQOPDb0y9Fdh/view" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-zen-gold hover:underline inline-flex items-center"
                >
                  <Download className="mr-2 h-5 w-5" /> Download Rules PDF
                </a>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div id="instructional-video" className="max-w-4xl mx-auto">
          <motion.h3 
            className="font-cinzel text-2xl text-zen-gold text-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Instructional Video
          </motion.h3>
          <motion.div 
            className="relative pb-[56.25%] h-0 rounded-lg overflow-hidden shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <iframe 
              className="absolute top-0 left-0 w-full h-full" 
              src="https://www.youtube.com/embed/B42_K_gNoZI" 
              title="ZENJI BASIC GAMEPLAY : THE COMPLETE TUTORIAL" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowToPlay;
