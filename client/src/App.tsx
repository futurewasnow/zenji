import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { CartProvider } from "@/components/shop/CartProvider";
import { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Layout Components
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/layout/LoadingScreen";

// Pages
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import PlayGame from "@/pages/PlayGame";
import GameTutorial from "@/pages/GameTutorial";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/shop" component={Shop} />
      <Route path="/play" component={PlayGame} />
      <Route path="/tutorial" component={GameTutorial} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order-confirmation/:orderId" component={OrderConfirmation} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load fonts
    const loadFonts = async () => {
      await Promise.all([
        document.fonts.load("1em Cinzel"),
        document.fonts.load("1em Raleway")
      ]);
    };

    // Simulate initial loading
    Promise.all([
      loadFonts(),
      new Promise(resolve => setTimeout(resolve, 3000)) // Minimum 3 seconds for loading screen
    ]).then(() => {
      setLoading(false);
    });
  }, []);

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <CartProvider>
          <Helmet>
            <title>Zenji - The Journey of Remembering | Card Game</title>
            <meta name="description" content="Discover Zenji, a strategic card game where you manage your Monkey Mind, accumulate Elemental Points, and achieve Zen mastery. Shop now or play online!" />
            <meta name="keywords" content="Zenji, card game, strategy game, monkey mind, zen game, zen master, card deck, elemental points" />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Raleway:wght@300;400;500;600&display=swap" rel="stylesheet" />
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==" crossOrigin="anonymous" referrerPolicy="no-referrer" />
            <script type="application/ld+json">
              {`
                {
                  "@context": "https://schema.org",
                  "@type": "Product",
                  "name": "Zenji: The Journey of Remembering",
                  "description": "A strategic card game where you manage your Monkey Mind, accumulate Elemental Points, and achieve Zen mastery.",
                  "image": "https://images.unsplash.com/photo-1611566026373-c7c8625999db?q=80&w=800&auto=format&fit=crop",
                  "brand": {
                    "@type": "Brand",
                    "name": "Zenji"
                  },
                  "offers": {
                    "@type": "Offer",
                    "price": "29.99",
                    "priceCurrency": "USD",
                    "availability": "https://schema.org/InStock"
                  }
                }
              `}
            </script>
          </Helmet>

          {loading ? (
            <LoadingScreen />
          ) : (
            <>
              <Header />
              <main>
                <Router />
              </main>
              <Footer />
            </>
          )}

          <Toaster />
        </CartProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
