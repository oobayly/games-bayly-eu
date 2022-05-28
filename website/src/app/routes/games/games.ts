import { Type } from "@angular/core";
import { Route } from "@angular/router";
import { GameFooterItem } from "src/app/modules/shared/game-footer/game-footer.component";
import { MolkkyModule } from "./molkky/molkky.module";
import { RummikubModule } from "./rummikub/rummikub.module";

export interface Game {
  name: string;
  route: string;
  image?: string;
  type: Type<any>;
}

export interface GameComponent<TSettings> {
  readonly footerItems: GameFooterItem[];
  settings: TSettings;
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
    name: "Rummikub",
    route: "rummikub",
    type: RummikubModule,
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
