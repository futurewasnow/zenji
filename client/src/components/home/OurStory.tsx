import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const OurStory = () => {
  const [ref1, inView1] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const [ref2, inView2] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  return (
    <section id="our-story" className="py-20 px-4 md:px-10 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.h2 
          className="font-cinzel text-4xl text-center text-jungle-green mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          Our Story
        </motion.h2>
        
        <div className="grid md:grid-cols-2 gap-12 items-center" ref={ref1}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView1 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="font-cinzel text-2xl text-earth-brown mb-6">The Beginning</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              Zenji started in Costa Rica in 2020 with a group of card game enthusiasts who wanted to share their love of play with others. Starting with just a few home games, we slowly grew into a thriving gaming community with a love for games and jungle fun!
            </p>
            <p className="text-gray-700 leading-relaxed">
              Now, after many years of playing Zenji at our farm 'Ojo de La Tigra', we are ready to share this creation with the rest of the world!
            </p>
          </motion.div>
          
          <motion.div 
            className="order-first md:order-last"
            initial={{ opacity: 0, x: 30 }}
            animate={inView1 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=800&auto=format&fit=crop" 
              alt="Jungle setting in Costa Rica" 
              className="w-full h-auto rounded-lg shadow-lg" 
            />
          </motion.div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-12 items-center mt-20" ref={ref2}>
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView2 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img 
              src="https://images.unsplash.com/photo-1517398741578-e8e2a528e255?q=80&w=800&auto=format&fit=crop" 
              alt="People playing Zenji" 
              className="w-full h-auto rounded-lg shadow-lg" 
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={inView2 ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h3 className="font-cinzel text-2xl text-earth-brown mb-6">The Vision</h3>
            <p className="text-gray-700 leading-relaxed mb-4">
              We believe that games are more than just a pastime—they're like magic portals to connect with others, learn new skills, and bring loads of fun!
            </p>
            <p className="text-gray-700 leading-relaxed">
              We are committed to providing other players worldwide with high-quality, mindful games, and to promoting the benefits of games to people of all ages and backgrounds. Let's play!
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurStory;
