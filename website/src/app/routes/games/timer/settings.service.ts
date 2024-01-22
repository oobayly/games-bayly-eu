import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { SettingsServiceBase } from "src/app/core/services/settings.service";
import { TimerSettings } from "./timer.component";

@Injectable({
  providedIn: "root",
})
export class SettingsService extends SettingsServiceBase<TimerSettings> {
  protected readonly gameName = "timer";

  constructor(
    auth: AngularFireAuth,
    db: AngularFirestore,
  ) {
    super(auth, db);
  }

  protected getDefaultSettings(): TimerSettings {
    return {
      countdown: 60,
      speech: true,
      sarcasm: 0,
    };
  }
}
