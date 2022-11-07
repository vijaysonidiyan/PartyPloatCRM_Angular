import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CricketBookingComponent } from './cricket-booking.component';

describe('CricketBookingComponent', () => {
  let component: CricketBookingComponent;
  let fixture: ComponentFixture<CricketBookingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CricketBookingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CricketBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
