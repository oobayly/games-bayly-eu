import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SpeechService implements OnDestroy {
  // ========================
  // Properties
  // ========================

  /** Returns a flag indicating whether speech synthesis is supported. */
  public readonly hasSynthesis = "speechSynthesis" in window;

  /** Gets the list of available synthesis voices. */
  public readonly voices$ = new BehaviorSubject<SpeechSynthesisVoice[] | undefined>(undefined);

  private currentVoice?: SpeechSynthesisVoice | undefined;

  // ========================
  // Lifecycle
  // ========================

  constructor() {
    if (this.hasSynthesis) {
      this.voices$.next(window.speechSynthesis.getVoices());
      window.speechSynthesis.addEventListener("voiceschanged", this.onVoicesChanged);
    }
  }

  ngOnDestroy(): void {
    if (this.hasSynthesis) {
      window.speechSynthesis.removeEventListener("voiceschanged", this.onVoicesChanged);
    }
  }

  // ========================
  // Methods
  // ========================

  public getCurrentVoice(): SpeechSynthesisVoice | undefined {
    return this.currentVoice;
  }

  public setCurrentVoice(voiceURI: string): void;
  public setCurrentVoice(voice: SpeechSynthesisVoice): void;
  public setCurrentVoice(voice: string | SpeechSynthesisVoice): void {
    if (voice instanceof SpeechSynthesisVoice) {
      voice = voice.voiceURI;
    }

    const found = this.voices$.value?.find((v) => v.voiceURI === voice);

    if (!found) {
      throw new Error(`Voice '${voice}' couldn't be found.`);
    }

    this.currentVoice = found;
  }

  public async speak(utterance: string | SpeechSynthesisUtterance): Promise<void> {
    if (!this.hasSynthesis) {
      return Promise.reject("Speech synthesis is not supported.");
    }

    const { currentVoice } = this;

    return new Promise<void>((res, rej) => {
      if (typeof utterance === "string") {
        utterance = new SpeechSynthesisUtterance(utterance);
      }

      if (!utterance.voice && currentVoice) {
        utterance.voice = currentVoice;
        utterance.lang = currentVoice.lang;
      }

      window.speechSynthesis.speak(utterance);

      utterance.addEventListener("end", (_e) => {
        res();
      });

      utterance.addEventListener("error", (e) => {
        rej(e);
      });
    });
  }

  // ========================
  // Event handlers
  // ========================

  private onVoicesChanged = () => {
    const voices = window.speechSynthesis.getVoices();

    this.voices$.next(voices);

    if (!this.currentVoice) {
      this.currentVoice = voices.find((v) => v.lang === navigator.language);
    }
  }
}
