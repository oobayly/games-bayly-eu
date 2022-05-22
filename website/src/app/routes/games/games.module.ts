import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GamesRoutingModule } from "./games-routing.module";
import { IndexComponent } from "./index/index.component";


@NgModule({
  declarations: [
    IndexComponent,
  ],
  imports: [
    CommonModule,
    GamesRoutingModule,
  ],
})
export class GamesModule { }
