import { enableProdMode, importProvidersFrom } from "@angular/core";
import { Routes, provideRouter } from "@angular/router";
import { bootstrapApplication } from "@angular/platform-browser";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { firebaseConfig } from "./environments/firebase-config";
import { AppComponent } from "./app/app.component";
import { environment } from "./environments/environment";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "games",
  },
  {
    path: "games",
    loadChildren: () => import("./app/routes/games/games.module").then((m) => m.GamesModule),
  },
  {
    path: "",
    loadChildren: () => import("./app/routes/public/public.module").then((m) => m.PublicModule),
  },
];

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(
  AppComponent,
  {
    providers: [
      provideRouter(routes),
      importProvidersFrom(
        NgbModule,
        AngularFireModule.initializeApp(firebaseConfig),
        AngularFireAuthModule,
      ),
    ],
  },
).catch(err => console.error(err));
