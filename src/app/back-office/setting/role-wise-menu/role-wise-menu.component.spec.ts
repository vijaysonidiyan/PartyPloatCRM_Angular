import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleWiseMenuComponent } from './role-wise-menu.component';

describe('RoleWiseMenuComponent', () => {
  let component: RoleWiseMenuComponent;
  let fixture: ComponentFixture<RoleWiseMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoleWiseMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleWiseMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
