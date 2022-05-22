import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { getGameRoutes } from "./games";
import { IndexComponent } from "./index/index.component";

const routes: Routes = [
  {
    path: "",
    component: IndexComponent,
  },
  ...getGameRoutes()
 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamesRoutingModule {
}
