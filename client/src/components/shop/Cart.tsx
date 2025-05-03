import { useState } from 'react';
import { Link } from 'wouter';
import { useCart } from '@/components/shop/CartProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const Cart = ({ isOpen, onClose }: CartProps) => {
  const { cartItems, removeFromCart, updateQuantity, totalPrice } = useCart();
  const [isCheckoutClicked, setIsCheckoutClicked] = useState(false);

  const handleCheckout = () => {
    setIsCheckoutClicked(true);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  const hasItems = cartItems.length > 0;

  return (
    <Card className="w-full max-w-md shadow-lg border-0">
      <CardHeader className="bg-jungle-green text-white p-4">
        <CardTitle className="flex items-center text-xl">
          <ShoppingCart className="mr-2 h-5 w-5" />
          Your Zenji Cart ({cartItems.reduce((acc, item) => acc + item.quantity, 0)} items)
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-4 max-h-[60vh] overflow-y-auto">
        {hasItems ? (
          <AnimatePresence>
            {cartItems.map((item) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-4"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 flex-shrink-0">
                    <img 
                      src={item.imageUrl} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{item.name}</h3>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} x {item.quantity}
                      </div>
                      <div className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeFromCart(item.productId)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Separator className="my-4" />
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="py-8 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <h3 className="font-medium text-lg mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-sm mb-4">
              Start your journey by adding some Zenji products to your cart.
            </p>
            <Link href="/shop">
              <Button 
                className="bg-jungle-green text-white hover:bg-jungle-green/90"
                onClick={onClose}
              >
                Browse Products
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
      
      {hasItems && (
        <CardFooter className="flex flex-col p-4 bg-gray-50">
          <div className="w-full flex justify-between items-center mb-4">
            <span className="font-medium">Subtotal:</span>
            <span className="font-bold text-lg">${totalPrice.toFixed(2)}</span>
          </div>
          <div className="w-full flex justify-between items-center mb-4 text-sm text-gray-500">
            <span>Shipping calculated at checkout</span>
          </div>
          <Link href="/checkout" className="w-full">
            <Button 
              className={`w-full bg-zen-gold text-jungle-green hover:bg-zen-gold/90 py-6 text-lg ${
                isCheckoutClicked ? 'animate-pulse' : ''
              }`}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </Button>
          </Link>
        </CardFooter>
      )}
    </Card>
  );
};

export default Cart;
