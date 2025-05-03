import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("Starting database seed...");

    // Create product categories
    const existingCategories = await db.query.categories.findMany();
    
    if (existingCategories.length === 0) {
      console.log("Seeding categories...");
      
      const categories = [
        {
          name: "Zenji Games",
          description: "Zenji card games and expansions"
        },
        {
          name: "Accessories",
          description: "Game accessories and additional items"
        }
      ];
      
      await db.insert(schema.categories).values(categories);
      console.log("Categories seeded successfully");
    } else {
      console.log("Categories already exist, skipping seeding");
    }

    // Get categories to reference in products
    const zenji = await db.query.categories.findFirst({
      where: eq(schema.categories.name, "Zenji Games")
    });
    
    const accessories = await db.query.categories.findFirst({
      where: eq(schema.categories.name, "Accessories")
    });

    if (!zenji || !accessories) {
      throw new Error("Required categories not found");
    }

    // Create products
    const existingProducts = await db.query.products.findMany();
    
    if (existingProducts.length === 0) {
      console.log("Seeding products...");
      
      const products = [
        {
          name: "Zenji: The Journey of Remembering",
          description: "The complete Zenji card game with 61 cards, rulebook, and reference cards. Zenji is a strategic card game where you manage your Monkey Mind, accumulate Elemental Points, and achieve Zen mastery.",
          price: "29.99",
          imageUrl: "https://images.unsplash.com/photo-1611566026373-c7c8625999db?q=80&w=800&auto=format&fit=crop",
          stockQuantity: 100,
          categoryId: zenji.id,
          featured: true,
          includedItems: [
            "52 elemental playing cards",
            "4 Avatar cards (Earth, Fire, Water and Air)",
            "4 Zero Mind cards",
            "1 ZENJI card (Zenji, the meditating monkey!)",
            "Rule book in multiple languages",
            "Reference cards for quick play"
          ]
        },
        {
          name: "Zenji Deluxe: Complete Collection",
          description: "The Zenji basic game plus the 20 Magic Expansion Cards in a premium box. Perfect for experienced players looking to expand their gameplay with special mystical cards and advanced strategies.",
          price: "44.99",
          imageUrl: "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=800&auto=format&fit=crop",
          stockQuantity: 50,
          categoryId: zenji.id,
          featured: true,
          includedItems: [
            "52 elemental playing cards",
            "4 Avatar cards (Earth, Fire, Water and Air)",
            "4 Zero Mind cards",
            "1 ZENJI card (Zenji, the meditating monkey!)",
            "20 Magic Expansion Cards",
            "Premium game box",
            "Rule book in multiple languages",
            "Reference cards for quick play"
          ]
        },
        {
          name: "Zenji Magic Expansion Pack",
          description: "Expand your Zenji experience with 20 unique Magic cards that add new powers and gameplay mechanics to your matches. Perfect for experienced players looking for more strategic depth.",
          price: "19.99",
          imageUrl: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=800&auto=format&fit=crop",
          stockQuantity: 75,
          categoryId: zenji.id,
          featured: false,
          includedItems: [
            "20 Magic Expansion Cards",
            "Expansion rulebook"
          ]
        },
        {
          name: "Zenji Playmat",
          description: "High-quality playmat with designated areas for your Monkey Mind, Higher Mind, and card piles. Makes gameplay smoother and more organized while adding a touch of jungle aesthetics to your game table.",
          price: "24.99",
          imageUrl: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?q=80&w=800&auto=format&fit=crop",
          stockQuantity: 30,
          categoryId: accessories.id,
          featured: false,
          includedItems: [
            "1 Premium neoprene playmat (60cm x 40cm)",
            "Travel tube"
          ]
        }
      ];
      
      await db.insert(schema.products).values(products);
      console.log("Products seeded successfully");
    } else {
      console.log("Products already exist, skipping seeding");
    }

    // Create product images
    const existingImages = await db.query.productImages.findMany();
    
    if (existingImages.length === 0) {
      console.log("Seeding product images...");
      
      // Get products
      const basicGame = await db.query.products.findFirst({
        where: eq(schema.products.name, "Zenji: The Journey of Remembering")
      });
      
      const deluxeGame = await db.query.products.findFirst({
        where: eq(schema.products.name, "Zenji Deluxe: Complete Collection")
      });
      
      const expansionPack = await db.query.products.findFirst({
        where: eq(schema.products.name, "Zenji Magic Expansion Pack")
      });
      
      const playmat = await db.query.products.findFirst({
        where: eq(schema.products.name, "Zenji Playmat")
      });

      if (!basicGame || !deluxeGame || !expansionPack || !playmat) {
        throw new Error("Required products not found");
      }

      const productImages = [
        // Basic Game Images
        {
          productId: basicGame.id,
          imageUrl: "https://images.unsplash.com/photo-1611566026373-c7c8625999db?q=80&w=800&auto=format&fit=crop",
          altText: "Zenji basic game box",
          displayOrder: 0
        },
        {
          productId: basicGame.id,
          imageUrl: "https://images.unsplash.com/photo-1576769267415-9b497cdf1f27?q=80&w=800&auto=format&fit=crop",
          altText: "Zenji cards spread out",
          displayOrder: 1
        },
        
        // Deluxe Game Images
        {
          productId: deluxeGame.id,
          imageUrl: "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=800&auto=format&fit=crop",
          altText: "Zenji deluxe game box",
          displayOrder: 0
        },
        {
          productId: deluxeGame.id,
          imageUrl: "https://images.unsplash.com/photo-1540927558547-4a65df18ca29?q=80&w=800&auto=format&fit=crop",
          altText: "Zenji deluxe game components",
          displayOrder: 1
        },
        
        // Expansion Pack Images
        {
          productId: expansionPack.id,
          imageUrl: "https://images.unsplash.com/photo-1554284126-aa88f22d8b74?q=80&w=800&auto=format&fit=crop",
          altText: "Zenji expansion cards",
          displayOrder: 0
        },
        
        // Playmat Images
        {
          productId: playmat.id,
          imageUrl: "https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?q=80&w=800&auto=format&fit=crop",
          altText: "Zenji playmat",
          displayOrder: 0
        }
      ];
      
      await db.insert(schema.productImages).values(productImages);
      console.log("Product images seeded successfully");
    } else {
      console.log("Product images already exist, skipping seeding");
    }

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

seed();
