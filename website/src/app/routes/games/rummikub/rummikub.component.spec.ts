import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RummikubComponent } from "./rummikub.component";

describe("RummikubComponent", () => {
  let component: RummikubComponent;
  let fixture: ComponentFixture<RummikubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RummikubComponent ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RummikubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
