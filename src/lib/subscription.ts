export type SubscriptionPrice = {
  amount: number | null;
  currency: string;
  interval: string | null;
};

export type SubscriptionData = {
  plan: "free" | "premium";
  premium: boolean;
  expiresAt: string | null;
  cancelAtPeriodEnd: boolean;
  freeItemLimit: number;
  price: SubscriptionPrice | null;
};

// "$19.99 / month", or null when the price is not known.
export function formatPlanPrice(price: SubscriptionPrice | null) {
  if (!price || price.amount === null) return null;

  const amount = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: price.currency.toUpperCase(),
  }).format(price.amount / 100);

  return price.interval ? `${amount} / ${price.interval}` : amount;
}

export function formatLongDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
