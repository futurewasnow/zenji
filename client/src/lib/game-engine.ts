// Game state types
export type CardType = 'element' | 'avatar' | 'zen' | 'power' | 'magic';
export type ElementType = 'earth' | 'fire' | 'water' | 'air' | 'none';

export interface Card {
  id: string;
  name: string;
  type: CardType;
  element: ElementType;
  value: number;
  power?: string;
  description?: string;
  imageUrl?: string;
}

export interface Player {
  id: string;
  name: string;
  isAI: boolean;
  monkeyMind: Card[];
  higherMind: Card[];
  scorecard: Card[];
  score: number;
  isActive: boolean;
  hasCalledZenji: boolean;
  hasCheckedCards: boolean;
  cardsVisible: {[cardId: string]: boolean}; // To track which individual cards are visible
}

export interface GameState {
  players: Player[];
  currentTurn: number;
  futurePile: Card[];
  pastPile: Card[];
  status: 'waiting' | 'active' | 'round_end' | 'game_end';
  roundNumber: number;
  zenjiLock: string | null; // ID of player who called Zenji
  winner: string | null;
}

// Create a new deck of cards
export function createDeck(): Card[] {
  const deck: Card[] = [];
  let cardId = 1;
  
  // Create element cards (52 cards)
  const elements: ElementType[] = ['earth', 'fire', 'water', 'air'];
  
  elements.forEach(element => {
    // Add values 5-12 (32 cards, 8 per element)
    for (let value = 5; value <= 12; value++) {
      deck.push({
        id: `${cardId++}`,
        name: `${element.charAt(0).toUpperCase() + element.slice(1)} ${value}`,
        type: 'element',
        element,
        value,
        power: getPowerForValue(value),
        imageUrl: `/images/cards/${element}-template.svg`
      });
    }
    
    // Add EP cards 1-4 (16 cards, 4 per element)
    for (let value = 1; value <= 4; value++) {
      deck.push({
        id: `${cardId++}`,
        name: `${element.charAt(0).toUpperCase() + element.slice(1)} EP ${value}`,
        type: 'element',
        element,
        value,
        description: `Elemental Point card worth ${value} points`,
        imageUrl: `/images/cards/${element}-template.svg`
      });
    }
    
    // Add Avatars (4 cards, 1 per element)
    deck.push({
      id: `${cardId++}`,
      name: `${element.charAt(0).toUpperCase() + element.slice(1)} Avatar`,
      type: 'avatar',
      element,
      value: 5,
      power: 'avatar',
      description: `Avatar of ${element.charAt(0).toUpperCase() + element.slice(1)}: Worth 5 points in Monkey Mind, but all ${element} cards in your Monkey Mind become worth 0 points if this is in your Higher Mind.`,
      imageUrl: `/images/cards/avatar-template.svg`
    });
  });
  
  // Add No-Zen Kings (2 cards, fire and water)
  deck.push({
    id: `${cardId++}`,
    name: 'No-Zen King of Fire',
    type: 'power',
    element: 'fire',
    value: 13,
    description: 'High value card that increases your Monkey Mind score',
    imageUrl: '/images/cards/power-template.svg'
  });
  
  deck.push({
    id: `${cardId++}`,
    name: 'No-Zen King of Water',
    type: 'power',
    element: 'water',
    value: 13,
    description: 'High value card that increases your Monkey Mind score',
    imageUrl: '/images/cards/power-template.svg'
  });
  
  // Add Zen Kings (2 cards, earth and air)
  deck.push({
    id: `${cardId++}`,
    name: 'Zen King of Earth',
    type: 'zen',
    element: 'earth',
    value: -1,
    description: 'Reduces your Monkey Mind score by 1',
    imageUrl: '/images/cards/zen-template.svg'
  });
  
  deck.push({
    id: `${cardId++}`,
    name: 'Zen King of Air',
    type: 'zen',
    element: 'air',
    value: -1,
    description: 'Reduces your Monkey Mind score by 1',
    imageUrl: '/images/cards/zen-template.svg'
  });
  
  // Add Zero Mind cards (4 cards)
  for (let i = 0; i < 4; i++) {
    deck.push({
      id: `${cardId++}`,
      name: 'Zero Mind',
      type: 'zen',
      element: 'none',
      value: 0,
      description: 'Worth 0 points in Monkey Mind. Cannot be Knocked Out.',
      imageUrl: '/images/cards/zen-template.svg'
    });
  }
  
  // Add Zenji card
  deck.push({
    id: `${cardId++}`,
    name: 'Zenji',
    type: 'zen',
    element: 'none',
    value: -2,
    description: 'Reduces your Monkey Mind score by 2. This is the meditating monkey!',
    imageUrl: '/images/cards/zen-template.svg'
  });
  
  return deck;
}

