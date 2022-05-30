import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire/compat";
import { AngularFireAuthModule, USE_EMULATOR as USE_AUTH_EMULATOR } from "@angular/fire/compat/auth";
import { USE_EMULATOR as USE_FIRESTORE_EMULATOR } from "@angular/fire/compat/firestore";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BrowserModule } from "@angular/platform-browser";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { environment } from "src/environments/environment";
import { firebaseConfig } from "src/environments/firebase-config";

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
  ],
  providers: [
    { provide: USE_FIRESTORE_EMULATOR, useValue: environment.emulate ? ["localhost", 8080] : undefined },
    { provide: USE_AUTH_EMULATOR, useValue: environment.emulate ? ["http://localhost:9099"] : undefined },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
