import { db } from "@db";
import { 
  products, 
  orders, 
  orderItems,
  newsletter,
  gameSessions,
  gamePlayers,
  productImages
} from "@shared/schema";
import { eq, and } from "drizzle-orm";

export const storage = {
  // Product related functions
  getProductById: async (id: number) => {
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        images: {
          orderBy: (images, { asc }) => [asc(images.displayOrder)]
        },
        category: true
      }
    });
    
    return product;
  },
  
  getProductsByCategory: async (categoryId: number) => {
    const productsList = await db.query.products.findMany({
      where: eq(products.categoryId, categoryId),
      with: {
        category: true,
        images: {
          orderBy: (images, { asc }) => [asc(images.displayOrder)]
        }
      }
    });
    
    return productsList;
  },
  
  getFeaturedProducts: async () => {
    const featuredProducts = await db.query.products.findMany({
      where: eq(products.featured, true),
      with: {
        category: true,
        images: {
          orderBy: (images, { asc }) => [asc(images.displayOrder)]
        }
      }
    });
    
    return featuredProducts;
  },
  
  // Order related functions
  getOrderById: async (id: number) => {
    const order = await db.query.orders.findFirst({
      where: eq(orders.id, id),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });
    
    return order;
  },
  
  getOrderByStripeSessionId: async (sessionId: string) => {
    const order = await db.query.orders.findFirst({
      where: eq(orders.stripeSessionId, sessionId),
      with: {
        items: {
          with: {
            product: true
          }
        }
      }
    });
    
    return order;
  },
  
  updateOrderStatus: async (orderId: number, status: string) => {
    const [updatedOrder] = await db
      .update(orders)
      .set({ 
        status,
        updatedAt: new Date()
      })
      .where(eq(orders.id, orderId))
      .returning();
      
    return updatedOrder;
  },
  
  // Newsletter related functions
  addNewsletterSubscriber: async (email: string) => {
    const [subscriber] = await db
      .insert(newsletter)
      .values({ email })
      .returning();
      
    return subscriber;
  },
  
  // Game session related functions
  getGameSessionBySessionId: async (sessionId: string) => {
    const session = await db.query.gameSessions.findFirst({
      where: eq(gameSessions.sessionId, sessionId)
    });
    
    return session;
  },
  
  addPlayerToSession: async (sessionId: number, playerName: string) => {
    const [player] = await db
      .insert(gamePlayers)
      .values({
        sessionId,
        playerName
      })
      .returning();
      
    return player;
  },
  
  updateGameState: async (sessionId: string, playerId: number, action: string, actionData: any) => {
    // Get current game state
    const session = await db.query.gameSessions.findFirst({
      where: eq(gameSessions.sessionId, sessionId)
    });
    
    if (!session) {
      throw new Error('Game session not found');
    }
    
    // Process game action and update state
    let gameState = session.gameState || { 
      deck: [], 
      discardPile: [], 
      currentTurn: 0,
      status: 'active' 
    };
    
    // Apply the action
    switch (action) {
      case 'draw_card':
        // Update game state based on action
        // This would depend on your game logic
        break;
      case 'discard_card':
        // Update discard pile
        break;
      case 'call_zenji':
        // End round
        gameState.status = 'round_end';
        break;
      // Add more actions as needed
    }
    
    // Update the game state in the database
    const [updatedSession] = await db
      .update(gameSessions)
      .set({ 
        gameState,
        updatedAt: new Date()
      })
      .where(eq(gameSessions.sessionId, sessionId))
      .returning();
      
    return updatedSession.gameState;
  },
  
  getPlayersInSession: async (sessionId: number) => {
    const players = await db.query.gamePlayers.findMany({
      where: eq(gamePlayers.sessionId, sessionId)
    });
    
    return players;
  },
  
  updatePlayerScore: async (playerId: number, score: number) => {
    const [updatedPlayer] = await db
      .update(gamePlayers)
      .set({ score })
      .where(eq(gamePlayers.id, playerId))
      .returning();
      
    return updatedPlayer;
  },
  
  updatePlayerState: async (playerId: number, playerState: any) => {
    const [updatedPlayer] = await db
      .update(gamePlayers)
      .set({ playerState })
      .where(eq(gamePlayers.id, playerId))
      .returning();
      
    return updatedPlayer;
  }
};
