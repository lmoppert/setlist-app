export interface Setlist {
  id?: string;
  name?: string;

  entries?: SetlistEntry[];
}

export interface SetlistEntry {
  id?: string;
  songId: string;

  order: number

  isOptional: boolean;
  isEncore: boolean;

  notes?: string;
}