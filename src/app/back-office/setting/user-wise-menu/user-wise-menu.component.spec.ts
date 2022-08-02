import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserWiseMenuComponent } from './user-wise-menu.component';

describe('UserWiseMenuComponent', () => {
  let component: UserWiseMenuComponent;
  let fixture: ComponentFixture<UserWiseMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserWiseMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserWiseMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
