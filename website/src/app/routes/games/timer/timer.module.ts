import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { TimerRoutingModule } from "./timer-routing.module";
import { TimerComponent } from "./timer.component";
import { SharedModule } from "src/app/modules/shared/shared.module";
import { SettingsModalComponent } from "./settings-modal/settings-modal.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

@NgModule({
  declarations: [
    TimerComponent,
    SettingsModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TimerRoutingModule,
    SharedModule,
  ],
})
export class TimerModule { }
