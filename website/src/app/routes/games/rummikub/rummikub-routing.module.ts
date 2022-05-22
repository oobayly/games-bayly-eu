import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { RummikubComponent } from "./rummikub.component";

const routes: Routes = [
  {
    path: "",
    component: RummikubComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RummikubRoutingModule { }
