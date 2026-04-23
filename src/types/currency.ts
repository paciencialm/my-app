export interface TrackedPair {
  id: string;
  from: string;
  to: string;
}

export interface FeeTier {
  title: string;
  vibe: string;
  bestFor: string;
}

export type FeeAmount = 2 | 5 | 10;
