import { ISetlistEntry } from './setlist';

export interface ISongBase {
  isActive: boolean;
  title: string;
  artist?: string;

  duration: number; // in seconds
  tempo?: number;   // in BPM
  key?: string;
  leadVocals?: string;

  //instruments?: IInstrumentAssignment[];
}

export interface ISong {
  id?: string;
  slug?: string;
  isActive: boolean;

  title: string;
  artist?: string;

  duration: number; // in seconds
  tempo?: number;   // in BPM
  key?: string;
  leadVocals?: string;

  instruments?: IInstrumentAssignment[];
  resources?:   ISongResource[];
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
  name: string;
  tuning?: string;
  memberId: string;
}

export interface ISongResource {
  type:
    | 'chords'
    | 'lyrics'
    | 'sheet'
    | 'recording'
    | 'other';
  filetype:
    | 'txt'
    | 'pdf'
    | 'md'
    | 'mp3';
  path: string;
  content?: string;
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
  isAccustic?: boolean;
  isEncore?: boolean;

  // References
  isEntry: boolean;
  originalData: ISong | ISetlistEntry;
}