import { Component, OnDestroy } from "@angular/core";
import { BehaviorSubject, distinctUntilChanged, map } from "rxjs";

/** The number of seconds for a countdown. */
const Countdown = 30;

/** The times that should be read out. */
const ReadTimes = [30, 10, 5, 3, 2, 1];

/** The number of milliseconds between timer ticks. */
const TimerInterval = 50;

@Component({
  selector: "app-rummikub",
  templateUrl: "./rummikub.component.html",
  styleUrls: ["./rummikub.component.scss"],
})
export class RummikubComponent implements OnDestroy {
  // ========================
  // Properties
  // ========================

  /** The absolute time at which the countdown finishes. */
  private finishAt?: number;

  /** The ID of the current timer. */
  public intervalId?: number;

  /** The index of the next time to be read out. */
  private nextReadTimeIndex = 0;

  /** The amount of time remaining when the timer was paused. */
  private pauseRemaining?: number;

  /** The amount of time remaining. */
  public remaining$ = new BehaviorSubject<number>(0);

  /** The time remaining as an integer. */
  public remainingInt$ = this.remaining$.pipe(map((x) => Math.round(x)), distinctUntilChanged());

  // ========================
  // Lifecycle
  // ========================

  constructor() { }

  ngOnDestroy(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
    }
  }

  // ========================
  // Methods
  // ========================

  private readTime(time: number): Promise<void> {
    return new Promise<void>((res) => {
      const utterance = new SpeechSynthesisUtterance(`${Math.round(time)}`);

      window.speechSynthesis.speak(utterance);

      res();
    });
  }

  private resetTimer() {
    this.finishAt = Date.now() + (Countdown * 1000);
    this.nextReadTimeIndex = ReadTimes.findIndex((x) => x < Countdown) || -1;
    this.pauseRemaining = undefined;
  }

  // ========================
  // Event handlers
  // ========================

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
    const nextTime = ReadTimes[this.nextReadTimeIndex];

    if (nextTime && timeLeft <= nextTime) {
      this.nextReadTimeIndex++;

      void this.readTime(timeLeft);
    }

    this.remaining$.next(timeLeft);

    if (timeLeft <= 0) {
      this.resetTimer();
    }
  }
}