// Get power based on card value
function getPowerForValue(value: number): string {
  switch (value) {
    case 5:
      return 'peek';
    case 6:
      return 'swap';
    case 7:
      return 'steal';
    case 8:
      return 'block';
    case 9:
      return 'view';
    case 10:
      return 'predict';
    case 11:
      return 'disrupt';
    case 12:
      return 'transmute';
    default:
      return '';
  }
}

// Shuffle a deck of cards
export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Initialize a new game
export function initializeGame(playerNames: string[], includeAI: boolean = false): GameState {
  // Create and shuffle deck
  const deck = shuffleDeck(createDeck());
  
  // Create players
  const players: Player[] = playerNames.map((name, index) => ({
    id: `player_${index + 1}`,
    name,
    isAI: false,
    monkeyMind: [],
    higherMind: [],
    scorecard: [],
    score: 0,
    isActive: index === 0, // First player is active
    hasCalledZenji: false,
    hasCheckedCards: false,
    cardsVisible: {}
  }));
  
  // Add AI players if requested
  if (includeAI && players.length < 4) {
    const aiCount = Math.min(4 - players.length, 2); // Add up to 2 AI players
    for (let i = 0; i < aiCount; i++) {
      players.push({
        id: `ai_${i + 1}`,
        name: `AI Player ${i + 1}`,
        isAI: true,
        monkeyMind: [],
        higherMind: [],
        scorecard: [],
        score: 0,
        isActive: false,
        hasCalledZenji: false,
        hasCheckedCards: false,
        cardsVisible: {}
      });
    }
  }
  
  // Deal 4 cards to each player's Monkey Mind
  players.forEach(player => {
    const cards = deck.splice(0, 4);
    player.monkeyMind = cards;
    
    // Initialize cardsVisible with all cards set to false (face down)
    const cardVisibility: {[cardId: string]: boolean} = {};
    cards.forEach(card => {
      cardVisibility[card.id] = false;
    });
    player.cardsVisible = cardVisibility;
  });
  
  return {
    players,
    currentTurn: 0,
    futurePile: deck,
    pastPile: [],
    status: 'waiting',
    roundNumber: 1,
    zenjiLock: null,
    winner: null
  };
}

// Start the game
export function startGame(state: GameState): GameState {
  return {
    ...state,
    status: 'active'
  };
}

// Function to check cards - can only be done once at the beginning of the game
export function checkCards(state: GameState, playerId: string): GameState {
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  
  if (playerIndex === -1) {
    throw new Error('Player not found');
  }
  
  // Check if player has already checked cards
  if (state.players[playerIndex].hasCheckedCards && !state.players[playerIndex].hasCalledZenji) {
    throw new Error('You have already checked your cards');
  }
  
  // Update player's cards to be visible
  const updatedPlayers = [...state.players];
  const cardsVisible = { ...updatedPlayers[playerIndex].cardsVisible };
  
  // Make all cards visible
  updatedPlayers[playerIndex].monkeyMind.forEach(card => {
    cardsVisible[card.id] = true;
  });
  
  updatedPlayers[playerIndex] = {
    ...updatedPlayers[playerIndex],
    hasCheckedCards: true,
    cardsVisible: cardsVisible
  };
  
  return {
    ...state,
    players: updatedPlayers
  };
}

