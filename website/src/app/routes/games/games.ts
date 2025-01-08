import { GameFooterItem } from "src/app/modules/components/game-footer/game-footer.component";

export interface Game {
  name: string;
  route: string;
  image?: string;
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
  },
  {
    name: "Timer",
    route: "timer",
  },
]
