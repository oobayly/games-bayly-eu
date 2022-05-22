import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RummikubRoutingModule } from "./rummikub-routing.module";
import { RummikubComponent } from "./rummikub.component";


@NgModule({
  declarations: [
    RummikubComponent,
  ],
  imports: [
    CommonModule,
    RummikubRoutingModule,
  ],
})
export class RummikubModule { }
