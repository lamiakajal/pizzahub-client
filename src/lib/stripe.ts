import Stripe from "stripe";

let client: Stripe | null = null;

// Server-side only. The secret key never reaches the browser.
export function getStripe() {
  // Trim spaces and quotes that sometimes sneak in when the value is pasted.
  const key = process.env.STRIPE_SECRET_KEY?.trim().replace(/^["']|["']$/g, "");
  if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
  if (!client) client = new Stripe(key);
  return client;
}
