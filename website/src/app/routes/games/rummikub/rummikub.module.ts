import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RummikubRoutingModule } from "./rummikub-routing.module";
import { RummikubComponent } from "./rummikub.component";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { SettingsModalComponent } from "./settings-modal/settings-modal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    RummikubComponent,
    SettingsModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RummikubRoutingModule,
    SharedModule,
  ],
})
export class RummikubModule { }
