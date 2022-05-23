import { Component, OnDestroy } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged, map, Observable } from "rxjs";
import { ModalService } from "src/app/core/services/modal.service";
import { SpeechService } from "src/app/core/services/speech.service";
import { GameFooterItem } from "src/app/modules/shared/game-footer/game-footer.component";
import { GameComponent } from "../games";
import { SettingsModalComponent } from "./settings-modal/settings-modal.component";

const SarcasmTime = 15;

const SarcasticComments = [
  "We're waiting",
  "Tick Tock",
  "Yawn",
  "I'm bored",
];

/** The times that should be read out. */
const ReadTimes: number[] = [30, SarcasmTime, 10, 5, 3, 2, 1];

/** The number of milliseconds between timer ticks. */
const TimerInterval = 50;

export interface RummikubSettings {
  speech: boolean;
  sarcasm: boolean;
  countdown: number;
}

@Component({
  selector: "app-rummikub",
  templateUrl: "./rummikub.component.html",
  styleUrls: ["./rummikub.component.scss"],
})
export class RummikubComponent implements GameComponent<RummikubSettings>, OnDestroy {
  // ========================
  // Properties
  // ========================

  /** The absolute time at which the countdown finishes. */
  private finishAt?: number;

  public readonly footerItems: GameFooterItem[] = [
    { name: "Settings", icon: "bi-gear" },
  ];

  /** The ID of the current timer. */
  public intervalId?: number;

  /** The index of the next time to be read out. */
  private nextReadTimeIndex = 0;

  /** The amount of time remaining when the timer was paused. */
  private pauseRemaining?: number;

  /** The amount of time remaining. */
  public remaining$: BehaviorSubject<number>;

  public settings: RummikubSettings = this.loadSettings();

  /** The path that describes the timer arc. */
  public readonly svgPath$: Observable<string>;

  public readonly svgColor$: Observable<string>;

  // ========================
  // Lifecycle
  // ========================

  constructor(
    private modal: ModalService,
    private speech: SpeechService,
  ) {
    this.remaining$ = new BehaviorSubject<number>(this.settings.countdown);
    this.svgColor$ = this.getSvgColor();
    this.svgPath$ = this.getSvgPath();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  // ========================
  // Methods
  // ========================

  private getSvgColor(): Observable<string> {
    return this.remaining$.pipe(
      map((value) => {
        const green = Math.floor(256 * value / this.settings.countdown);
        const red = 255 - green;

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

  private loadSettings(): RummikubSettings {
    return {
      countdown: 60,
      speech: true,
      sarcasm: false,
    };
  }

  private readTime(time: number): void {
    const { speech, sarcasm } = this.settings;

    if (!speech) {
      return;
    }

    const nextTime = ReadTimes[this.nextReadTimeIndex];

    // Read 0.25 seconds early
    time -= .25;

    if (!nextTime || time > nextTime) {
      return;
    }

    this.nextReadTimeIndex++;

    if (nextTime === SarcasmTime) {
      // Only use sarcasm 10% of the time
      if (sarcasm && Math.floor(Math.random() * 10) === 0) {
        const comment = SarcasticComments[Math.floor(Math.random() * SarcasticComments.length)];

        void this.speech.speak(comment);
      }

      return;
    }

    void this.speech.speak(`${Math.round(time)}`);
  }

  private resetTimer() {
    const { countdown } = this.settings;

    this.finishAt = Date.now() + (countdown * 1000);
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
      Object.assign(this.settings, resp);
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
    if (this.intervalId) {
      window.clearInterval(this.intervalId);

      this.intervalId = undefined;
      this.pauseRemaining = (this.finishAt || 0) - Date.now();
    } else if (this.pauseRemaining) {
      this.finishAt = Date.now() + this.pauseRemaining;
      this.pauseRemaining = undefined;
      this.intervalId = window.setInterval(this.onTimerTick, TimerInterval);
    } else {
      this.onResetClick();
    }
  }

  public onResetClick(): void {
    this.resetTimer();

    // Ensure the timer has started
    if (!this.intervalId) {
      this.intervalId = window.setInterval(this.onTimerTick, TimerInterval);
    }
  }

  private onTimerTick = (): void => {
    let { finishAt } = this;

    if (finishAt === undefined) {
      return;
    }

    const timeLeft = Math.max(0, (finishAt - new Date().getTime()) / 1000);

    this.readTime(timeLeft);
    this.remaining$.next(timeLeft);

    if (timeLeft <= 0) {
      this.resetTimer();
    }
  }
}
