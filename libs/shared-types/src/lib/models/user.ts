import { ResourceType } from "./resource";

export interface IUser {
  id: string;
  username: string;
  passwordHash: string;
  filePreference: ResourceType;
}