// Function to update card visibility based on rules
// Cards with value 5 can stay visible, others become hidden after view
export function updateCardVisibility(state: GameState, playerId: string): GameState {
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  
  if (playerIndex === -1) {
    throw new Error('Player not found');
  }
  
  // Update card visibility based on rules
  const updatedPlayers = [...state.players];
  const cardsVisible = { ...updatedPlayers[playerIndex].cardsVisible };
  
  // All cards become hidden except those with value 5
  updatedPlayers[playerIndex].monkeyMind.forEach(card => {
    // Cards with value 5 can stay visible, others become hidden
    cardsVisible[card.id] = (card.value === 5);
  });
  
  updatedPlayers[playerIndex] = {
    ...updatedPlayers[playerIndex],
    cardsVisible: cardsVisible
  };
  
  return {
    ...state,
    players: updatedPlayers
  };
}

// Draw a card from the future pile
export function drawFromFuture(state: GameState, playerId: string): { state: GameState, card: Card } {
  // Check if it's the player's turn
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  if (playerIndex !== state.currentTurn || state.status !== 'active') {
    throw new Error('Not your turn');
  }
  
  if (state.futurePile.length === 0) {
    // Reshuffle past pile if future pile is empty
    const newFuturePile = shuffleDeck([...state.pastPile]);
    state = {
      ...state,
      futurePile: newFuturePile,
      pastPile: []
    };
  }
  
  // Draw card
  const card = state.futurePile[0];
  const newFuturePile = state.futurePile.slice(1);
  
  return {
    state: {
      ...state,
      futurePile: newFuturePile
    },
    card
  };
}

// Discard a card to the past pile
export function discardToPast(state: GameState, card: Card): GameState {
  return {
    ...state,
    pastPile: [card, ...state.pastPile]
  };
}

// Place a card in player's monkey mind, exchanging with an existing card
export function exchangeMonkeyMindCard(
  state: GameState, 
  playerId: string, 
  newCard: Card, 
  replaceIndex: number
): { state: GameState, replacedCard: Card } {
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  
  if (playerIndex === -1) {
    throw new Error('Player not found');
  }
  
  if (replaceIndex < 0 || replaceIndex >= state.players[playerIndex].monkeyMind.length) {
    throw new Error('Invalid card index');
  }
  
  // Get the card being replaced
  const replacedCard = state.players[playerIndex].monkeyMind[replaceIndex];
  
  // Update the player's monkey mind
  const newMonkeyMind = [...state.players[playerIndex].monkeyMind];
  newMonkeyMind[replaceIndex] = newCard;
  
  // Update card visibility
  const cardsVisible = { ...state.players[playerIndex].cardsVisible };
  
  // New card is always visible initially
  cardsVisible[newCard.id] = true;
  
  // Create updated players array
  const updatedPlayers = [...state.players];
  updatedPlayers[playerIndex] = {
    ...updatedPlayers[playerIndex],
    monkeyMind: newMonkeyMind,
    cardsVisible: cardsVisible
  };
  
  return {
    state: {
      ...state,
      players: updatedPlayers
    },
    replacedCard
  };
}

// Place a card in player's higher mind
export function addToHigherMind(state: GameState, playerId: string, card: Card): GameState {
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  
  if (playerIndex === -1) {
    throw new Error('Player not found');
  }
  
  // Only EP cards, Avatar cards and Magic cards can go to higher mind
  if (
    !(card.type === 'element' && card.value >= 1 && card.value <= 4) && 
    card.type !== 'avatar' && 
    card.type !== 'magic'
  ) {
    throw new Error('This card cannot be placed in the Higher Mind');
  }
  
  // Check if higher mind has less than 4 cards
  if (state.players[playerIndex].higherMind.length >= 4) {
    throw new Error('Higher Mind is full');
  }
  
  // Add card to higher mind
  const newHigherMind = [...state.players[playerIndex].higherMind, card];
  
  // Create updated players array
  const updatedPlayers = [...state.players];
  updatedPlayers[playerIndex] = {
    ...updatedPlayers[playerIndex],
    higherMind: newHigherMind
  };
  
  return {
    ...state,
    players: updatedPlayers
  };
}

