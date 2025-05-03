import { motion } from 'framer-motion';
import { Card as CardType } from '@/lib/game-engine';
import { cn } from '@/lib/utils';
import { Sprout, Flame, Droplets, Wind, Eye, Shuffle, ArrowLeftRight, Shield, Search, Gem } from 'lucide-react';

interface CardProps {
  card: CardType;
  index: number;
  faceDown?: boolean;
  isSelected?: boolean;
  isSelectable?: boolean;
  onClick?: () => void;
  className?: string;
}

const Card = ({
  card,
  index,
  faceDown = false,
  isSelected = false,
  isSelectable = true,
  onClick,
  className,
}: CardProps) => {
  // Get element icon based on card's element
  const getElementIcon = () => {
    switch (card.element) {
      case 'earth':
        return <Sprout className="h-6 w-6 text-jungle-green" />;
      case 'fire':
        return <Flame className="h-6 w-6 text-fire-red" />;
      case 'water':
        return <Droplets className="h-6 w-6 text-water-blue" />;
      case 'air':
        return <Wind className="h-6 w-6 text-sky-400" />;
      default:
        return null;
    }
  };
  
  // Get power icon based on card's power
  const getPowerIcon = () => {
    if (!card.power) return null;
    
    switch (card.power) {
      case 'peek':
        return <Eye className="h-4 w-4" />;
      case 'swap':
        return <Shuffle className="h-4 w-4" />;
      case 'steal':
        return <ArrowLeftRight className="h-4 w-4" />;
      case 'block':
        return <Shield className="h-4 w-4" />;
      case 'view':
        return <Search className="h-4 w-4" />;
      case 'transmute':
        return <Gem className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  // Get background color based on card's element
  const getCardBackground = () => {
    if (faceDown) return 'bg-jungle-green';
    
    switch (card.element) {
      case 'earth':
        return 'bg-gradient-to-br from-jungle-green/20 to-leaf-green/20 border-jungle-green';
      case 'fire':
        return 'bg-gradient-to-br from-fire-red/20 to-orange-300/20 border-fire-red';
      case 'water':
        return 'bg-gradient-to-br from-water-blue/20 to-blue-300/20 border-water-blue';
      case 'air':
        return 'bg-gradient-to-br from-sky-400/20 to-sky-200/20 border-sky-400';
      default:
        return 'bg-gradient-to-br from-mystic-purple/20 to-purple-300/20 border-mystic-purple';
    }
  };
  
  // Get text color based on card's element
  const getTextColor = () => {
    switch (card.element) {
      case 'earth':
        return 'text-jungle-green';
      case 'fire':
        return 'text-fire-red';
      case 'water':
        return 'text-water-blue';
      case 'air':
        return 'text-sky-600';
      default:
        return 'text-mystic-purple';
    }
  };
  
  return (
    <motion.div
      className={cn(
        "relative w-20 h-28 rounded-lg border-2 overflow-hidden cursor-pointer transition-all duration-200 card-shadow",
        getCardBackground(),
        isSelected && "ring-4 ring-zen-gold",
        !isSelectable && "opacity-70 cursor-default",
        className
      )}
      whileHover={isSelectable ? { scale: 1.05 } : {}}
      onClick={isSelectable ? onClick : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      {faceDown ? (
        // Back of card
        <div className="w-full h-full flex items-center justify-center">
          <span className="font-cinzel text-2xl text-zen-gold">Z</span>
        </div>
      ) : (
        // Front of card
        <div className="w-full h-full p-1 flex flex-col">
          <div className="flex justify-between items-center mb-1">
            <div className="w-6 h-6 flex items-center justify-center">
              {getElementIcon()}
            </div>
            <div className={`text-sm font-bold ${getTextColor()}`}>
              {card.value > 0 ? card.value : card.value === 0 ? '0' : card.value}
            </div>
          </div>
          
          <div className="flex-grow flex items-center justify-center">
            {card.type === 'avatar' ? (
              <div className="text-center">
                <div className="font-cinzel text-xs">Avatar</div>
                <div className={`text-xs capitalize ${getTextColor()}`}>{card.element}</div>
              </div>
            ) : (
              card.type === 'zen' ? (
                <div className="text-center">
                  <div className="font-cinzel text-xs">Zen</div>
                  <div className={`text-xs ${getTextColor()}`}>{card.name}</div>
                </div>
              ) : (
                <div className="text-center">
                  <div className={`text-xs capitalize ${getTextColor()}`}>{card.element}</div>
                  {card.value <= 4 && (
                    <div className="text-xs">EP {card.value}</div>
                  )}
                </div>
              )
            )}
          </div>
          
          {card.power && (
            <div className="text-xs bg-white/70 rounded-sm px-1 flex items-center justify-center">
              {getPowerIcon()}
              <span className="ml-1 capitalize">{card.power}</span>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default Card;
