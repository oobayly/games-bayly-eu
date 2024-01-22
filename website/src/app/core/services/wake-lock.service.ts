import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, Subscription, combineLatest, mergeMap } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WakeLockService implements OnDestroy {
  private readonly enabled$ = new BehaviorSubject(false);

  private wakeLock?: WakeLockSentinel;

  private readonly wakeLockSub: Subscription;

  private readonly visible$ = new BehaviorSubject(false);

  constructor() {
    document.addEventListener("visibilitychange", this.visibilityChange);

    this.wakeLockSub = combineLatest([
      this.enabled$,
      this.visible$,
    ]).pipe(
      mergeMap(async ([enabled, visible]) => {
        if (enabled && visible) {
          return await this.getWakeLock();
        }

        return undefined;
      }),
    ).subscribe((lock) => {
      if (lock != this.wakeLock) {
        if (this.wakeLock && !this.wakeLock.released) {
          this.wakeLock.release();
        }

        this.wakeLock = lock;
      }
    });
  }

  ngOnDestroy(): void {
    this.wakeLockSub.unsubscribe();
    document.removeEventListener("visibilitychange", this.visibilityChange);

    if (this.wakeLock) {
      this.wakeLock.release();
    }
  }

  public releaseLock(): void {
    this.enabled$.next(false);
  }

  public requestLock(): void {
    this.enabled$.next(true);
  }

  private async getWakeLock(): Promise<WakeLockSentinel | undefined> {
    if (this.wakeLock && !this.wakeLock.released) {
      return this.wakeLock;
    }

    if (!("wakeLock" in navigator)) {
      return undefined;
    }

    let lock: WakeLockSentinel;

    try {
      lock = await navigator.wakeLock.request("screen");
    } catch {
      return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-function
    lock.addEventListener("release", () => {
    });

    return lock;
  }

  private readonly visibilityChange = (): void => {
    this.visible$.next(document.visibilityState === "visible");
  }
}
