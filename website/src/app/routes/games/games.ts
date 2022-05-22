import { Route } from "@angular/router";

export interface Game {
  name: string;
  route: string;
  image?: string;
}

/** A list of all the games */
export const Games: Game[] = [
  {
    name: "Molkky",
    route: "molkky",
  },
  {
    name: "Rummikub",
    route: "rummikub",
  }
]

/** Get all the routes for the available games. */
export function getGameRoutes(): Route[] {
  return Games.map((game) => {
    const { name, route } = game;

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
