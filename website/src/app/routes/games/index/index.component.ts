import { Component } from "@angular/core";
import { of } from "rxjs";
import { Games } from "../games";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
})
export class IndexComponent {
  public readonly games$ = of(Games);
}
