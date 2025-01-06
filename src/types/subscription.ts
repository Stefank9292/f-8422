export interface SubscriptionStatus {
  subscribed: boolean;
  priceId: string | null;
  cancel_at_period_end?: boolean;
}