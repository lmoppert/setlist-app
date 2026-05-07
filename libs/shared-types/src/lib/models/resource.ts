export const RESOURCE_CATEGORIES = {
  SHEET:     { label: 'Leadsheet', icon: 'library_music' },
  LYRICS:    { label: 'Songtext',  icon: 'library_books' },
  BASS:      { label: 'Bass-Tabs', icon: 'library_music' },
  RECORDING: { label: 'Aufnahme',  icon: 'video_library' },
  ORIGINAL:  { label: 'Original',  icon: 'video_library' },
  OTHER:     { label: 'Sonstige',  icon: 'photo_library' },
} as const;
export type ResourceType = keyof typeof RESOURCE_CATEGORIES;
export const RESOURCE_TYPES = Object.keys(RESOURCE_CATEGORIES) as ResourceType[];

export const RESOURCE_FILE_TYPES = ['TXT', 'PDF', 'MD', 'MP3'];
export type ResourceFileType = typeof RESOURCE_FILE_TYPES [number];

export interface ISongResource {
  id: string;
  type: ResourceType;
  filetype: ResourceFileType;
  path: string;
  content?: string;
}