import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { map, Observable, startWith } from "rxjs";
import { BaseModal } from "src/app/core/services/modal.service";
import { RummikubSettings } from "../rummikub.component";

@Component({
  selector: "app-settings-modal",
  templateUrl: "./settings-modal.component.html",
  styleUrls: ["./settings-modal.component.scss"],
})
export class SettingsModalComponent implements BaseModal<RummikubSettings>, OnInit {
  public readonly form = this.buildForm();

  public sarcasmLabel?: Observable<string>;

  public set value(value: RummikubSettings) {
    this.form.patchValue(value, { emitEvent: true, onlySelf: false });
  }

  public get value(): RummikubSettings {
    if (this.form.invalid) {
      throw new Error("Settings cannot be retrieved.");
    }

    return this.form.value as RummikubSettings;
  }

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.sarcasmLabel = this.getSarcasmLabel();
  }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      countdown: [60, []],
      speech: [true, []],
      sarcasm: [0, []],
    });
  }

  private getSarcasmLabel(): Observable<string> {
    const ctl = this.form.get("sarcasm")!;

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
