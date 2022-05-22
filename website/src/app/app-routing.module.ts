import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "games",
  },
  {
    path: "games",
    loadChildren: () => import("./routes/games/games.module").then((m) => m.GamesModule),
  },
  {
    path: "",
    loadChildren: () => import("./routes/public/public.module").then((m) => m.PublicModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
