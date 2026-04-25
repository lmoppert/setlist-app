export interface ISetlist {
  id?: string;
  date?: string;
  location: string;
  slug: string;

  name?: string;
  duration?: number;  // in minutes
  notes?: string;

  entries?: ISetlistEntry[];
}

export interface ISetlistEntry {
  id?: string;
  songId: string;

  position: number
  isOptional: boolean;
  isEncore: boolean;

  notes?: string;
}

export interface ISetlistBase {
  date?: string;
  location: string;

  name?: string;
  duration?: number;
  notes?: string;
}