export interface ISongResource {
  id: string;
  type:
    | 'SHEET'
    | 'LYRICS'
    | 'BASS'
    | 'RECORDING'
    | 'OTHER';
  filetype:
    | 'TXT'
    | 'PDF'
    | 'MD'
    | 'MP3';
  path: string;
  content?: string;
}

