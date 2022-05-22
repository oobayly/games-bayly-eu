import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { PublicRoutingModule } from "./public-routing.module";
import { PrivacyComponent } from "./privacy/privacy.component";


@NgModule({
  declarations: [
    PrivacyComponent,
  ],
  imports: [
    CommonModule,
    PublicRoutingModule,
  ],
})
export class PublicModule { }
