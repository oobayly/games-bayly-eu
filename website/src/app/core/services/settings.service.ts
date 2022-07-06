import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { AngularFirestore, AngularFirestoreDocument } from "@angular/fire/compat/firestore";
import { Collections } from "@models";
import { map, Observable, startWith, switchMap } from "rxjs";
import { filterNonNullable } from "../rxjs/filters";

@Injectable({
  providedIn: "root",
})
export abstract class SettingsServiceBase<T> {
  protected abstract readonly gameName: string;

  constructor(
    private auth: AngularFireAuth,
    private db: AngularFirestore,
  ) { }

  protected abstract getDefaultSettings(): T;

  /** Gets the settings for the current user. */
  public getSettings(): Observable<T> {
    return this.auth.user.pipe(
      filterNonNullable(),
      switchMap((user) => this.getSettingsRef(user.uid).snapshotChanges()),
      map((doc) => doc.payload.data()),
      filterNonNullable(),
      startWith(this.getDefaultSettings()),
    );
  }

  private getSettingsRef(uid: string): AngularFirestoreDocument<T> {
    return this.db
      .collection(Collections.Users).doc(uid)
      .collection<T>(Collections.Settings).doc(this.gameName)

  }

  /** Saves the settings for the current user. */
  public async saveSettings(value: T): Promise<void> {
    const user = await this.auth.currentUser;

    if (!user) {
      throw new Error("Not signed in.");
    }

    const settings: T = {
      ...this.getDefaultSettings(),
      ...value,
    };

    await this.getSettingsRef(user.uid).set(settings);
  }
}
