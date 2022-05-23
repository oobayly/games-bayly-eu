import { Injectable, OnDestroy } from "@angular/core";
import { BehaviorSubject, firstValueFrom } from "rxjs";

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
  public readonly voices = new BehaviorSubject<SpeechSynthesisVoice[] | undefined>(undefined);

  // ========================
  // Lifecycle
  // ========================

  constructor() {
    if (this.hasSynthesis) {
      window.speechSynthesis.getVoices();
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

  public setCurrentVoice(voice: string | SpeechSynthesisVoice) {
    if (voice instanceof SpeechSynthesisVoice) {
      voice = voice.name;
    }

    const found = this.voices.value?.find((v) => v.name === voice);

    if (!found) {
      throw new Error(`Voice '${voice}' couldn't be found.`);
    }
  }

  public async speak(utterance: string | SpeechSynthesisUtterance): Promise<void> {
    if (!this.hasSynthesis) {
      return Promise.reject("Speech synthesis is not supported.");
    }

    const voices = await firstValueFrom(this.voices);
    const { language } = navigator;
    const voice = voices?.find((x) => x.lang === language) || null;

    return new Promise<void>((res, rej) => {
      if (typeof utterance === "string") {
        utterance = new SpeechSynthesisUtterance(utterance);
      }

      if (!utterance.voice && voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
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
    this.voices.next(window.speechSynthesis.getVoices());
  }
}
