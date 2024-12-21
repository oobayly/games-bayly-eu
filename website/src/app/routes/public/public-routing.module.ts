import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PrivacyPageComponent } from "./pages/privacy-page/privacy-page.component";

const routes: Routes = [
  {
    path: "privacy",
    component: PrivacyPageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PublicRoutingModule { }
