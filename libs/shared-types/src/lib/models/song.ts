import { ISetlistEntry } from './setlist';

export interface ISong {
  id?: string;
  slug?: string,

  title: string;
  artist?: string;

  duration: number; // in seconds
  tempo?: number;   // in BPM
  key?: string;
  leadVocals?: string;

  // instruments?: IInstrumentAssignment[];

  // resources?: SongResource[];
}

export interface ISongAssignment {
  memberId: string;

  roles: Role[];

  instruments: IInstrumentAssignment[];

  notes?: string;
}

export type Role =
  | 'lead-vocals'
  | 'backing-vocals'
  | 'instrumental';

export interface IInstrumentAssignment {
  instrument: string;   // "guitar", "bass", "tambourine"
  variant?: string;     // "electric", "acoustic"
  tuning?: string;      // "Drop D"
}

export interface ISongResource {
  type:
    | 'chords'
    | 'lyrics'
    | 'sheet'
    | 'recording'
    | 'other';
  url: string;
}

export interface ISongDisplayData {
  // Common attributes
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  duration?: number;
  tempo?: number;
  key?: string;
  leadVocals?: string;

  // Only for setlist-entries
  position?: number;
  isOptional?: boolean;
  isEncore?: boolean;

  // References
  isEntry: boolean;
  originalData: ISong | ISetlistEntry;
}