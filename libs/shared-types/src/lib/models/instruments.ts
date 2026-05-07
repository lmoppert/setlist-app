export interface IInstrumentAssignment {
  name: string;
  tuning?: string;
  memberId: string;
}

export const AVAILABLE_INSTRUMENTS = [
  'E-Gitarre',
  'Akustik',
  'Schlagzeug',
  'Akkordeon',
  'Bass',
  'Mundharmonika',
  'Tamborin',
];

export const DEFAULT_INSTRUMENTS: Record<string, string> = {
  'Volker':     'E-Gitarre',
  'Bernd':      'Akustik',
  'Dirk':       'E-Gitarre',
  'Jürgen':     'Schlagzeug',
  'Christiane': 'Akkordeon',
  'Lutz':       'Bass',
}