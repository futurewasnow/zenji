import { Link } from 'wouter';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white py-12 px-4 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-cinzel text-xl text-zen-gold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#our-story" className="hover:text-zen-gold transition duration-300">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/#about-zenji" className="hover:text-zen-gold transition duration-300">
                  About Zenji
                </Link>
              </li>
              <li>
                <Link href="/#how-to-play" className="hover:text-zen-gold transition duration-300">
                  How to Play
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-zen-gold transition duration-300">
                  Shop
                </Link>
              </li>
              <li>
                <Link href="/play" className="hover:text-zen-gold transition duration-300">
                  Play Online
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-cinzel text-xl text-zen-gold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/#how-to-play" className="hover:text-zen-gold transition duration-300">
                  Game Rules
                </Link>
              </li>
              <li>
                <Link href="/tutorial" className="hover:text-zen-gold transition duration-300">
                  Tutorial
                </Link>
              </li>
              <li>
                <a 
                  href="https://drive.google.com/file/d/13J5QPeW30DGftCyIheZXXQOPDb0y9Fdh/view" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-zen-gold transition duration-300"
                >
                  Rules PDF
                </a>
              </li>
              <li>
                <Link href="mailto:support@playzenji.com" className="hover:text-zen-gold transition duration-300">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-cinzel text-xl text-zen-gold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-zen-gold transition duration-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-zen-gold transition duration-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/terms#refunds" className="hover:text-zen-gold transition duration-300">
                  Refund Policy
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-cinzel text-xl text-zen-gold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="http://www.instagram.com/playzenji" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-zen-gold transition duration-300 flex items-center"
                >
                  <i className="fab fa-instagram mr-2"></i> Instagram
                </a>
              </li>
              <li>
                <a 
                  href="https://www.youtube.com/watch?v=B42_K_gNoZI" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-zen-gold transition duration-300 flex items-center"
                >
                  <i className="fab fa-youtube mr-2"></i> YouTube
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@playzenji.com" 
                  className="hover:text-zen-gold transition duration-300 flex items-center"
                >
                  <i className="fas fa-envelope mr-2"></i> Email
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-10 pt-6 text-center text-gray-400 text-sm">
          <p>Copyright © {currentYear} Play Zenji - All Rights Reserved.</p>
          <p className="mt-2">Made with ❤️ in Costa Rica & Belgium</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
