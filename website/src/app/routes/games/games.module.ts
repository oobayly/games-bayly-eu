import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { GamesRoutingModule } from "./games-routing.module";
import { IndexComponent } from "./index/index.component";
import { ReactiveFormsModule } from "@angular/forms";


@NgModule({
  declarations: [
    IndexComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GamesRoutingModule,
  ],
})
export class GamesModule { }
