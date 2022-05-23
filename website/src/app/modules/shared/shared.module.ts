import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { GameFooterComponent } from "./game-footer/game-footer.component";
import { RouterModule } from "@angular/router";
import { FixedArDirective } from "./directives/fixed-ar.directive";

@NgModule({
  declarations: [
    GameFooterComponent,
    FixedArDirective,
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    GameFooterComponent,
    FixedArDirective,
  ],
})
export class SharedModule { }
