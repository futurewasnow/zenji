import { Player } from '@/lib/game-engine';
import Card from '@/components/game/Card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Gavel, Brain, Award, Lock } from 'lucide-react';

interface PlayerAreaProps {
  player: Player;
  isCurrentPlayer: boolean;
  zenjiLock: string | null;
  onCardSelect: (card: any, index: number, from: 'monkeyMind' | 'higherMind') => void;
  onExchangeCard: (index: number) => void;
  onMoveToHigherMind?: (card: any) => void;
  onDiscard?: (card: any) => void;
  onKnockOut?: (index: number) => void;
  selectedCardIndex: number;
  hasDrawnCard?: boolean;
  isDisabled?: boolean;
}

const PlayerArea = ({
  player,
  isCurrentPlayer,
  zenjiLock,
  onCardSelect,
  onExchangeCard,
  onMoveToHigherMind,
  onDiscard,
  onKnockOut,
  selectedCardIndex,
  hasDrawnCard = false,
  isDisabled = false,
}: PlayerAreaProps) => {
  const isLocked = zenjiLock === player.id;
  const { toast } = useToast();
  
  const handleKnockOut = (index: number) => {
    if (onKnockOut && !isDisabled) {
      onKnockOut(index);
    } else {
      toast({
        title: "Can't Knock Out",
        description: "You can't perform a knock out right now",
        variant: "destructive",
      });
    }
  };
  
  return (
    <motion.div 
      className="p-4 bg-white rounded-lg shadow-md relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          <h3 className="font-cinzel text-lg text-jungle-green mr-2">{player.name}</h3>
          {player.isActive && <Badge className="bg-zen-gold text-jungle-green">Current Turn</Badge>}
          {isLocked && (
            <Badge className="ml-2 bg-mystic-purple">
              <Lock className="h-3 w-3 mr-1" />
              Zenji Called
            </Badge>
          )}
        </div>
        <div className="flex items-center">
          <Award className="h-4 w-4 text-zen-gold mr-1" />
          <span className="font-bold">{player.score} EP</span>
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Monkey Mind */}
        <div>
          <div className="flex items-center mb-2">
            <Brain className="h-4 w-4 mr-1 text-mystic-purple" />
            <h4 className="font-cinzel text-sm text-mystic-purple">Monkey Mind</h4>
          </div>
          
          <div className="flex justify-center space-x-2 min-h-[120px]">
            {player.monkeyMind.length > 0 ? (
              player.monkeyMind.map((card, index) => (
                <div key={`${card.id}-${index}`} className="relative">
                  <Card
                    card={card}
                    index={index}
                    faceDown={!isCurrentPlayer && (index !== 0 && index !== player.monkeyMind.length - 1)}
                    isSelected={isCurrentPlayer && selectedCardIndex === index}
                    isSelectable={isCurrentPlayer && !isDisabled && (!hasDrawnCard || selectedCardIndex !== -1)}
                    onClick={() => {
                      if (hasDrawnCard && selectedCardIndex === -1) {
                        onExchangeCard(index);
                      } else {
                        onCardSelect(card, index, 'monkeyMind');
                      }
                    }}
                  />
                  
                  {isCurrentPlayer && !isDisabled && onKnockOut && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white z-10 rounded-full h-6 w-6 p-0"
                      onClick={() => handleKnockOut(index)}
                    >
                      <Gavel className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <div className="flex items-center justify-center h-28 w-full bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-500">Empty Monkey Mind (Satori!)</p>
              </div>
            )}
          </div>
        </div>
        
        <Separator />
        
        {/* Higher Mind */}
        <div>
          <div className="flex items-center mb-2">
            <Brain className="h-4 w-4 mr-1 text-zen-gold" />
            <h4 className="font-cinzel text-sm text-zen-gold">Higher Mind</h4>
          </div>
          
          <div className="flex justify-center space-x-2 min-h-[120px]">
            {player.higherMind.length > 0 ? (
              player.higherMind.map((card, index) => (
                <Card
                  key={`${card.id}-${index}`}
                  card={card}
                  index={index}
                  faceDown={!isCurrentPlayer}
                  isSelectable={false}
                  onClick={() => {}}
                />
              ))
            ) : (
              <div className="flex items-center justify-center h-28 w-full bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-500">Empty Higher Mind</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons for selected card */}
        {isCurrentPlayer && selectedCardIndex !== -1 && onMoveToHigherMind && onDiscard && (
          <div className="flex justify-center space-x-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onMoveToHigherMind(player.monkeyMind[selectedCardIndex])}
              disabled={isDisabled || player.higherMind.length >= 4 || 
                !(player.monkeyMind[selectedCardIndex].type === 'element' && 
                  player.monkeyMind[selectedCardIndex].value >= 1 && 
                  player.monkeyMind[selectedCardIndex].value <= 4) &&
                player.monkeyMind[selectedCardIndex].type !== 'avatar'}
            >
              To Higher Mind
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDiscard(player.monkeyMind[selectedCardIndex])}
              disabled={isDisabled}
            >
              Discard
            </Button>
          </div>
        )}
      </div>
      
      {/* Scorecard display */}
      {player.scorecard.length > 0 && (
        <div className="mt-4">
          <h4 className="font-cinzel text-sm text-jungle-green mb-2">Scorecard</h4>
          <div className="flex flex-wrap gap-1">
            {player.scorecard.map((card, index) => (
              <Badge 
                key={`${card.id}-${index}`}
                className={`
                  ${card.element === 'earth' ? 'bg-jungle-green' : 
                    card.element === 'fire' ? 'bg-fire-red' : 
                    card.element === 'water' ? 'bg-water-blue' : 
                    card.element === 'air' ? 'bg-sky-400' : 'bg-mystic-purple'}
                `}
              >
                {card.element.charAt(0).toUpperCase()} {card.value}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PlayerArea;
