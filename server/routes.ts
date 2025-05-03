import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { nanoid } from "nanoid";
import Stripe from "stripe";
import { 
  orders, 
  orderItems, 
  products, 
  newsletter,
  gameSessions,
  gamePlayers,
  categories
} from "@shared/schema";
import { 
  orderInsertSchema, 
  orderItemInsertSchema, 
  newsletterInsertSchema,
  gameSessionInsertSchema,
  gamePlayerInsertSchema
} from "@shared/schema";
import { eq, and, desc, inArray } from "drizzle-orm";
import { db } from "@db";
import { z } from "zod";
import * as WebSocket from "ws";

// Stripe setup
if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : undefined;

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket will be implemented later
  console.log("WebSocket functionality will be implemented in a future update");

  // API Routes
  const apiPrefix = '/api';

  // Products API
  app.get(`${apiPrefix}/products`, async (req, res) => {
    try {
      const { categoryId, featured } = req.query;
      
      // Start with a simple query
      let productList;
      
      // Add conditional filtering based on query parameters
      if (categoryId && categoryId !== 'all' && featured === 'true') {
        // Filter by both category and featured
        productList = await db.query.products.findMany({
          where: and(
            eq(products.categoryId, Number(categoryId)),
            eq(products.featured, true)
          ),
          orderBy: [desc(products.createdAt)]
        });
      } else if (categoryId && categoryId !== 'all') {
        // Filter by category only
        productList = await db.query.products.findMany({
          where: eq(products.categoryId, Number(categoryId)),
          orderBy: [desc(products.createdAt)]
        });
      } else if (featured === 'true') {
        // Filter by featured only
        productList = await db.query.products.findMany({
          where: eq(products.featured, true),
          orderBy: [desc(products.createdAt)]
        });
      } else {
        // No filters
        productList = await db.query.products.findMany({
          orderBy: [desc(products.createdAt)]
        });
      }
      
      res.json(productList);
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });

  app.get(`${apiPrefix}/products/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProductById(Number(id));
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ message: 'Failed to fetch product' });
    }
  });

  // Categories API
  app.get(`${apiPrefix}/categories`, async (req, res) => {
    try {
      const categoriesList = await db.select().from(categories);
      res.json(categoriesList);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  // Newsletter signup
  app.post(`${apiPrefix}/newsletter/subscribe`, async (req, res) => {
    try {
      const validatedData = newsletterInsertSchema.parse(req.body);
      
      // Check if email already exists
      const existingSubscriber = await db.query.newsletter.findFirst({
        where: eq(newsletter.email, validatedData.email)
      });
      
      if (existingSubscriber) {
        return res.status(200).json({ message: 'Email is already subscribed' });
      }
      
      // Add new subscriber
      const [newSubscriber] = await db.insert(newsletter).values(validatedData).returning();
      
      res.status(201).json({ 
        message: 'Subscription successful', 
        subscriber: newSubscriber 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error subscribing to newsletter:', error);
      res.status(500).json({ message: 'Failed to subscribe to newsletter' });
    }
  });

  // Create payment intent for checkout
  app.post(`${apiPrefix}/create-payment-intent`, async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ message: 'Stripe is not configured' });
    }

    try {
      const { items, shippingDetails } = req.body;
      
      if (!items || items.length === 0) {
        return res.status(400).json({ message: 'No items in cart' });
      }
      
      // Fetch product details and calculate total
      const productIds = items.map((item: any) => item.productId);
      const productsList = await db.select()
        .from(products)
        .where(inArray(products.id, productIds));
      
      // Map products to calculate correct price
      const total = items.reduce((sum: number, item: any) => {
        const product = productsList.find(p => p.id === item.productId);
        if (!product) return sum;
        return sum + (Number(product.price) * item.quantity);
      }, 0);
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(total * 100), // Convert to cents
        currency: "usd",
        metadata: {
          orderId: `order_${nanoid(8)}`,
          customerEmail: shippingDetails?.email || '',
        }
      });
      
      res.json({ 
        clientSecret: paymentIntent.client_secret,
        totalAmount: total
      });
    } catch (error: any) {
      console.error('Error creating payment intent:', error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Create order API
  app.post(`${apiPrefix}/orders`, async (req, res) => {
    try {
      const { order, items } = req.body;
      
      // Validate order data
      const validatedOrder = orderInsertSchema.parse(order);
      
      // Create the order
      const [newOrder] = await db.insert(orders).values(validatedOrder).returning();
      
      // Add order items
      const orderItemsToInsert = [];
      for (const item of items) {
        const validatedItem = orderItemInsertSchema.parse({
          ...item,
          orderId: newOrder.id
        });
        orderItemsToInsert.push(validatedItem);
      }
      
      await db.insert(orderItems).values(orderItemsToInsert);
      
      res.status(201).json({ 
        message: 'Order created successfully', 
        order: newOrder 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating order:', error);
      res.status(500).json({ message: 'Failed to create order' });
    }
  });

  // Get order by ID
  app.get(`${apiPrefix}/orders/:id`, async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrderById(Number(id));
      
      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
      
      res.json(order);
    } catch (error) {
      console.error('Error fetching order:', error);
      res.status(500).json({ message: 'Failed to fetch order' });
    }
  });

  // Game sessions API
  app.post(`${apiPrefix}/game/create-session`, async (req, res) => {
    try {
      const sessionId = nanoid(12);
      const validatedData = gameSessionInsertSchema.parse({
        ...req.body,
        sessionId
      });
      
      // Create new game session
      const [newSession] = await db.insert(gameSessions).values(validatedData).returning();
      
      // Add initial player if provided
      if (req.body.playerName) {
        const playerData = gamePlayerInsertSchema.parse({
          sessionId: newSession.id,
          playerName: req.body.playerName
        });
        
        await db.insert(gamePlayers).values(playerData);
      }
      
      res.status(201).json({ 
        message: 'Game session created', 
        session: newSession 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error creating game session:', error);
      res.status(500).json({ message: 'Failed to create game session' });
    }
  });

  // Join game session
  app.post(`${apiPrefix}/game/join-session`, async (req, res) => {
    try {
      const { sessionId, playerName } = req.body;
      
      if (!sessionId || !playerName) {
        return res.status(400).json({ message: 'Session ID and player name are required' });
      }
      
      // Find the session
      const session = await storage.getGameSessionBySessionId(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: 'Game session not found' });
      }
      
      // Check if session is full
      const existingPlayers = await db.query.gamePlayers.findMany({
        where: eq(gamePlayers.sessionId, session.id)
      });
      
      if (existingPlayers.length >= 4) {
        return res.status(400).json({ message: 'Game session is full' });
      }
      
      // Add player to session
      const validatedData = gamePlayerInsertSchema.parse({
        sessionId: session.id,
        playerName
      });
      
      const [newPlayer] = await db.insert(gamePlayers).values(validatedData).returning();
      
      res.status(201).json({ 
        message: 'Joined game session', 
        player: newPlayer 
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ errors: error.errors });
      }
      console.error('Error joining game session:', error);
      res.status(500).json({ message: 'Failed to join game session' });
    }
  });

  // Get game session
  app.get(`${apiPrefix}/game/session/:sessionId`, async (req, res) => {
    try {
      const { sessionId } = req.params;
      const session = await storage.getGameSessionBySessionId(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: 'Game session not found' });
      }
      
      // Get players
      const players = await db.query.gamePlayers.findMany({
        where: eq(gamePlayers.sessionId, session.id)
      });
      
      res.json({ 
        session,
        players
      });
    } catch (error) {
      console.error('Error fetching game session:', error);
      res.status(500).json({ message: 'Failed to fetch game session' });
    }
  });

  return httpServer;
}
