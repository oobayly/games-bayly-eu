import { Component, EventEmitter, Input, Output } from "@angular/core";

export interface GameFooterItem {
  name: string;
  icon: string;
  route?: string;
  onClick?: () => void | Promise<void>;
}

@Component({
  selector: "app-game-footer",
  templateUrl: "./game-footer.component.html",
  styleUrls: ["./game-footer.component.scss"],
})
export class GameFooterComponent {
  /** The list of footer items. */
  @Input()
  public items?: GameFooterItem[];

  @Output()
  public readonly itemClick = new EventEmitter<GameFooterItem>();

  public onItemClick(item: GameFooterItem): void {
    this.itemClick.next(item);

    if (item.onClick) {
      item.onClick();
    }
  }
}
