import { Uids } from "..";

/** Represents a basic player record. */
export interface Player extends Uids {
  /** The avatar photo of the player. */
  avatar?: string;

  /** The maximum number of misses that a player can have in a row. */
  maxMisses?: number;

  /** The name of the player. */
  name: string;
}
