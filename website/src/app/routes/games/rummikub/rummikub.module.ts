import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RummikubRoutingModule } from "./rummikub-routing.module";
import { RummikubComponent } from "./rummikub.component";
import { SharedModule } from "src/app/modules/shared/shared.module";


@NgModule({
  declarations: [
    RummikubComponent,
  ],
  imports: [
    CommonModule,
    RummikubRoutingModule,
    SharedModule,
  ],
})
export class RummikubModule { }
