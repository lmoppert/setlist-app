import { ISetlistEntry } from './setlist';
import { IInstrumentAssignment } from './instruments';
import { ISongResource } from './resource';

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