// End player's turn
export function endTurn(state: GameState): GameState {
  // Move to next player
  const nextTurn = (state.currentTurn + 1) % state.players.length;
  
  return {
    ...state,
    currentTurn: nextTurn
  };
}

// Call Zenji (end of round)
export function callZenji(state: GameState, playerId: string): GameState {
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  
  if (playerIndex === -1) {
    throw new Error('Player not found');
  }
  
  if (playerIndex !== state.currentTurn) {
    throw new Error('Not your turn');
  }
  
  // Mark this player as the one who called Zenji
  const updatedPlayers = [...state.players];
  updatedPlayers[playerIndex] = {
    ...updatedPlayers[playerIndex],
    hasCalledZenji: true
  };
  
  return {
    ...state,
    players: updatedPlayers,
    zenjiLock: playerId,
    status: 'round_end'
  };
}

// Calculate player's monkey mind score
export function calculateMonkeyMindScore(player: Player): number {
  let score = 0;
  const avatarElements = player.higherMind
    .filter(card => card.type === 'avatar')
    .map(card => card.element);
  
  // Calculate score for each card in Monkey Mind
  player.monkeyMind.forEach(card => {
    // Check if card's element matches any avatar in Higher Mind
    if (avatarElements.includes(card.element)) {
      // Card value becomes 0 if its element matches an avatar in Higher Mind
      score += 0;
    } else {
      score += card.value;
    }
  });
  
  return score;
}

// End the round and score points
export function endRound(state: GameState): GameState {
  // Find the player who called Zenji
  const zenjiCallerIndex = state.players.findIndex(p => p.id === state.zenjiLock);
  
  if (zenjiCallerIndex === -1) {
    throw new Error('No player called Zenji');
  }
  
  // Calculate scores for all players
  const playerScores = state.players.map(player => ({
    id: player.id,
    score: calculateMonkeyMindScore(player)
  }));
  
  // Get the minimum score
  const minScore = Math.min(...playerScores.map(p => p.score));
  
  // Check if Zenji caller has the lowest score
  const zenjiCallerScore = playerScores.find(p => p.id === state.zenjiLock)?.score || 0;
  const zenjiCallerHasLowestScore = zenjiCallerScore === minScore;
  
  // Create updated players array with scored points
  const updatedPlayers = [...state.players].map(player => {
    const playerScore = playerScores.find(p => p.id === player.id)?.score || 0;
    let newScorecard = [...player.scorecard];
    let newHigherMind = [...player.higherMind];
    let failedZenji = false;
    
    if (player.id === state.zenjiLock) {
      if (zenjiCallerHasLowestScore) {
        // Zenji caller has lowest score - get all EP cards from Higher Mind
        const epCards = player.higherMind.filter(card => 
          card.type === 'element' && card.value >= 1 && card.value <= 4
        );
        
        // Only one card of each value can be scored
        const scoredValues = new Set<number>();
        const cardsToScore = [];
        
        for (const card of epCards) {
          if (!scoredValues.has(card.value)) {
            scoredValues.add(card.value);
            cardsToScore.push(card);
          }
        }
        
        // Add scored cards to scorecard
        newScorecard = [...newScorecard, ...cardsToScore];
        
        // Remove scored cards from Higher Mind
        newHigherMind = player.higherMind.filter(card => 
          !cardsToScore.some(c => c.id === card.id)
        );
      } else {
        // Zenji caller doesn't have lowest score - failed Zenji
        failedZenji = true;
      }
    } else if (playerScore <= zenjiCallerScore || playerScore === 0) {
      // Other player has lower or equal score than Zenji caller
      // They get one EP card from their Higher Mind
      const epCards = player.higherMind.filter(card => 
        card.type === 'element' && card.value >= 1 && card.value <= 4
      );
      
      if (epCards.length > 0) {
        // Get the highest value EP card
        const highestEP = epCards.reduce((highest, card) => 
          card.value > highest.value ? card : highest, epCards[0]
        );
        
        // Add to scorecard
        newScorecard = [...newScorecard, highestEP];
        
        // Remove from Higher Mind
        newHigherMind = player.higherMind.filter(card => card.id !== highestEP.id);
      }
    }
    
    // Calculate total score from scorecard
    const totalScore = newScorecard.reduce((sum, card) => sum + card.value, 0);
    
    return {
      ...player,
      scorecard: newScorecard,
      higherMind: newHigherMind,
      score: totalScore,
      hasCalledZenji: false
    };
  });
  
  // Check if any player has won (15 or more points)
  const winner = updatedPlayers.find(p => p.score >= 15);
  
  // Setup for next round
  const allCards = [
    ...state.futurePile,
    ...state.pastPile,
    ...updatedPlayers.flatMap(p => [...p.monkeyMind, ...p.higherMind])
  ];
  
  // If there's a winner, end the game
  if (winner) {
    return {
      ...state,
      players: updatedPlayers,
      status: 'game_end',
      winner: winner.id
    };
  }
  
  // Shuffle all cards for next round
  const newDeck = shuffleDeck(allCards);
  
  // Deal new cards to players
  const nextRoundPlayers = updatedPlayers.map(player => ({
    ...player,
    monkeyMind: newDeck.splice(0, 4),
    higherMind: []
  }));
  
  return {
    ...state,
    players: nextRoundPlayers,
    futurePile: newDeck,
    pastPile: [],
    status: 'active',
    roundNumber: state.roundNumber + 1,
    zenjiLock: null,
    currentTurn: (zenjiCallerIndex + 1) % state.players.length // Next player starts
  };
}

