import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { map, Observable, startWith } from "rxjs";
import { BaseModal } from "src/app/core/services/modal.service";
import { TimerSettings } from "../timer.component";

interface FormValues {
  countdown: FormControl<number>;
  speech: FormControl<boolean>;
  sarcasm: FormControl<number>;
}

@Component({
  selector: "app-settings-modal",
  templateUrl: "./settings-modal.component.html",
  styleUrls: ["./settings-modal.component.scss"],
})
export class SettingsModalComponent implements BaseModal<TimerSettings>, OnInit {
  public readonly form = this.buildForm();

  public sarcasmLabel?: Observable<string>;

  public set value(value: TimerSettings) {
    this.form.patchValue(value, { emitEvent: true, onlySelf: false });
  }

  public get value(): TimerSettings {
    if (this.form.invalid) {
      throw new Error("Settings cannot be retrieved.");
    }

    return this.form.value as TimerSettings;
  }

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.sarcasmLabel = this.getSarcasmLabel();
  }

  private buildForm(): FormGroup<FormValues> {
    return this.formBuilder.group({
      countdown: this.formBuilder.control(60, { nonNullable: true }),
      speech: this.formBuilder.control(true, { nonNullable: true }),
      sarcasm: this.formBuilder.control(0, { nonNullable: true }),
    });
  }

  private getSarcasmLabel(): Observable<string> {
    const ctl = this.form.controls.sarcasm;

    return ctl.valueChanges.pipe(
      startWith(ctl.value),
      map((value: number) => {
        if (value) {
          return Math.round(100 * value) + " %";
        }

        return "Off";
      }),
    );
  }
}
