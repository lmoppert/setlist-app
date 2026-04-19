export interface Song {
  id?: string;
  slug?: string,

  name: string;
  artist?: string;

  duration: number; // in seconds
  tempo?: number;   // in BPM
  key?: string;

  // assignments?: SongAssignment[];

  // resources?: SongResource[];
}

export interface SongAssignment {
  memberId: string;

  roles: Role[];

  instruments: InstrumentAssignment[];

  notes?: string;
}

export type Role =
  | 'lead-vocals'
  | 'backing-vocals'
  | 'instrumental';

export interface InstrumentAssignment {
  instrument: string;   // "guitar", "bass", "tambourine"
  variant?: string;     // "electric", "acoustic"
  tuning?: string;      // "Drop D"
}

export interface SongResource {
  type:
    | 'chords'
    | 'lyrics'
    | 'sheet'
    | 'recording'
    | 'other';
  url: string;
}