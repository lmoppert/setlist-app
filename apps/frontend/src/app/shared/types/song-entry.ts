import { SetlistEntry, Song } from "@setlist-app/shared-types";

export interface SongDisplayData {
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
  originalData: Song | SetlistEntry;
}

export type SetlistEntryWithSong = SetlistEntry & {
  song?: Song | null;
}

export function isSetlistEntryWithSong(value: Song | SetlistEntryWithSong): value is SetlistEntryWithSong {
  if ('songId' in value && value.song) { return true }
  return false;
}