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
  endTurn,
  callZenji,
  endRound,
  knockOutCard,
  makeAIMove,
  checkCards
} from '@/lib/game-engine';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Play, Plus, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const PlayGame = () => {
  const [playerName, setPlayerName] = useState('');
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [includeAI, setIncludeAI] = useState(true);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameMode, setGameMode] = useState<'menu' | 'game' | 'join'>('menu');
  const [sessionId, setSessionId] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const { toast } = useToast();
  
  // Handle AI turns
  useEffect(() => {
    if (gameState && gameState.status === 'active') {
      const currentPlayer = gameState.players[gameState.currentTurn];
      
      if (currentPlayer.isAI) {
        // Add a small delay to make AI moves more natural
        const timer = setTimeout(() => {
          try {
            const newState = makeAIMove(gameState);
            setGameState(newState);
          } catch (error) {
            console.error('Error in AI move:', error);
            // Fallback - just end the AI's turn
            setGameState(endTurn(gameState));
          }
        }, 1000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [gameState]);
  
  const handleStartGame = useCallback(() => {
    if (!playerName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your name to start the game',
        variant: 'destructive',
      });
      return;
    }
    
    // Initialize players
    const playerNames = [playerName];
    
    // Add AI or placeholder players
    for (let i = 1; i < playerCount; i++) {
      if (includeAI) {
        playerNames.push(`AI Player ${i}`);
      } else {
        playerNames.push(`Player ${i + 1}`);
      }
    }
    
    const newGameState = initializeGame(playerNames, includeAI);
    setGameState(startGame(newGameState));
    setGameMode('game');
    
    toast({
      title: 'Game Started',
      description: 'You can check your cards once at the beginning. Then draw a card to begin your turn.',
    });
  }, [playerName, playerCount, includeAI, toast]);
  
  const handleJoinGame = useCallback(() => {
    if (!playerName.trim()) {
      toast({
        title: 'Name Required',
        description: 'Please enter your name to join the game',
        variant: 'destructive',
      });
      return;
    }
    
    if (!sessionId.trim()) {
      toast({
        title: 'Session ID Required',
        description: 'Please enter a session ID to join the game',
        variant: 'destructive',
      });
      return;
    }
    
    setIsJoining(true);
    
    // Simulate joining a game session (in a real app, this would connect to the server)
    setTimeout(() => {
      toast({
        title: 'Game Joining',
        description: 'Multiplayer mode is coming soon. Try single player for now!',
      });
      setIsJoining(false);
    }, 1500);
  }, [playerName, sessionId, toast]);
  
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
            
            // Handle the replaced card (discard or to higher mind)
            if (
              (replacedCard.type === 'element' && replacedCard.value >= 1 && replacedCard.value <= 4) ||
              replacedCard.type === 'avatar'
            ) {
              // Automatically move EP cards to Higher Mind
              newState = addToHigherMind(newState, currentPlayer.id, replacedCard);
            } else {
              // Discard other cards
              newState = discardToPast(newState, replacedCard);
            }
          }
          break;
          
        case 'moveToHigherMind':
          newState = addToHigherMind(newState, currentPlayer.id, payload.card);
          break;
          
        case 'discard':
          newState = discardToPast(newState, payload.card);
          break;
          
        case 'knockOut':
          newState = knockOutCard(newState, currentPlayer.id, payload.cardIndex);
          break;
          
        case 'callZenji':
          newState = callZenji(newState, currentPlayer.id);
          break;
          
        case 'endTurn':
          newState = endTurn(newState);
          break;
          
        case 'nextRound':
          if (newState.status === 'round_end') {
            newState = endRound(newState);
          }
          break;
        
        case 'checkCards':
          newState = checkCards(newState, currentPlayer.id);
          break;
          
        default:
          console.error('Unknown action:', action);
          return;
      }
      
      setGameState(newState);
    } catch (error) {
      console.error('Error in game action:', error);
      toast({
        title: 'Game Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    }
  }, [gameState, toast]);
  
  return (
    <>
      <Helmet>
        <title>Play Zenji Online - Card Game</title>
        <meta 
          name="description"
          content="Play Zenji online with friends or AI opponents. Manage your Monkey Mind, accumulate Elemental Points, and achieve Zen mastery in this strategic card game."
        />
      </Helmet>
      
      <div className="min-h-[calc(100vh-16rem)] bg-gradient-to-b from-jungle-green to-mystic-purple py-8 px-4 md:px-10">
        <div className="max-w-6xl mx-auto">
          {gameMode === 'menu' ? (
            <motion.div 
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-white shadow-xl border-0">
                <CardHeader className="bg-jungle-green text-white">
                  <CardTitle className="font-cinzel text-zen-gold text-2xl text-center">
                    Play Zenji Online
                  </CardTitle>
                  <CardDescription className="text-white text-center">
                    Begin your journey of remembering
                  </CardDescription>
                </CardHeader>
                
                <Tabs defaultValue="singleplayer" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="singleplayer">
                      <Play className="mr-2 h-4 w-4" />
                      Single Player
                    </TabsTrigger>
                    <TabsTrigger value="multiplayer">
                      <Users className="mr-2 h-4 w-4" />
                      Multiplayer
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="singleplayer" className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="playerName">Your Name</Label>
                        <Input
                          id="playerName"
                          placeholder="Enter your name"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="playerCount">Number of Players</Label>
                        <div className="flex gap-2">
                          {[2, 3, 4].map((count) => (
                            <Button
                              key={count}
                              variant={playerCount === count ? 'default' : 'outline'}
                              className={playerCount === count ? 'bg-zen-gold text-jungle-green' : ''}
                              onClick={() => setPlayerCount(count)}
                            >
                              {count}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="includeAI"
                            checked={includeAI}
                            onChange={(e) => setIncludeAI(e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-jungle-green focus:ring-zen-gold"
                          />
                          <Label htmlFor="includeAI">Include AI opponents</Label>
                        </div>
                      </div>
                      
                      <Button
                        className="w-full bg-zen-gold text-jungle-green hover:bg-zen-gold/90"
                        onClick={handleStartGame}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start Game
                      </Button>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="multiplayer" className="p-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="playerNameMulti">Your Name</Label>
                        <Input
                          id="playerNameMulti"
                          placeholder="Enter your name"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sessionId">Session ID (to join existing game)</Label>
                        <Input
                          id="sessionId"
                          placeholder="Enter session ID"
                          value={sessionId}
                          onChange={(e) => setSessionId(e.target.value)}
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-zen-gold text-jungle-green hover:bg-zen-gold/90"
                          onClick={() => setGameMode('join')}
                          disabled={isJoining}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Create New
                        </Button>
                        
                        <Button
                          className="flex-1"
                          variant="outline"
                          onClick={handleJoinGame}
                          disabled={isJoining}
                        >
                          {isJoining ? 'Joining...' : 'Join Game'}
                        </Button>
                      </div>
                      
                      <div className="text-xs text-gray-500 text-center">
                        <p>Multiplayer mode coming soon! Try single player for now.</p>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                
                <CardFooter className="flex justify-center p-4 border-t">
                  <Link href="/">
                    <Button variant="ghost">
                      <Home className="mr-2 h-4 w-4" />
                      Back to Home
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <div className="bg-white rounded-lg shadow-lg p-4 md:p-6">
              {gameState && (
                <GameBoard
                  gameState={gameState}
                  onAction={handleGameAction}
                />
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PlayGame;
