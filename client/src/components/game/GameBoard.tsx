import { useState, useEffect, useCallback } from 'react';
import { Card as CardType, Player, GameState } from '@/lib/game-engine';
import PlayerArea from '@/components/game/PlayerArea';
import CardPile from '@/components/game/CardPile';
import GameControls from '@/components/game/GameControls';
import TutorialOverlay from '@/components/game/TutorialOverlay';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Trophy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GameBoardProps {
  gameState: GameState;
  onAction: (action: string, payload?: any) => void;
  isTutorial?: boolean;
  tutorialStep?: number;
  onNextTutorialStep?: () => void;
}

const GameBoard = ({ 
  gameState, 
  onAction, 
  isTutorial = false,
  tutorialStep = 0,
  onNextTutorialStep
}: GameBoardProps) => {
  const [selectedCard, setSelectedCard] = useState<{card: CardType, index: number} | null>(null);
  const [selectedPileType, setSelectedPileType] = useState<'futurePile' | 'pastPile' | null>(null);
  const { toast } = useToast();
  
  const currentPlayer = gameState.players[gameState.currentTurn];
  const isGameOver = gameState.status === 'game_end';
  const isRoundEnd = gameState.status === 'round_end';
  const winningPlayer = isGameOver ? gameState.players.find(p => p.id === gameState.winner) : null;
  
  // Reset selections when player changes
  useEffect(() => {
    setSelectedCard(null);
    setSelectedPileType(null);
  }, [gameState.currentTurn]);
  
  const handleCardSelect = useCallback((card: CardType, index: number, from: 'monkeyMind' | 'higherMind') => {
    if (isGameOver || isRoundEnd) return;
    
    if (from === 'monkeyMind' && selectedPileType === null) {
      setSelectedCard({ card, index });
    }
  }, [isGameOver, isRoundEnd, selectedPileType]);
  
  const handlePileSelect = useCallback((pileType: 'futurePile' | 'pastPile') => {
    if (isGameOver || isRoundEnd) return;
    
    setSelectedPileType(pileType);
    onAction('draw', { pileType });
  }, [isGameOver, isRoundEnd, onAction]);
  
  const handleExchangeCard = useCallback((targetIndex: number) => {
    if (!selectedCard || selectedPileType === null) return;
    
    onAction('exchange', { 
      cardToReplace: targetIndex,
      holdingCardIndex: selectedCard.index,
      pileType: selectedPileType
    });
    
    setSelectedCard(null);
    setSelectedPileType(null);
  }, [selectedCard, selectedPileType, onAction]);
  
  const handleCardToHigherMind = useCallback((card: CardType) => {
    onAction('moveToHigherMind', { card });
    setSelectedCard(null);
  }, [onAction]);
  
  const handleDiscardCard = useCallback((card: CardType) => {
    onAction('discard', { card });
    setSelectedCard(null);
  }, [onAction]);
  
  const handleCallZenji = useCallback(() => {
    onAction('callZenji');
    
    toast({
      title: 'Zenji Called!',
      description: 'The round is ending. Other players get one final turn.',
    });
  }, [onAction, toast]);
  
  const handleKnockOut = useCallback((index: number) => {
    onAction('knockOut', { cardIndex: index });
  }, [onAction]);
  
  const handleEndTurn = useCallback(() => {
    onAction('endTurn');
  }, [onAction]);
  
  const handleNextRound = useCallback(() => {
    onAction('nextRound');
  }, [onAction]);
  
  return (
    <div className="relative w-full h-full flex flex-col">
      {/* Game status alerts */}
      {isGameOver && (
        <Alert className="mb-4 bg-zen-gold border-jungle-green">
          <Trophy className="h-5 w-5 text-jungle-green" />
          <AlertTitle className="text-jungle-green">Game Over!</AlertTitle>
          <AlertDescription className="text-jungle-green">
            {winningPlayer ? `${winningPlayer.name} has won the game with ${winningPlayer.score} points!` : 'The game has ended.'}
          </AlertDescription>
        </Alert>
      )}
      
      {isRoundEnd && !isGameOver && (
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Round Ended</AlertTitle>
          <AlertDescription>
            {gameState.zenjiLock 
              ? `${gameState.players.find(p => p.id === gameState.zenjiLock)?.name} called Zenji!` 
              : 'The round has ended.'
            } Click "Next Round" to continue.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-grow">
        {/* Left column: Opponent areas */}
        <div className="space-y-4">
          {gameState.players
            .filter(player => player.id !== currentPlayer.id)
            .map((player) => (
              <PlayerArea
                key={player.id}
                player={player}
                isCurrentPlayer={false}
                zenjiLock={gameState.zenjiLock}
                onCardSelect={() => {}} // Opponents' cards can't be selected
                onExchangeCard={() => {}} // No exchange on opponent's area
                selectedCardIndex={-1}
                isDisabled={isGameOver || isRoundEnd}
              />
            ))}
        </div>
        
        {/* Middle column: Card piles and game controls */}
        <div className="flex flex-col items-center justify-between">
          <div className="flex justify-center space-x-8 my-4">
            <CardPile 
              name="Future Pile" 
              cards={gameState.futurePile} 
              isSelectable={!selectedCard && !selectedPileType && !isGameOver && !isRoundEnd}
              onSelect={() => handlePileSelect('futurePile')}
              faceDown={true}
            />
            <CardPile 
              name="Past Pile" 
              cards={gameState.pastPile} 
              isSelectable={!selectedCard && !selectedPileType && !isGameOver && !isRoundEnd}
              onSelect={() => handlePileSelect('pastPile')}
              faceDown={false}
            />
          </div>
          
          <GameControls 
            isCurrentPlayerTurn={true}
            canCallZenji={!selectedCard && !selectedPileType && !isGameOver && !isRoundEnd}
            onCallZenji={handleCallZenji}
            onEndTurn={handleEndTurn}
            isRoundEnd={isRoundEnd}
            isGameOver={isGameOver}
            onNextRound={handleNextRound}
            roundNumber={gameState.roundNumber}
          />
        </div>
        
        {/* Right column: Current player area */}
        <div>
          <PlayerArea
            player={currentPlayer}
            isCurrentPlayer={true}
            zenjiLock={gameState.zenjiLock}
            onCardSelect={handleCardSelect}
            onExchangeCard={handleExchangeCard}
            onMoveToHigherMind={handleCardToHigherMind}
            onDiscard={handleDiscardCard}
            onKnockOut={handleKnockOut}
            selectedCardIndex={selectedCard ? selectedCard.index : -1}
            hasDrawnCard={selectedPileType !== null}
            isDisabled={isGameOver || isRoundEnd}
          />
        </div>
      </div>
      
      {/* Tutorial overlay */}
      {isTutorial && (
        <TutorialOverlay 
          step={tutorialStep}
          onNext={onNextTutorialStep}
        />
      )}
    </div>
  );
};

export default GameBoard;
