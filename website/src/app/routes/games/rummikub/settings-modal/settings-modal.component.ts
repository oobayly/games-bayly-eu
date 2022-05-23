import { Component } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { RummikubSettings } from "../rummikub.component";

@Component({
  selector: "app-settings-modal",
  templateUrl: "./settings-modal.component.html",
  styleUrls: ["./settings-modal.component.scss"],
})
export class SettingsModalComponent {
  public readonly form = this.buildForm();

  public get isValid(): boolean { return this.form.valid };

  public set settings(value: RummikubSettings) {
    this.form.patchValue(value);
  }

  public get settings(): RummikubSettings {
    if (!this.isValid) {
      throw new Error("Settings cannot be retrieved.");
    }

    return this.form.value as RummikubSettings;
  }

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
  ) { }

  private buildForm(): FormGroup {
    return this.formBuilder.group({
      countdown: [60, []],
      speech: [true, []],
      sarcasm: [false, []],
    });
  }
}
