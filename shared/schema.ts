import { pgTable, text, serial, integer, timestamp, decimal, boolean, jsonb } from 'drizzle-orm/pg-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { relations } from 'drizzle-orm';
import { z } from 'zod';

// Product categories
export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Products table (Zenji card decks, expansions, etc.)
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  imageUrl: text('image_url').notNull(),
  stockQuantity: integer('stock_quantity').notNull().default(0),
  categoryId: integer('category_id').references(() => categories.id).notNull(),
  featured: boolean('featured').default(false),
  includedItems: text('included_items').array(),
  weight: decimal('weight', { precision: 6, scale: 2 }),
  dimensions: text('dimensions'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
});

// Orders
export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  customerEmail: text('customer_email').notNull(),
  customerName: text('customer_name').notNull(),
  status: text('status').notNull().default('pending'),
  total: decimal('total', { precision: 10, scale: 2 }).notNull(),
  shippingAddress: text('shipping_address').notNull(),
  stripePaymentId: text('stripe_payment_id'),
  stripeSessionId: text('stripe_session_id'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
});

// Order items (products in the order)
export const orderItems = pgTable('order_items', {
  id: serial('id').primaryKey(),
  orderId: integer('order_id').references(() => orders.id).notNull(),
  productId: integer('product_id').references(() => products.id).notNull(),
  quantity: integer('quantity').notNull(),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Customers who have signed up for the newsletter
export const newsletter = pgTable('newsletter', {
  id: serial('id').primaryKey(),
  email: text('email').notNull().unique(),
  subscribedAt: timestamp('subscribed_at').defaultNow().notNull()
});

// Game sessions for online play
export const gameSessions = pgTable('game_sessions', {
  id: serial('id').primaryKey(),
  sessionId: text('session_id').notNull().unique(),
  playerCount: integer('player_count').notNull().default(1),
  status: text('status').notNull().default('waiting'),
  gameState: jsonb('game_state'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
});

// Game players
export const gamePlayers = pgTable('game_players', {
  id: serial('id').primaryKey(),
  sessionId: integer('session_id').references(() => gameSessions.id).notNull(),
  playerName: text('player_name').notNull(),
  isAI: boolean('is_ai').default(false),
  score: integer('score').default(0),
  playerState: jsonb('player_state'),
  joinedAt: timestamp('joined_at').defaultNow().notNull()
});

// Images for product galleries
export const productImages = pgTable('product_images', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id).notNull(),
  imageUrl: text('image_url').notNull(),
  altText: text('alt_text'),
  displayOrder: integer('display_order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Define relations
export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products)
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  orderItems: many(orderItems),
  images: many(productImages)
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems)
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
  product: one(products, { fields: [orderItems.productId], references: [products.id] })
}));

export const gameSessionsRelations = relations(gameSessions, ({ many }) => ({
  players: many(gamePlayers)
}));

export const gamePlayersRelations = relations(gamePlayers, ({ one }) => ({
  session: one(gameSessions, { fields: [gamePlayers.sessionId], references: [gameSessions.id] })
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] })
}));

// Validation schemas
export const categoriesInsertSchema = createInsertSchema(categories, {
  name: (schema) => schema.min(2, "Name must be at least 2 characters"),
  description: (schema) => schema.optional()
});
export type CategoryInsert = z.infer<typeof categoriesInsertSchema>;
export type Category = typeof categories.$inferSelect;

export const productsInsertSchema = createInsertSchema(products, {
  name: (schema) => schema.min(3, "Name must be at least 3 characters"),
  description: (schema) => schema.min(10, "Description must be at least 10 characters"),
  price: (schema) => schema.refine((val) => parseFloat(String(val)) > 0, "Price must be positive"),
  imageUrl: (schema) => schema.url("Image URL must be valid"),
  stockQuantity: (schema) => schema.refine((val) => parseInt(String(val)) >= 0, "Stock quantity must be non-negative"),
  includedItems: (schema) => schema.optional()
});
export type ProductInsert = z.infer<typeof productsInsertSchema>;
export type Product = typeof products.$inferSelect;

export const orderInsertSchema = createInsertSchema(orders, {
  customerEmail: (schema) => schema.email("Must be a valid email"),
  customerName: (schema) => schema.min(2, "Name must be at least 2 characters"),
  shippingAddress: (schema) => schema.min(5, "Address must be at least 5 characters")
});
export type OrderInsert = z.infer<typeof orderInsertSchema>;
export type Order = typeof orders.$inferSelect;

export const orderItemInsertSchema = createInsertSchema(orderItems, {
  quantity: (schema) => schema.refine((val) => parseInt(String(val)) > 0, "Quantity must be positive"),
  price: (schema) => schema.refine((val) => parseFloat(String(val)) >= 0, "Price must be non-negative")
});
export type OrderItemInsert = z.infer<typeof orderItemInsertSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

export const newsletterInsertSchema = createInsertSchema(newsletter, {
  email: (schema) => schema.email("Must be a valid email")
});
export type NewsletterInsert = z.infer<typeof newsletterInsertSchema>;
export type Newsletter = typeof newsletter.$inferSelect;

export const gameSessionInsertSchema = createInsertSchema(gameSessions, {
  sessionId: (schema) => schema.min(8, "Session ID must be at least 8 characters"),
  playerCount: (schema) => schema.refine(
    (val) => parseInt(String(val)) >= 1 && parseInt(String(val)) <= 4, 
    "Player count must be between 1 and 4"
  )
});
export type GameSessionInsert = z.infer<typeof gameSessionInsertSchema>;
export type GameSession = typeof gameSessions.$inferSelect;

export const gamePlayerInsertSchema = createInsertSchema(gamePlayers, {
  playerName: (schema) => schema.min(2, "Name must be at least 2 characters")
});
export type GamePlayerInsert = z.infer<typeof gamePlayerInsertSchema>;
export type GamePlayer = typeof gamePlayers.$inferSelect;

export const productImageInsertSchema = createInsertSchema(productImages, {
  imageUrl: (schema) => schema.url("Image URL must be valid")
});
export type ProductImageInsert = z.infer<typeof productImageInsertSchema>;
export type ProductImage = typeof productImages.$inferSelect;
