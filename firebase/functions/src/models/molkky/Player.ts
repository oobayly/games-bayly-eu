/** Represents a basic player record. */
export interface PlayerBase {
  /** The maximum number of misses that a player can have in a row. */
  maxMisses?: number;

  /** The name of the player. */
  name: string;

  /** The score that a player is reset to when they exceed the target. */
  reset?: number;

  /** The target score. */
  target: number;
}

/** Represents a player record. */
export interface Player extends PlayerBase {
  /** The avatar photo of the player. */
  avatar?: string;

  /** The list of users who have access to this player. */
  uids: string[];
}
