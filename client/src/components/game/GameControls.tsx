import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  BellRing, 
  SkipForward, 
  PlaySquare,
  RefreshCw,
  Eye
} from 'lucide-react';

interface GameControlsProps {
  isCurrentPlayerTurn: boolean;
  canCallZenji: boolean;
  onCallZenji: () => void;
  onEndTurn: () => void;
  isRoundEnd: boolean;
  isGameOver: boolean;
  onNextRound: () => void;
  roundNumber: number;
  onCheckCards?: () => void;
  canCheckCards?: boolean;
}

const GameControls = ({
  isCurrentPlayerTurn,
  canCallZenji,
  onCallZenji,
  onEndTurn,
  isRoundEnd,
  isGameOver,
  onNextRound,
  roundNumber,
  onCheckCards,
  canCheckCards = false
}: GameControlsProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-cinzel text-jungle-green">Game Controls</h3>
        <div className="px-2 py-1 bg-bamboo-light rounded-md text-sm">
          Round {roundNumber}
        </div>
      </div>
      
      <Separator className="mb-4" />
      
      <div className="space-y-3">
        {isRoundEnd || isGameOver ? (
          <Button 
            className="w-full bg-zen-gold text-jungle-green hover:bg-zen-gold/90"
            onClick={onNextRound}
            disabled={isGameOver}
          >
            {isGameOver ? (
              <>
                <PlaySquare className="mr-2 h-4 w-4" />
                New Game
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Next Round
              </>
            )}
          </Button>
        ) : (
          <>
            <Button 
              className="w-full bg-zen-gold text-jungle-green hover:bg-zen-gold/90"
              onClick={onCallZenji}
              disabled={!canCallZenji || !isCurrentPlayerTurn}
            >
              <BellRing className="mr-2 h-4 w-4" />
              Call Zenji
            </Button>
            
            <Button 
              className="w-full"
              variant="outline"
              onClick={onEndTurn}
              disabled={!isCurrentPlayerTurn}
            >
              <SkipForward className="mr-2 h-4 w-4" />
              End Turn
            </Button>
            
            {onCheckCards && (
              <Button 
                className="w-full"
                variant="secondary"
                onClick={onCheckCards}
                disabled={!canCheckCards || !isCurrentPlayerTurn}
              >
                <Eye className="mr-2 h-4 w-4" />
                Check Cards
              </Button>
            )}
          </>
        )}
      </div>
      
      <div className="mt-4 text-xs text-gray-500">
        <p className="mb-1"><strong>Zenji's Golden Rule:</strong> "LESS IS MORE"</p>
        <p>The player with the lowest Monkey Mind score when Zenji is called scores more Elemental Points.</p>
      </div>
    </div>
  );
};

export default GameControls;
