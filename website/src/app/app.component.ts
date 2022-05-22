import { Component } from "@angular/core";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Data, NavigationEnd, Router } from "@angular/router";
import { filter, map, Observable, shareReplay, tap } from "rxjs";
import { Game } from "./routes/games/games";

const AppTitle = "Games";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  // ========================
  // Properties
  // ========================

  private readonly routeData$ = this.getRouteData();

  public readonly pageTitle$ = this.getPageTitle();

  // ========================
  // Lifecycle
  // ========================

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
  ) {
  }

  // ========================
  // Methods
  // ========================

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
