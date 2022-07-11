export * from "./Game";
export * from "./Player";

export enum MolkkyCollections {
  Games = "games",
  Players = "players",
}

/** Represents an object for sharing data. */
export interface ShareObject {
  /** The ID of the object being shared. */
  id: string;

  /** The type of object being shared. */
  type: "game" | "player";
}
