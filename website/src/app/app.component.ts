import { Component, OnDestroy, OnInit } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Data, NavigationEnd, NavigationStart, Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { filter, map, mergeMap, Observable, of, shareReplay, Subscription, tap } from "rxjs";
import { environment } from "src/environments/environment";
import { filterNonNullable } from "./core/rxjs/filters";
import { Game, Games } from "./routes/games/games";

const AppTitle = "Games";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnDestroy, OnInit {
  // ========================
  // Observables
  // ========================

  private readonly routeData$ = this.getRouteData(); // Needs to be first

  public readonly gameImage$ = this.getGameImage();

  public readonly pageTitle$ = this.getPageTitle();

  // ========================
  // Properties
  // ========================

  public collapseMenu = true;

  public readonly games$ = of(Games);

  private subscriptions: Subscription[] = [];

  // ========================
  // Lifecycle
  // ========================

  constructor(
    private auth: AngularFireAuth,
    private route: ActivatedRoute,
    private ngbModal: NgbModal,
    private router: Router,
    private titleService: Title,
  ) {
  }

  ngOnInit(): void {
    this.subscriptions.push(this.ensureUser());
    this.subscriptions.push(this.getNavStartSubscription());
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  // ========================
  // Methods
  // ========================

  private ensureUser(): Subscription {
    return this.auth.user.pipe(
      mergeMap((user) => {
        if (!user) {
          return this.auth.signInAnonymously().then((x) => x.user);
        } else {
          return of(user);
        }
      }),
      filterNonNullable(),
      tap((user) => {
        if (!environment.production) {
          console.log(`Signed in as ${user.uid}`);
        }
      }),
    ).subscribe();
  }

  private getGameImage(): Observable<string | undefined> {
    return this.routeData$.pipe(
      map((data) => {
        if ("game" in data) {
          return (data["game"] as Game).image;
        }

        return undefined;
      }),
    );
  }

  private getNavStartSubscription(): Subscription {
    return this.router.events.pipe(
      filter((e) => e instanceof NavigationStart),
      tap(() => {
        this.collapseMenu = true;
        this.ngbModal.dismissAll();
      }),
    ).subscribe();
  }

  private getPageTitle(): Observable<string> {
    return this.routeData$.pipe(
      map((data) => {
        if ("game" in data) {
          return (data["game"] as Game).name;
        } else if ("title" in data) {
          return data["title"] as string;
        } else {
          return AppTitle;
        }
      }),
      tap((title) => {
        this.titleService.setTitle(title);
      }),
    );
  }

  private getRouteData(): Observable<Data> {
    return this.router.events.pipe(
      filter((x) => x instanceof NavigationEnd),
      map(() => {
        let route = this.route.snapshot;

        while (route.firstChild) {
          route = route.firstChild;
        }

        return route.data;
      }),
      shareReplay(),
    )
  }
}
