import { motion } from 'framer-motion';
import { Card as CardType } from '@/lib/game-engine';
import { cn } from '@/lib/utils';
import Card from '@/components/game/Card';

interface CardPileProps {
  name: string;
  cards: CardType[];
  isSelectable: boolean;
  onSelect: () => void;
  faceDown: boolean;
}

const CardPile = ({ name, cards, isSelectable, onSelect, faceDown }: CardPileProps) => {
  const isEmpty = cards.length === 0;
  const topCard = isEmpty ? null : cards[0];
  
  return (
    <div className="flex flex-col items-center space-y-2">
      <h3 className="font-cinzel text-sm text-jungle-green">{name}</h3>
      
      <motion.div
        className={cn(
          "relative w-20 h-28 rounded-lg",
          isSelectable && !isEmpty ? "cursor-pointer" : "cursor-default"
        )}
        whileHover={isSelectable && !isEmpty ? { scale: 1.05 } : {}}
        onClick={isSelectable && !isEmpty ? onSelect : undefined}
      >
        {isEmpty ? (
          <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-xs text-gray-400">Empty</span>
          </div>
        ) : (
          <>
            {/* Stacked cards for visual effect */}
            {cards.length > 1 && (
              <>
                <div className="absolute top-2 left-2 w-20 h-28 bg-jungle-green rounded-lg border-2 border-gray-400 transform rotate-3"></div>
                <div className="absolute top-1 left-1 w-20 h-28 bg-jungle-green rounded-lg border-2 border-gray-400 transform rotate-1"></div>
              </>
            )}
            
            {/* Top card */}
            {topCard && (
              <Card 
                card={topCard} 
                index={0} 
                faceDown={faceDown}
                isSelectable={isSelectable}
                onClick={() => {}}
                className="absolute top-0 left-0"
              />
            )}
            
            {/* Card count badge */}
            <div className="absolute -top-2 -right-2 bg-jungle-green text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {cards.length}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default CardPile;
