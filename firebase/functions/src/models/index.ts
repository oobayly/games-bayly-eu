export enum Collections {
  Games = "games",
  Settings = "settings",
  Users = "users",
}

export interface Uids {
  /** The list of users who have access to this item. */
  uids: string[];
}
