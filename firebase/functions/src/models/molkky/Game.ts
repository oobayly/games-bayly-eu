import { PlayerBase } from "./Player";

/** Represents a record of scores */
export interface GamePlayer extends PlayerBase {
  /** The ID of the player. */
  id: string;

  /** The number of misses. */
  misses: number;

  /** The current score. */
  score: number;

  /** The list of scores. */
  scores: number[];
}

/** Represents a game. */
export interface GameConfig {
  /** The index of the current player. */
  currentPlayer: number;

  /** The date of the game. */
  date: number;

  /** The list of players in the game. */
  players: GamePlayer[];

  /** The list of users who have access to this game. */
  uids: string[];

  /** The ID of the player that won the game. */
  winner?: string;
}

interface Score {
  hasWon?: boolean;
  isOut?: boolean;
  misses: number;
  total: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Game extends GameConfig { }
export class Game implements GameConfig {
  // ========================
  // Properties
  // ========================

  // ========================
  // Lifecycle
  // ========================

  public constructor(config: GameConfig) {
    this.loadConfig(config);
  }

  // ========================
  // Methods
  // ========================

  public addScore(score: number): void {
    const player = this.players[this.currentPlayer];

    player.scores.push(score);

    this.recalculateScores();
    this.moveNext();
  }

  private getScore(player: GamePlayer, rounds?: number): Score {
    if (rounds === undefined) {
      rounds = player.scores.length;
    }

    const { maxMisses, reset, target } = player;
    const resp: Score = {
      misses: 0,
      total: 0,
    };

    for (let i = 0; i < rounds; i++) {
      const score = player.scores[i];

      resp.total += score;

      if (reset !== undefined && resp.total > target) {
        resp.total = reset;
      }

      if (maxMisses !== undefined) {
        if (score) {
          resp.misses = 0;
        } else {
          resp.misses++;

          if (resp.misses > maxMisses) {
            resp.isOut = true;

            break;
          }
        }
      }

      resp.hasWon = reset === undefined
        ? (resp.total >= target)
        : (resp.total === target)
        ;

      if (resp.hasWon) {
        break;
      }
    }

    return resp;
  }

  /** Calculates the current score for the specified record in the game. */
  private calculateScore(player: GamePlayer): number | undefined {
    const { reset, target } = this;
    let misses = 0;
    let wonAt: number | undefined;
    let total = 0;

    for (let i = 0; i < player.scores.length; i++) {
      const score = player.scores[i];
      total += score;

      if (reset !== undefined && total > target) {
        total = reset;
      }

      if (score === 0) {
        misses++;
      }

      if (total === target) {
        wonAt = i;

        break;
      }
    }

    player.misses = misses;
    player.score = total;

    return wonAt;
  }

  private recalculateScores(): void {
    const { winner } = this.players.reduce(
      (accum, player) => {
        const wonAt = this.calculateScore(player);

        if (wonAt !== undefined && wonAt < accum.wonAt) {
          accum.wonAt = wonAt;
          accum.winner = player.id;
        }

        return accum;
      },
      {
        winner: undefined as string | undefined,
        wonAt: Number.MAX_VALUE,
      }
    );

    this.winner = winner;
  }

  public loadConfig(config: GameConfig) {
    Object.assign(this, config);
  }

  private moveNext() {
    const { target, reset, maxMisses } = this;

    this.currentPlayer = (this.currentPlayer + 1) % this.players.length;

  }

  public updateScores(playerId: string, scores: number[]): void {
    const player = this.players.find((x) => x.id === playerId);

    if (!player) {
      throw new Error(`Couldn't find player with ID '${playerId}'`);
    }

    player.scores = scores;

    this.recalculateScores();
  }

  public toConfig(): GameConfig {
    return Object.assign({} as GameConfig, this);
  }
}
