import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'wouter';
import GameBoard from '@/components/game/GameBoard';
import { 
  initializeGame, 
  startGame, 
  GameState, 
  drawFromFuture, 
  discardToPast, 
  exchangeMonkeyMindCard,
  addToHigherMind,
  endTurn
} from '@/lib/game-engine';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const GameTutorial = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize tutorial game
  useEffect(() => {
    if (!isInitialized) {
      const playerNames = ['You', 'Tutorial Assistant'];
      const initialState = initializeGame(playerNames, false);
      
      // Ensure player has good cards for tutorial
      // This creates a more guided experience with predictable cards
      const modifiedState = {
        ...initialState,
        players: initialState.players.map((player, index) => {
          if (index === 0) {
            // Player cards configured for tutorial
            return {
              ...player,
              monkeyMind: [
                // One EP card that should go to Higher Mind
                {
                  id: 'tutorial_ep_1',
                  name: 'Earth EP 2',
                  type: 'element',
                  element: 'earth',
                  value: 2,
                  description: 'Elemental Point card worth 2 points'
                },
                // One high value card to discard/exchange
                {
                  id: 'tutorial_high_1',
                  name: 'Fire 8',
                  type: 'element',
                  element: 'fire',
                  value: 8,
                  power: 'block'
                },
                // One card to keep (low value)
                {
                  id: 'tutorial_zen_1',
                  name: 'Zero Mind',
                  type: 'zen',
                  element: 'none',
                  value: 0,
                  description: 'Worth 0 points in Monkey Mind. Cannot be Knocked Out.'
                },
                // One high value card that could be knocked out
                {
                  id: 'tutorial_high_2',
                  name: 'Water 7',
                  type: 'element',
                  element: 'water',
                  value: 7,
                  power: 'steal'
                }
              ]
            };
          }
          return player;
        })
      };
      
      // Put a card in past pile that matches one of ours for KO tutorial
      modifiedState.pastPile = [
        {
          id: 'tutorial_past_1',
          name: 'Water 7',
          type: 'element',
          element: 'water',
          value: 7,
          power: 'steal'
        },
        ...modifiedState.pastPile
      ];
      
      setGameState(startGame(modifiedState));
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Handle next tutorial step
  const handleNextTutorialStep = useCallback(() => {
    setTutorialStep(prevStep => prevStep + 1);
  }, []);
  
  // Handle skip tutorial
  const handleSkipTutorial = useCallback(() => {
    // Set the step to the end of tutorial steps to hide overlay
    setTutorialStep(9); // Set to the index of the last step + 1
  }, []);

  // Handle game actions during tutorial
  const handleGameAction = useCallback((action: string, payload?: any) => {
    if (!gameState) return;
    
    try {
      let newState = { ...gameState };
      const currentPlayer = gameState.players[gameState.currentTurn];
      
      switch (action) {
        case 'draw':
          if (payload.pileType === 'futurePile') {
            const result = drawFromFuture(newState, currentPlayer.id);
            newState = result.state;
            
            // Progress tutorial on draw
            setTutorialStep(prev => Math.max(prev, 5));
          }
          break;
          
        case 'exchange':
          if (payload.pileType === 'futurePile') {
            const drawResult = drawFromFuture(newState, currentPlayer.id);
            const drawnCard = drawResult.card;
            newState = drawResult.state;
            
            const exchangeResult = exchangeMonkeyMindCard(
              newState,
              currentPlayer.id,
              drawnCard,
              payload.cardToReplace
            );
            
            newState = exchangeResult.state;
            const replacedCard = exchangeResult.replacedCard;
            
            // Tutorial should detect EP cards and suggest higher mind
            if (
              (replacedCard.type === 'element' && replacedCard.value >= 1 && replacedCard.value <= 4) ||
              replacedCard.type === 'avatar'
            ) {
              setTutorialStep(prev => Math.max(prev, 6));
            } else {
              newState = discardToPast(newState, replacedCard);
            }
          }
          break;
          
        case 'moveToHigherMind':
          newState = addToHigherMind(newState, currentPlayer.id, payload.card);
          setTutorialStep(prev => Math.max(prev, 7));
          break;
          
        case 'discard':
          newState = discardToPast(newState, payload.card);
          break;
          
        case 'knockOut':
          // In tutorial mode - always makes KO successful
          const knockOutIndex = payload.cardIndex;
          const knockedCard = newState.players[newState.currentTurn].monkeyMind[knockOutIndex];
          
          // Remove card from monkey mind
          newState.players[newState.currentTurn].monkeyMind = 
            newState.players[newState.currentTurn].monkeyMind.filter((_, i) => i !== knockOutIndex);
          
          // Add card to past pile
          newState.pastPile = [knockedCard, ...newState.pastPile];
          
          // Progress to next tutorial step
          setTutorialStep(prev => Math.max(prev, 7));
          break;
          
        case 'callZenji':
          // Simple version for tutorial - just end turn
          newState = endTurn(newState);
          setTutorialStep(prev => Math.max(prev, 8));
          break;
          
        case 'endTurn':
          newState = endTurn(newState);
          setTutorialStep(prev => Math.max(prev, 8));
          break;
          
        default:
          break;
      }
      
      setGameState(newState);
    } catch (error) {
      console.error('Error in tutorial action:', error);
    }
  }, [gameState]);

  return (
    <>
      <Helmet>
        <title>Zenji Tutorial - Learn to Play</title>
        <meta 
          name="description"
          content="Learn how to play Zenji, the strategic card game where you manage your Monkey Mind, accumulate Elemental Points, and achieve Zen mastery."
        />
      </Helmet>
      
      <div className="min-h-[calc(100vh-16rem)] bg-gradient-to-b from-jungle-green to-mystic-purple py-8 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="flex justify-between items-center mb-6"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex space-x-4">
              <Link href="/play">
                <Button variant="outline" className="bg-white hover:bg-white/90">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Game
                </Button>
              </Link>
              
              <Link href="/">
                <Button variant="outline" className="bg-white hover:bg-white/90">
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
              </Link>
            </div>
            
            <h1 className="font-cinzel text-2xl text-zen-gold">Zenji Tutorial</h1>
          </motion.div>

          <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
            {gameState ? (
              <GameBoard
                gameState={gameState}
                onAction={handleGameAction}
                isTutorial={true}
                tutorialStep={tutorialStep}
                onNextTutorialStep={handleNextTutorialStep}
                onSkipTutorial={handleSkipTutorial}
              />
            ) : (
              <div className="h-[600px] flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameTutorial;
