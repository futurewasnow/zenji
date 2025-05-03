import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { useCart } from '@/components/shop/CartProvider';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Home, ShoppingCart, Calendar, Truck } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderConfirmation = () => {
  const [, params] = useRoute('/order-confirmation/:orderId');
  const orderId = params?.orderId;
  const { clearCart } = useCart();
  const [orderEmail, setOrderEmail] = useState('');
  
  // Fetch order details
  const { data: order, isLoading, isError } = useQuery({
    queryKey: [`/api/orders/${orderId}`],
    enabled: !!orderId,
  });
  
  useEffect(() => {
    // Clear cart on successful order confirmation page load
    clearCart();
    
    // Store email for newsletter signup if available
    if (order?.customerEmail) {
      setOrderEmail(order.customerEmail);
    }
  }, [clearCart, order]);
  
  // Handle newsletter signup
  const handleNewsletterSignup = async () => {
    if (!orderEmail) return;
    
    try {
      await apiRequest('POST', '/api/newsletter/subscribe', { email: orderEmail });
      setOrderEmail(''); // Clear email after signup
    } catch (error) {
      console.error('Newsletter signup failed:', error);
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-16rem)] bg-bamboo-light flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-jungle-green border-t-transparent rounded-full" />
      </div>
    );
  }
  
  if (isError || !order) {
    return (
      <div className="min-h-[calc(100vh-16rem)] bg-bamboo-light py-8 px-4 md:px-10">
        <div className="max-w-xl mx-auto text-center">
          <h1 className="font-cinzel text-2xl text-jungle-green mb-4">Order Not Found</h1>
          <p className="mb-6">Sorry, we couldn't find the order you're looking for.</p>
          <Link href="/shop">
            <Button className="bg-zen-gold text-jungle-green hover:bg-zen-gold/90">
              Return to Shop
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <>
      <Helmet>
        <title>Order Confirmed - Zenji Card Game</title>
        <meta 
          name="description"
          content="Your Zenji order has been confirmed. Thank you for your purchase!"
        />
        <meta name="robots" content="noindex" /> {/* Don't index order pages */}
      </Helmet>
      
      <div className="min-h-[calc(100vh-16rem)] bg-bamboo-light py-8 px-4 md:px-10">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="font-cinzel text-3xl text-jungle-green mb-2">Order Confirmed!</h1>
            <p className="text-gray-600">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="mb-6 shadow-md">
              <CardHeader className="bg-jungle-green text-white">
                <CardTitle>Order Details</CardTitle>
                <CardDescription className="text-gray-200">
                  Order #{orderId}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-jungle-green" />
                      Order Date
                    </h3>
                    <p className="text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-gray-700 mb-2 flex items-center">
                      <Truck className="h-4 w-4 mr-2 text-jungle-green" />
                      Shipping Address
                    </h3>
                    <p className="text-gray-600">
                      {order.shippingAddress}
                    </p>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <h3 className="font-medium text-gray-700 mb-4">Order Summary</h3>
                
                <div className="space-y-4">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div>
                          <p className="font-medium">{item.product.name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="font-medium">
                        ${Number(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-jungle-green">${Number(order.total).toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-white rounded-lg p-6 shadow-md mb-8"
          >
            <h2 className="font-cinzel text-xl text-jungle-green mb-4">What's Next?</h2>
            <div className="space-y-3">
              <p className="text-gray-600">
                <span className="font-medium">1.</span> You'll receive an order confirmation email shortly.
              </p>
              <p className="text-gray-600">
                <span className="font-medium">2.</span> Your order is being prepared for shipping.
              </p>
              <p className="text-gray-600">
                <span className="font-medium">3.</span> Pre-orders will be shipped by December 2024.
              </p>
              <p className="text-gray-600">
                <span className="font-medium">4.</span> You'll receive another email with tracking information once your order ships.
              </p>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col md:flex-row justify-center gap-4"
          >
            <Link href="/">
              <Button className="w-full md:w-auto bg-jungle-green hover:bg-jungle-green/90">
                <Home className="mr-2 h-4 w-4" />
                Return Home
              </Button>
            </Link>
            
            <Link href="/shop">
              <Button className="w-full md:w-auto" variant="outline">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default OrderConfirmation;
