import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { getGameRoutes } from "./games";
import { IndexPageComponent } from "./pages/index-page/index-page.component";

const routes: Routes = [
  {
    path: "",
    component: IndexPageComponent,
    data: {
      title: "All Games",
    },
  },
  {
    path: "molkky",
    loadChildren: () => import("./molkky/molkky.module").then((m) => m.MolkkyModule),
    data: {
      game: {
        name: "Mölkky",
      },
    },
  },
  {
    path: "timer",
    loadChildren: () => import("./timer/timer.module").then((m) => m.TimerModule),
    data: {
      game: {
        name: "Timer",
      },
    },
  },
  //...getGameRoutes(),
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamesRoutingModule {
}
