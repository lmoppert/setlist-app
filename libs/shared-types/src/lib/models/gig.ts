export interface Gig {
  id?: string;
  date: string;
  location: string;

  maxDuration?: number;  // in minutes

  setlistId: string;

  notes?: string;
}