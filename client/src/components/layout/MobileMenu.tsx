import { useEffect } from 'react';
import { Link } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  // Close menu when clicking outside
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="md:hidden fixed inset-0 bg-jungle-green bg-opacity-95 z-50"
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="flex justify-end p-6">
            <button 
              onClick={onClose}
              className="text-white focus:outline-none"
              aria-label="Close menu"
            >
              <i className="fas fa-times text-2xl"></i>
            </button>
          </div>
          
          <div className="flex flex-col items-center space-y-6 mt-10 text-white text-xl">
            <Link href="/#our-story" onClick={onClose} className="hover:text-zen-gold transition duration-300">
              Our Story
            </Link>
            <Link href="/#about-zenji" onClick={onClose} className="hover:text-zen-gold transition duration-300">
              About Zenji
            </Link>
            <Link href="/#how-to-play" onClick={onClose} className="hover:text-zen-gold transition duration-300">
              How to Play
            </Link>
            <Link href="/shop" onClick={onClose} className="hover:text-zen-gold transition duration-300">
              Shop
            </Link>
            <Link href="/play" onClick={onClose} className="hover:text-zen-gold transition duration-300">
              Play Online
            </Link>
            <Link href="/tutorial" onClick={onClose} className="hover:text-zen-gold transition duration-300">
              Tutorial
            </Link>
            
            <a 
              href="http://www.instagram.com/playzenji" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center mt-8 text-zen-gold"
            >
              <i className="fab fa-instagram text-2xl mr-2"></i>
              <span>Follow us on Instagram</span>
            </a>
            
            <Link 
              href="/shop" 
              onClick={onClose}
              className="mt-4 bg-zen-gold text-jungle-green px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition duration-300"
            >
              Shop Now
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;
