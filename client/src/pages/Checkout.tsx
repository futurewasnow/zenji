import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation } from 'wouter';
import { Elements } from '@stripe/react-stripe-js';
import getStripe from '@/lib/stripe-client';
import { createPaymentIntent } from '@/lib/stripe-client';
import { useCart } from '@/components/shop/CartProvider';
import CheckoutForm from '@/components/shop/CheckoutForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, ShoppingCart, CreditCard, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const Checkout = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);
  const { cartItems, totalPrice } = useCart();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // Redirect to shop if cart is empty
    if (cartItems.length === 0) {
      setLocation('/shop');
      return;
    }
    
    // Create payment intent
    const getPaymentIntent = async () => {
      try {
        setLoading(true);
        const response = await createPaymentIntent({
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          }))
        });
        
        setClientSecret(response.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
      } finally {
        setLoading(false);
      }
    };
    
    getPaymentIntent();
  }, [cartItems, setLocation]);
  
  if (loading) {
    return (
      <div className="min-h-[calc(100vh-16rem)] bg-bamboo-light flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-jungle-green border-t-transparent rounded-full" />
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Checkout - Zenji Card Game</title>
        <meta 
          name="description"
          content="Complete your purchase of Zenji, the strategic card game where mindfulness meets strategy."
        />
        <meta name="robots" content="noindex" /> {/* Don't index checkout page */}
      </Helmet>
      
      <div className="min-h-[calc(100vh-16rem)] bg-bamboo-light py-8 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="flex items-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/shop">
              <Button variant="ghost" className="mr-4">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Shop
              </Button>
            </Link>
            
            <h1 className="font-cinzel text-2xl text-jungle-green">Checkout</h1>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left side - Checkout form */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="shadow-md">
                <CardHeader className="bg-jungle-green text-white">
                  <CardTitle className="flex items-center">
                    <CreditCard className="mr-2 h-5 w-5" />
                    Payment Information
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  {clientSecret && (
                    <Elements stripe={getStripe()} options={{ clientSecret }}>
                      <CheckoutForm />
                    </Elements>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex items-center justify-center mt-6 text-gray-600 text-sm">
                <ShieldCheck className="h-4 w-4 mr-2 text-jungle-green" />
                Secure payment powered by Stripe
              </div>
            </motion.div>
            
            {/* Right side - Order summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="shadow-md">
                <CardHeader className="bg-jungle-green text-white">
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item.productId} className="flex justify-between items-center">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded overflow-hidden mr-3">
                            <img 
                              src={item.imageUrl} 
                              alt={item.name} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <div className="font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">Calculated at next step</span>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Estimated Total</span>
                      <span className="text-jungle-green">${totalPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h3 className="font-cinzel text-amber-800 mb-2">Shipping Information</h3>
                <p className="text-sm text-amber-700">
                  Currently shipping to Costa Rica and Belgium. More countries will be added soon.
                  Pre-orders will be shipped by December 2024.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
