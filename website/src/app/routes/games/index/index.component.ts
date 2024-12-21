import { Component } from "@angular/core";
import { of } from "rxjs";
import { Games } from "../games";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
  styleUrls: ["./index.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class IndexComponent {
  public readonly games$ = of(Games);
}
