import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IndexComponent } from "./index/index.component";

const routes: Routes = [
  {
    path: "",
    component: IndexComponent,
  },
  {
    path: "molkky",
    loadChildren: () => import("./molkky/molkky.module").then((m) => m.MolkkyModule),
  },
  {
    path: "rummikub",
    loadChildren: () => import("./rummikub/rummikub.module").then((m) => m.RummikubModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamesRoutingModule { }
