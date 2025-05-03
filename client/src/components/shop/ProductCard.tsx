import { useState } from 'react';
import { motion } from 'framer-motion';
import { Product } from '@shared/schema';
import { useCart } from '@/components/shop/CartProvider';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, cartItems, updateQuantity } = useCart();
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  
  // Check if product is already in cart
  const cartItem = cartItems.find(item => item.productId === product.id);
  
  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: product.imageUrl,
      quantity: 1
    });
    
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const incrementQuantity = () => {
    if (cartItem) {
      updateQuantity(product.id, cartItem.quantity + 1);
    }
  };
  
  const decrementQuantity = () => {
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(product.id, cartItem.quantity - 1);
    }
  };
  
  return (
    <motion.div 
      className="bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-64 object-cover transition-transform duration-300"
          style={{ transform: isHovered ? 'scale(1.05)' : 'scale(1)' }}
        />
        <div className="absolute top-4 right-4 bg-zen-gold text-jungle-green text-sm font-bold px-3 py-1 rounded-full">
          {product.featured ? 'Featured' : 'Zenji'}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="font-cinzel text-2xl text-jungle-green mb-2">{product.name}</h3>
        <p className="text-gray-600 mb-4 h-12 overflow-hidden">
          {product.description.substring(0, 70)}...
        </p>
        
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-jungle-green">${Number(product.price).toFixed(2)}</span>
          <span className="text-sm text-gray-500">
            {product.stockQuantity > 10 ? 'In Stock' : 
              product.stockQuantity > 0 ? `Only ${product.stockQuantity} left` : 'Out of Stock'}
          </span>
        </div>
        
        <div className="flex space-x-2 mb-6">
          {product.stockQuantity > 10 && (
            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
              In Stock
            </span>
          )}
          {product.stockQuantity <= 10 && product.stockQuantity > 0 && (
            <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Limited Stock
            </span>
          )}
          {product.stockQuantity === 0 && (
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Out of Stock
            </span>
          )}
          {product.featured && (
            <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2.5 py-0.5 rounded">
              Best Value
            </span>
          )}
        </div>
        
        {!cartItem ? (
          <Button 
            className="w-full bg-jungle-green text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition duration-300"
            onClick={handleAddToCart}
            disabled={product.stockQuantity === 0}
          >
            <ShoppingCart className="h-5 w-5 mr-2" />
            Add to Cart
          </Button>
        ) : (
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="icon"
              onClick={decrementQuantity}
              className="rounded-full"
            >
              <Minus className="h-4 w-4" />
            </Button>
            
            <span className="font-medium mx-4">{cartItem.quantity}</span>
            
            <Button
              variant="outline"
              size="icon"
              onClick={incrementQuantity}
              className="rounded-full"
              disabled={product.stockQuantity <= cartItem.quantity}
            >
              <Plus className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="default"
              className="ml-4 bg-jungle-green text-white rounded-lg font-bold hover:bg-opacity-90 transition duration-300"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;
