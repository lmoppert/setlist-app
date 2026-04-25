import { ISetlistEntry, ISong } from "@setlist-app/shared-types";

export interface ISongDisplayData {
  // Common attributes
  title: string;
  subtitle?: string;
  duration?: number;
  tempo?: number;
  key?: string;

  // Only for setlist-entries
  position?: number;
  isOptional?: boolean;
  isEncore?: boolean;

  // References
  isEntry: boolean;
  originalData: ISong | ISetlistEntry;
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