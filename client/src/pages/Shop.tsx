import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ProductGrid from '@/components/shop/ProductGrid';
import Cart from '@/components/shop/Cart';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ShoppingCart, AlertCircle } from 'lucide-react';
import { useCart } from '@/components/shop/CartProvider';
import { useMobile } from '@/hooks/use-mobile';

const Shop = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { cartItems } = useCart();
  const isMobile = useMobile();
  
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  
  return (
    <>
      <Helmet>
        <title>Shop Zenji - Card Game & Expansions</title>
        <meta 
          name="description"
          content="Shop for Zenji card game sets, expansions, and accessories. Embark on the journey of remembering with our mindful strategy card game."
        />
      </Helmet>
      
      <div className="bg-jungle-green py-16 px-4 md:px-10 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-cinzel text-4xl md:text-5xl text-zen-gold mb-4">
              Zenji Shop
            </h1>
            <p className="text-lg md:text-xl mb-6">
              Begin your journey of remembering with our mindful strategy card game
            </p>
          </motion.div>
        </div>
      </div>
      
      <div className="py-12 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Main content - Product list */}
            <div className="flex-grow">
              <Alert className="mb-8">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Pre-orders available!</AlertTitle>
                <AlertDescription>
                  Zenji cards are currently available for pre-order. Shipping to Costa Rica and Belgium is guaranteed,
                  with more countries to be added soon.
                </AlertDescription>
              </Alert>
              
              <ProductGrid />
            </div>
            
            {/* Cart sidebar - desktop view */}
            {!isMobile && (
              <Card className="w-96 h-fit flex-shrink-0 sticky top-24">
                <CardHeader className="bg-jungle-green text-white p-4">
                  <CardTitle className="flex items-center text-xl">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Your Cart ({cartItemCount})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Cart />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile cart drawer */}
      {isMobile && (
        <>
          <Drawer open={isCartOpen} onOpenChange={setIsCartOpen}>
            <DrawerContent>
              <div className="py-4">
                <Cart onClose={() => setIsCartOpen(false)} />
              </div>
            </DrawerContent>
          </Drawer>
          
          <div className="fixed bottom-4 right-4 z-50">
            <Button 
              onClick={() => setIsCartOpen(true)}
              className="h-14 w-14 rounded-full bg-zen-gold text-jungle-green hover:bg-zen-gold/90 shadow-lg"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                  {cartItemCount}
                </span>
              )}
            </Button>
          </div>
        </>
      )}
    </>
  );
};

export default Shop;
