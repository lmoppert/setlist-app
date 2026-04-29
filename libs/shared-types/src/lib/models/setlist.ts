import { ISong, ISongAssignment } from "./song";

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

// export interface IEnrichedEntry extends ISetlistEntry {
//   song: ISong & {
//     myAssignments: ISongAssignment[];
//   }
// }

export interface ISetlistGroup {
  yearLabel: string;
  yearValue: number;
  items: ISetlist[];
}

export type ISetlistEntryWithSong = ISetlistEntry & {
  song?: ISong | null;
}

export function isSetlistEntryWithSong(
  value: ISong | ISetlistEntryWithSong
): value is ISetlistEntryWithSong {
  if ('songId' in value && value.song) { return true }
  return false;
}