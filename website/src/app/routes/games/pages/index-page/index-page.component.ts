import { Component } from "@angular/core";
import { of } from "rxjs";
import { Games } from "../../games";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-index-page",
  templateUrl: "./index-page.component.html",
  styleUrls: ["./index-page.component.scss"],
  standalone: true,
  imports: [CommonModule, RouterModule],
})
export class IndexPageComponent {
  public readonly games$ = of(Games);
}
