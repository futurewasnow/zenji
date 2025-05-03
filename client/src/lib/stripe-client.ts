import { loadStripe, Stripe } from '@stripe/stripe-js';

// Load Stripe outside of components to avoid recreating instance
let stripePromise: Promise<Stripe | null>;

const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    const key = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
    
    if (!key) {
      console.warn('Missing Stripe public key. Payment functionality will not work.');
      return Promise.resolve(null);
    }
    
    stripePromise = loadStripe(key);
  }
  
  return stripePromise;
};

export interface CreatePaymentIntentParams {
  items: Array<{
    productId: number;
    quantity: number;
  }>;
  shippingDetails?: {
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export const createPaymentIntent = async (params: CreatePaymentIntentParams): Promise<{
  clientSecret: string;
  totalAmount: number;
}> => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to create payment intent');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export default getStripe;
