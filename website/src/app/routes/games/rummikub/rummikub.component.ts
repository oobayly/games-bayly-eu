import { Component, OnDestroy } from "@angular/core";
import { BehaviorSubject, combineLatest, distinctUntilChanged, interval, map, Observable, of, shareReplay, Subject, Subscription, switchMap, takeUntil, tap } from "rxjs";
import { filterNonNullable } from "src/app/core/rxjs/filters";
import { ModalService } from "src/app/core/services/modal.service";
import { SpeechService } from "src/app/core/services/speech.service";
import { GameFooterItem } from "src/app/modules/shared/game-footer/game-footer.component";
import { GameComponent } from "../games";
import { SettingsModalComponent } from "./settings-modal/settings-modal.component";
import { SettingsService } from "./settings.service";

const SarcasmTime = 15;

const SarcasticComments: Comment[] = [
  { text: "We're waiting" },
  { text: "Tick Tock" },
  { text: "Yawn", rate: .4, pitch: .5 },
  { text: "I'm bored" },
];

interface Comment {
  text: string;
  rate?: number;
  pitch?: number;
}

/** The times that should be read out. */
const ReadTimes: number[] = [30, SarcasmTime, 10, 3, 2, 1];

/** The number of milliseconds between timer ticks. */
const TimerInterval = 50;

export interface RummikubSettings {
  speech: boolean;
  sarcasm: number;
  countdown: number;
}

@Component({
  selector: "app-rummikub",
  templateUrl: "./rummikub.component.html",
  styleUrls: ["./rummikub.component.scss"],
})
export class RummikubComponent implements GameComponent, OnDestroy {
  // ========================
  // Properties
  // ========================

  private readonly destroyed$ = new Subject<void>();

  public readonly enabled$ = new BehaviorSubject<boolean>(false);

  /** The absolute time at which the countdown finishes. */
  private readonly finishAt$ = new BehaviorSubject<number | undefined>(undefined);

  public readonly footerItems: GameFooterItem[] = [
    { name: "Settings", icon: "bi-gear" },
  ];

  /** The index of the next time to be read out. */
  private nextReadTimeIndex = 0;

  /** The amount of time remaining when the timer was paused. */
  private pauseRemaining?: number;

  /** The amount of time remaining. */
  public readonly remaining$: Observable<number>;

  private settings!: RummikubSettings;

  /** The path that describes the timer arc. */
  public readonly svgPath$: Observable<string>;

  public readonly svgColor$: Observable<string>;

  private subscriptions: Subscription[] = [];

  // ========================
  // Lifecycle
  // ========================

  constructor(
    private modal: ModalService,
    private settingsService: SettingsService,
    private speech: SpeechService,
  ) {
    this.subscriptions.push(this.getSettingsSubscription());
    this.remaining$ = this.getRemainingObservable();
    this.svgColor$ = this.getSvgColor();
    this.svgPath$ = this.getSvgPath();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  // ========================
  // Methods
  // ========================

  private getRemainingObservable(): Observable<number> {
    const interval$ = this.enabled$.pipe(
      switchMap((enabled) => enabled ? interval(TimerInterval) : of()),
    );

    return combineLatest([
      this.finishAt$,
      interval$,
    ]).pipe(
      map(([finishAt]) => {
        if (!finishAt) {
          return undefined;
        }

        // Round to 0.1 of second
        return Math.round((finishAt - Date.now()) * 10 / 1000) / 10;
      }),
      filterNonNullable(),
      distinctUntilChanged(),
      tap((time) => {
        if (time < 0) {
          this.resetTimer();
        } else {
          this.readTime(time);
        }
      }),
    );
  }

  private getSettingsSubscription(): Subscription {
    return this.settingsService.getSettings().pipe(
      tap((settings) => {
        this.settings = settings;

        if (this.enabled$.value) {
          this.resetTimer();
        }
      }),
      takeUntil(this.destroyed$),
      shareReplay(),
    ).subscribe();
  }

  private getSvgColor(): Observable<string> {
    return this.remaining$.pipe(
      map((value) => {
        const x = Math.floor(512 * value / this.settings.countdown);
        let green: number;
        let red: number;

        if (x > 255) {
          green = 0xff;
          red = 511 - x;
        } else {
          green = x;
          red = 0xff;
        }

        return `#${red.toString(16).padStart(2, "0")}${green.toString(16).padStart(2, "0")}00`;
      }),
      distinctUntilChanged(),
    );
  }

  private getSvgPath(): Observable<string> {
    return this.remaining$.pipe(
      map((value) => {
        return 360 - Math.round(360 * value / this.settings.countdown);
      }),
      distinctUntilChanged(),
      map((angle) => {
        // See https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths
        const x = (50 * Math.sin(angle * Math.PI / 180)).toFixed(3);
        const y = (-50 * Math.cos(angle * Math.PI / 180)).toFixed(3);
        const largeArc = angle <= 180 ? 0 : 1;
        return `M 0 -50 A 50 50 0 ${largeArc} 1 ${x} ${y} L 0 0 Z`;
      }),
    );
  }

  private async readTime(time: number): Promise<void> {
    const { speech, sarcasm } = this.settings;
    const nextTime = ReadTimes[this.nextReadTimeIndex];

    // Read 0.25 seconds early
    time -= .25;

    if (!nextTime || time > nextTime) {
      return;
    }

    this.nextReadTimeIndex++;

    if (nextTime === SarcasmTime) {
      const playComment = sarcasm && Math.floor(Math.random() * 1 / sarcasm) === 0;

      if (playComment) {
        const comment = SarcasticComments[Math.floor(Math.random() * SarcasticComments.length)];
        const u = new SpeechSynthesisUtterance(comment.text);

        if (comment.pitch) {
          u.pitch = comment.pitch;
        }
        if (comment.rate) {
          u.rate = comment.rate;
        }

        void this.speech.speak(u);
      }

      return;
    }

    if (speech) {
      await this.speech.speak(`${Math.round(time)}`);
    }
  }

  private resetTimer(): void {
    const { countdown } = this.settings;

    this.enabled$.next(true);
    this.finishAt$.next(Date.now() + (countdown * 1000));
    this.nextReadTimeIndex = ReadTimes.findIndex((x) => x < countdown);
    this.pauseRemaining = undefined;
  }

  private async showSettingsModal(): Promise<boolean> {
    const resp = await this.modal.showModal<SettingsModalComponent, RummikubSettings>({
      type: SettingsModalComponent,
      callback: (instance) => {
        instance.value = this.settings;
      },
    });

    if (resp) {
      await this.settingsService.saveSettings(resp);
    }

    return !!resp;
  }

  // ========================
  // Event handlers
  // ========================

  public async onFooterItemClick(item: GameFooterItem): Promise<void> {
    if (item.name === "Settings") {
      void this.showSettingsModal();
    }
  };

  public onPauseClick(): void {
    const isEnabled = this.enabled$.value;

    if (isEnabled) {
      // Keep a reference to the amount of time remaining so the time can be resumed
      this.pauseRemaining = (this.finishAt$.value || 0) - Date.now();
      this.enabled$.next(false);
    } else if (this.pauseRemaining) {
      // Use the time remaining and resume the timer
      this.finishAt$.next(Date.now() + this.pauseRemaining);
      this.pauseRemaining = undefined;
      this.enabled$.next(true);
    } else {
      this.resetTimer();
    }
  }

  public onResetClick(): void {
    this.resetTimer();
  }
}
