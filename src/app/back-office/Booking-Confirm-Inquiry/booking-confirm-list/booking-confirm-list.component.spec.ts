import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingConfirmListComponent } from './booking-confirm-list.component';

describe('BookingConfirmListComponent', () => {
  let component: BookingConfirmListComponent;
  let fixture: ComponentFixture<BookingConfirmListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingConfirmListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingConfirmListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