// Knock out a card from Monkey Mind if it matches top card of Past pile
export function knockOutCard(
  state: GameState, 
  playerId: string, 
  cardIndex: number
): GameState {
  const playerIndex = state.players.findIndex(p => p.id === playerId);
  
  if (playerIndex === -1) {
    throw new Error('Player not found');
  }
  
  if (state.pastPile.length === 0) {
    throw new Error('No cards in past pile to match');
  }
  
  const topPastCard = state.pastPile[0];
  const playerCard = state.players[playerIndex].monkeyMind[cardIndex];
  
  // Check if Zero Mind card (cannot be knocked out)
  if (playerCard.type === 'zen' && playerCard.name === 'Zero Mind') {
    throw new Error('Zero Mind cards cannot be knocked out');
  }
  
  // Check if cards match (same value)
  if (playerCard.value !== topPastCard.value) {
    // Penalty for wrong knock out - draw a card from future pile
    const penaltyCard = state.futurePile[0];
    const newFuturePile = state.futurePile.slice(1);
    
    // Add penalty card to player's monkey mind if there's space
    let updatedPlayers = [...state.players];
    if (updatedPlayers[playerIndex].monkeyMind.length < 4) {
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        monkeyMind: [...updatedPlayers[playerIndex].monkeyMind, penaltyCard]
      };
    } else {
      // Otherwise put in higher mind (blocked)
      updatedPlayers[playerIndex] = {
        ...updatedPlayers[playerIndex],
        higherMind: [...updatedPlayers[playerIndex].higherMind, penaltyCard]
      };
    }
    
    return {
      ...state,
      futurePile: newFuturePile,
      players: updatedPlayers
    };
  }
  
  // Cards match - knock out successful
  const newMonkeyMind = [...state.players[playerIndex].monkeyMind];
  newMonkeyMind.splice(cardIndex, 1);
  
  const updatedPlayers = [...state.players];
  updatedPlayers[playerIndex] = {
    ...updatedPlayers[playerIndex],
    monkeyMind: newMonkeyMind
  };
  
  // Add knocked out card to past pile
  const newPastPile = [playerCard, ...state.pastPile];
  
  // Check for Satori (empty monkey mind)
  if (newMonkeyMind.length === 0) {
    // Player achieves Satori - instantly score EP cards from Higher Mind
    const epCards = updatedPlayers[playerIndex].higherMind.filter(card => 
      card.type === 'element' && card.value >= 1 && card.value <= 4
    );
    
    // Only one card of each value can be scored
    const scoredValues = new Set<number>();
    const cardsToScore = [];
    
    for (const card of epCards) {
      if (!scoredValues.has(card.value)) {
        scoredValues.add(card.value);
        cardsToScore.push(card);
      }
    }
    
    // Add scored cards to scorecard
    const newScorecard = [
      ...updatedPlayers[playerIndex].scorecard,
      ...cardsToScore
    ];
    
    // Remove scored cards from Higher Mind
    const newHigherMind = updatedPlayers[playerIndex].higherMind.filter(card => 
      !cardsToScore.some(c => c.id === card.id)
    );
    
    // Calculate total score
    const totalScore = newScorecard.reduce((sum, card) => sum + card.value, 0);
    
    updatedPlayers[playerIndex] = {
      ...updatedPlayers[playerIndex],
      scorecard: newScorecard,
      higherMind: newHigherMind,
      score: totalScore
    };
    
    // Check if player has won
    if (totalScore >= 15) {
      return {
        ...state,
        players: updatedPlayers,
        pastPile: newPastPile,
        status: 'game_end',
        winner: playerId
      };
    }
  }
  
  return {
    ...state,
    players: updatedPlayers,
    pastPile: newPastPile
  };
}

