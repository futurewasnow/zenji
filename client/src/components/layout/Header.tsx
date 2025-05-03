import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import MobileMenu from './MobileMenu';
import { useCart } from '@/components/shop/CartProvider';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  const { cartItems } = useCart();
  
  // Calculate total items in cart
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className="relative z-50">
      <nav className={`${
          isScrolled ? 'py-2 shadow-md' : 'py-4'
        } bg-jungle-green text-white px-4 md:px-10 flex items-center justify-between fixed w-full top-0 transition-all duration-300`}
      >
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <span className="font-cinzel text-3xl text-zen-gold">Z</span>
            <span className="font-cinzel text-xl text-white ml-1">enji</span>
          </Link>
        </div>
        
        <div className="hidden md:flex space-x-6 items-center">
          <Link href="/#our-story" className="hover:text-zen-gold transition duration-300">
            Our Story
          </Link>
          <Link href="/#about-zenji" className="hover:text-zen-gold transition duration-300">
            About Zenji
          </Link>
          <Link href="/#how-to-play" className="hover:text-zen-gold transition duration-300">
            How to Play
          </Link>
          <Link href="/shop" className={`hover:text-zen-gold transition duration-300 ${location === '/shop' ? 'text-zen-gold' : ''}`}>
            Shop
          </Link>
          <Link href="/play" className={`hover:text-zen-gold transition duration-300 ${location === '/play' ? 'text-zen-gold' : ''}`}>
            Play Online
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <a 
            href="http://www.instagram.com/playzenji" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white hover:text-zen-gold transition duration-300"
            aria-label="Zenji Instagram"
          >
            <i className="fab fa-instagram text-xl"></i>
          </a>
          
          <Link href="/shop" className="relative">
            <Button
              size="icon"
              variant="ghost"
              className="text-white hover:text-zen-gold hover:bg-transparent"
              aria-label="View Cart"
            >
              <ShoppingCart size={20} />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </Link>
          
          <Link href="/shop" className="bg-zen-gold text-jungle-green px-4 py-2 rounded hover:bg-opacity-90 transition duration-300 font-medium hidden sm:inline-block">
            Buy Now
          </Link>
          
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden text-white focus:outline-none"
            aria-label="Open menu"
          >
            <i className="fas fa-bars text-2xl"></i>
          </button>
        </div>
      </nav>
      
      <div className="h-16" aria-hidden="true"></div>
      
      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
    </header>
  );
};

export default Header;
