import { Uids } from "..";
import { Player } from "./Player";

/** Represents a record of scores */
export interface GamePlayer extends Player {
  /** The ID of the player. */
  id: string;

  /** The score that a player is reset to when they exceed the target. */
  reset?: number;

  /** The number of misses. */
  misses: number;

  /** The current score. */
  score: number;

  /** The list of scores. */
  scores: number[];

  /** The target score. */
  target?: number;
}

/** Represents a game. */
export interface Game extends Uids {
  /** The index of the current player. */
  currentPlayer: number;

  /** The date of the game. */
  date: number;

  /** The list of players in the game. */
  players: GamePlayer[];

  /** The score that a player is reset to when they exceed the target. */
  reset: number;

  /** The target score. */
  target: number;

  /** The ID of the player that won the game. */
  winner?: string;
}

// ==========================
// Game methods
// ==========================

const addScore = (game: Game, score: number): void => {
  const player = game.players[game.currentPlayer];

  player.scores.push(score);

  recalculateScores(game);
  moveNext(game);
}

/** Calculates the current score for the specified record in the game. */
const calculateScore = (game: Game, player: GamePlayer, rounds?: number): number | undefined => {
  if (rounds === undefined) {
    rounds = player.scores.length;
  }

  const reset = player.reset || game.reset;
  const target = player.target || game.target;
  const { maxMisses } = player;
  let total = 0;
  let misses = 0;
  let wonAt: number | undefined = undefined;

  for (let i = 0; i < rounds; i++) {
    const score = player.scores[i];

    total += score;

    if (reset !== undefined && total > target) {
      total = reset;
    }

    if (maxMisses !== undefined) {
      if (score) {
        misses = 0;
      } else {
        misses++;

        if (misses > maxMisses) {
          break;
        }
      }
    }

    if (total >= target) {
      wonAt = i;

      break;
    }
  }

  Object.assign(player, {
    misses,
    total,
  });

  return wonAt;
}

const getPlayer = (game: Game, player: string | GamePlayer): GamePlayer => {
  const id = typeof player === "string" ? player : player.id;
  const found = game.players.find((x) => x.id === id);

  if (!found) {
    throw new Error(`Couldn't find player with ID '${id}'`);
  }

  return found;
}

const recalculateScores = (game: Game): void => {
  const { winner } = game.players.reduce(
    (accum, player) => {
      const wonAt = calculateScore(game, player);

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

  game.winner = winner;
}

const moveNext = (game: Game) => {
  const count = game.players.length;
  let nextPlayer = game.currentPlayer;

  for (let i = 0; i < count; i++) {
    nextPlayer = (nextPlayer + 1) % count;

    const player = game.players[nextPlayer];
    const hasWon = player.score >= (player.target || game.target);
    const isOut = player.misses > (player.maxMisses || Number.MAX_SAFE_INTEGER);

    if (hasWon || isOut) {
      continue;
    }

    break;
  }

  game.currentPlayer = nextPlayer;
}

const updateLast = (game: Game, player: string | GamePlayer, score: number): void => {
  const { scores } = getPlayer(game, player);

  scores[scores.length - 1] = score;

  recalculateScores(game);
}

const updateScores = (game: Game, player: string | GamePlayer, scores: number[]): void => {
  const found = getPlayer(game, player);

  found.scores = scores;

  recalculateScores(game);
}

export {
  addScore,
  updateLast,
  updateScores,
};