// Make an AI move
export function makeAIMove(state: GameState): GameState {
  const currentPlayer = state.players[state.currentTurn];
  
  if (!currentPlayer.isAI) {
    throw new Error('Current player is not AI');
  }
  
  // Simple AI strategy:
  // 1. Draw from future pile
  const { state: newState, card } = drawFromFuture(state, currentPlayer.id);
  
  // 2. If card is EP or Avatar, try to place in monkey mind and move replaced card to higher mind
  if (
    (card.type === 'element' && card.value >= 1 && card.value <= 4) ||
    card.type === 'avatar'
  ) {
    // Find highest value card in monkey mind to replace
    let highestIndex = 0;
    let highestValue = calculateEffectiveCardValue(currentPlayer, currentPlayer.monkeyMind[0]);
    
    for (let i = 1; i < currentPlayer.monkeyMind.length; i++) {
      const cardValue = calculateEffectiveCardValue(currentPlayer, currentPlayer.monkeyMind[i]);
      if (cardValue > highestValue) {
        highestValue = cardValue;
        highestIndex = i;
      }
    }
    
    // Exchange the card
    const { state: exchangeState, replacedCard } = exchangeMonkeyMindCard(
      newState,
      currentPlayer.id,
      card,
      highestIndex
    );
    
    // If replaced card is EP or Avatar, add to Higher Mind
    if (
      (replacedCard.type === 'element' && replacedCard.value >= 1 && replacedCard.value <= 4) ||
      replacedCard.type === 'avatar'
    ) {
      return endTurn(addToHigherMind(exchangeState, currentPlayer.id, replacedCard));
    } else {
      // Discard replaced card
      return endTurn(discardToPast(exchangeState, replacedCard));
    }
  } 
  // 3. Otherwise discard drawn card
  else {
    return endTurn(discardToPast(newState, card));
  }
}

// Helper to calculate effective value of a card considering avatars
function calculateEffectiveCardValue(player: Player, card: Card): number {
  const avatarElements = player.higherMind
    .filter(c => c.type === 'avatar')
    .map(c => c.element);
  
  if (avatarElements.includes(card.element)) {
    return 0; // Card's element is neutralized by an avatar
  }
  
  return card.value;
}
