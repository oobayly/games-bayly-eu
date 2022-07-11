import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Action, AngularFirestore, DocumentChangeAction, DocumentSnapshot } from "@angular/fire/compat/firestore";
import { Game, MolkkyCollections, Player } from "@models/molkky";
import firebase from "firebase/compat/app";
import { filter, first, Observable, switchMap } from "rxjs";
import { SettingsServiceBase } from "src/app/core/services/settings.service";

@Injectable({
  providedIn: "root",
})
export class SettingsService extends SettingsServiceBase<void> {
  protected readonly gameName = "molkky";

  constructor(
    auth: AngularFireAuth,
    db: AngularFirestore,
  ) {
    super(auth, db);
  }

  protected getDefaultSettings(): void {
    throw new Error("Method not implemented.");
  }

  public async addGame(game: Game): Promise<string> {
    const doc = this.getGameRef().collection<Game>(MolkkyCollections.Games).doc();

    await doc.set(game);

    return doc.ref.id;
  }

  public async addPlayer(player: Player): Promise<string> {
    const doc = this.getGameRef().collection<Player>(MolkkyCollections.Players).doc();

    await doc.set(player);

    return doc.ref.id;
  }

  public getGame(gameId: string): Observable<Action<DocumentSnapshot<Game>>> {
    return this.getGameRef().collection<Game>(MolkkyCollections.Games).doc(gameId).snapshotChanges();
  }

  public getGames(): Observable<DocumentChangeAction<Game>[]> {
    return this.auth.user.pipe(
      filter((u): u is firebase.User => !!u),
      first(),
      switchMap((u) => {
        return this.getGameRef().collection<Game>(
          MolkkyCollections.Games,
          (ref) => ref.where("uids", "array-contains", u.uid),
        ).snapshotChanges();
      }),
    );
  }

  public getPlayers(): Observable<DocumentChangeAction<Player>[]> {
    return this.auth.user.pipe(
      filter((u): u is firebase.User => !!u),
      first(),
      switchMap((u) => {
        return this.getGameRef().collection<Player>(
          MolkkyCollections.Players,
          (ref) => ref.where("uids", "array-contains", u.uid),
        ).snapshotChanges();
      }),
    );
  }

  public updateGame(gameId: string, game: Game): Promise<void> {
    return this.getGameRef().collection<Game>(MolkkyCollections.Games).doc(gameId).set(game);
  }

  public updatePlayer(playerId: string, player: Player): Promise<void> {
    return this.getGameRef().collection<Player>(MolkkyCollections.Players).doc(playerId).set(player);
  }
}
