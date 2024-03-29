import { Type } from "@angular/core";
import { Route } from "@angular/router";
import { GameFooterItem } from "src/app/modules/shared/game-footer/game-footer.component";
import { MolkkyModule } from "./molkky/molkky.module";
import { TimerModule } from "./timer/timer.module";

export interface Game {
  name: string;
  route: string;
  image?: string;
  type: Type<unknown>;
}

export interface GameComponent {
  readonly footerItems: GameFooterItem[];
  onFooterItemClick: (item: GameFooterItem) => void | Promise<void>;
}

/** A list of all the games */
export const Games: Game[] = [
  {
    name: "Mölkky",
    route: "molkky",
    type: MolkkyModule,
  },
  {
    name: "Timer",
    route: "timer",
    type: TimerModule,
  },
]

/** Get all the routes for the available games. */
export function getGameRoutes(): Route[] {
  return Games.map((game) => {
    const { route } = game;

    return {
      path: game.route,
      loadChildren: () => import(`./${route}/${route}.module`).then((m) => {
        const moduleName = Object.keys(m).find((x) => x.endsWith("Module"));

        if (!moduleName) {
          throw new Error(`Cannot find exported module in ${route}.module.`);
        }

        return m[moduleName];
      }),
      data: {
        game,
      },
    };
  });
}
