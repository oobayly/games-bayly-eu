import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { SettingsServiceBase } from "src/app/core/services/settings.service";
import { RummikubSettings } from "./rummikub.component";

@Injectable({
  providedIn: "root",
})
export class SettingsService extends SettingsServiceBase<RummikubSettings> {
  protected readonly gameName = "rummikub";

  constructor(
    auth: AngularFireAuth,
    db: AngularFirestore,
  ) {
    super(auth, db);
  }

  protected getDefaultSettings(): RummikubSettings {
    return {
      countdown: 60,
      speech: true,
      sarcasm: 0,
    };
  }
}
