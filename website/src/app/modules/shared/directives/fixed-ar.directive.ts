import { Directive, ElementRef, Input } from "@angular/core";

@Directive({
  selector: "[appFixedAr]",
})
export class FixedArDirective {
  @Input()
  public set appFixedAr(value: string | number) {
    if (typeof value === "string") {
      value= parseFloat(value) || 1;
    }

    this.el.nativeElement.style.setProperty("--aspect-ratio", `${value}`);
  }

  constructor(
    private el: ElementRef<HTMLElement>,
  ) {
    this.el.nativeElement.classList.add("fixed-ar");
  }
}
