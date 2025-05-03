import { Helmet } from 'react-helmet-async';
import HeroSection from '@/components/home/HeroSection';
import OurStory from '@/components/home/OurStory';
import AboutZenji from '@/components/home/AboutZenji';
import GameContents from '@/components/home/GameContents';
import HowToPlay from '@/components/home/HowToPlay';
import Newsletter from '@/components/home/Newsletter';
import { useQuery } from '@tanstack/react-query';
import { Product } from '@shared/schema';
import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink, PlayCircle, ShoppingBag } from 'lucide-react';

const Home = () => {
  // Fetch featured products for the shop section
  const { data: products } = useQuery({
    queryKey: ['/api/products', 'featured'],
    queryFn: () => fetch('/api/products?featured=true').then(res => res.json())
  });
  
  return (
    <>
      <Helmet>
        <title>Zenji - The Journey of Remembering | Strategic Card Game</title>
        <meta 
          name="description" 
          content="Discover Zenji, a strategic card game where you manage your Monkey Mind, accumulate Elemental Points, and achieve Zen mastery. Shop now or play online!" 
        />
      </Helmet>
      
      <HeroSection />
      <OurStory />
      <AboutZenji />
      <GameContents />
      <HowToPlay />
      
      {/* Shop section */}
      <section id="zenji-shop" className="py-20 px-4 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-cinzel text-4xl text-center text-jungle-green mb-16">Zenji Shop</h2>
          
          <div className="grid md:grid-cols-2 gap-10 mb-16">
            {products && products.slice(0, 2).map((product: Product) => (
              <Card key={product.id} className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                <div className="relative">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-64 object-cover" 
                  />
                  <div className="absolute top-4 right-4 bg-zen-gold text-jungle-green text-sm font-bold px-3 py-1 rounded-full">
                    {product.id === 1 ? 'Basic Game' : 'Deluxe Edition'}
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="font-cinzel text-2xl text-jungle-green mb-2">{product.name}</h3>
                  <p className="text-gray-600 mb-4">
                    {product.description.substring(0, 100)}...
                  </p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-jungle-green">${Number(product.price).toFixed(2)}</span>
                    <span className="text-sm text-gray-500">Free shipping in select countries</span>
                  </div>
                  <div className="flex space-x-2 mb-6">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      In Stock
                    </span>
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Pre-orders available
                    </span>
                  </div>
                  <Link href="/shop">
                    <Button className="w-full bg-jungle-green text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition duration-300">
                      <ShoppingBag className="mr-2 h-5 w-5" />
                      View in Shop
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-bamboo-light rounded-lg p-8 text-center">
            <h3 className="font-cinzel text-2xl text-jungle-green mb-4">Join the Play-List!</h3>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              To find out if a ZENJI delivery is available in your country, simply sign up for our newsletter. 
              Currently, our primary focus is on COSTA RICA and BELGIUM.
            </p>
            <Link href="/shop">
              <Button className="bg-zen-gold text-jungle-green px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition duration-300">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Play Online section */}
      <section id="play-online" className="py-20 px-4 md:px-10 bg-gradient-to-b from-jungle-green via-[#113630] to-[#2c1a47] text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-cinzel text-4xl text-center text-zen-gold mb-4">Play Zenji Online</h2>
          <p className="text-center text-xl mb-16 max-w-3xl mx-auto">
            Experience the Journey of Remembering digitally with friends or AI opponents
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {/* Feature 1 */}
            <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center hover:transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 rounded-full bg-zen-gold text-jungle-green flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-users text-2xl"></i>
              </div>
              <h3 className="font-cinzel text-xl text-zen-gold mb-3">Multiplayer Mode</h3>
              <p className="text-sm text-white">
                Play with friends online in real-time matches for 2-4 players with full game rules and mechanics.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center hover:transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 rounded-full bg-zen-gold text-jungle-green flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-robot text-2xl"></i>
              </div>
              <h3 className="font-cinzel text-xl text-zen-gold mb-3">AI Opponents</h3>
              <p className="text-sm text-white">
                Practice against intelligent AI opponents with different difficulty levels to sharpen your Zenji skills.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white bg-opacity-20 rounded-lg p-6 text-center hover:transform hover:scale-105 transition duration-300">
              <div className="w-16 h-16 rounded-full bg-zen-gold text-jungle-green flex items-center justify-center mx-auto mb-4">
                <i className="fas fa-graduation-cap text-2xl"></i>
              </div>
              <h3 className="font-cinzel text-xl text-zen-gold mb-3">Interactive Tutorial</h3>
              <p className="text-sm text-white">
                Learn the game through our step-by-step interactive tutorial with guided gameplay experience.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Link href="/play">
              <Button className="bg-zen-gold text-jungle-green px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition duration-300 text-lg">
                <PlayCircle className="mr-2 h-5 w-5" />
                Play Now
              </Button>
            </Link>
            <Link href="/tutorial">
              <Button className="bg-white bg-opacity-20 text-white border-2 border-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-30 transition duration-300 text-lg">
                Start Tutorial
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Creators section */}
      <section id="creators" className="py-20 px-4 md:px-10 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-cinzel text-4xl text-center text-jungle-green mb-16">Meet the Creators</h2>
          
          <div className="text-center max-w-3xl mx-auto mb-16">
            <p className="text-gray-700 leading-relaxed">
              Zenji was born in the jungles of Costa Rica, created by a diverse group of game enthusiasts 
              dedicated to bringing mindfulness, strategy, and fun together in a unique card game experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            {/* Creator Card */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 text-center">
              <div className="p-6">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden flex items-center justify-center bg-gray-200">
                  <i className="fas fa-user-circle text-6xl text-gray-400"></i>
                </div>
                <h3 className="font-cinzel text-xl text-jungle-green mb-1">The Zenji Team</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  A collective of game designers, artists, and zen enthusiasts
                </p>
                <p className="text-gray-700 text-sm">
                  Visit our farm "Ojo de La Tigra" in Costa Rica to meet the team and experience the birthplace of Zenji!
                </p>
              </div>
            </div>
            
            {/* Location Card */}
            <div className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 text-center md:col-span-2">
              <div className="relative h-48">
                <img 
                  src="https://images.unsplash.com/photo-1605301277879-e99bd9175f88?q=80&w=800&auto=format&fit=crop" 
                  alt="Costa Rica Jungle" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="p-6">
                <h3 className="font-cinzel text-xl text-jungle-green mb-2">Ojo de La Tigra, Costa Rica</h3>
                <p className="text-gray-700 mb-4">
                  The birthplace of Zenji, a sanctuary of creativity nestled in the Costa Rican jungle 
                  where mindfulness and play come together.
                </p>
                <a 
                  href="http://www.ojodelatigra.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-jungle-green hover:text-zen-gold transition duration-300"
                >
                  <ExternalLink className="mr-1 h-4 w-4" /> Visit Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Newsletter />
    </>
  );
};

export default Home;
