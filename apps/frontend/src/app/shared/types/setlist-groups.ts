import { ISetlist } from "@setlist-app/shared-types";

export interface ISetlistGroup {
  yearLabel: string;
  yearValue: number;
  items: ISetlist[];
}