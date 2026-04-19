export interface Setlist {
  id?: string;
  date: string;
  location: string;
  slug: string;

  name?: string;
  duration?: number;  // in minutes
  notes?: string;

  entries?: SetlistEntry[];
}

export interface SetlistEntry {
  id?: string;
  songId: string;

  position: number

  isOptional: boolean;
  isEncore: boolean;

  notes?: string;
}