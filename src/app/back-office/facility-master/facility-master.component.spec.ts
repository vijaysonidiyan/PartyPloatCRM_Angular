import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacilityMasterComponent } from './facility-master.component';

describe('FacilityMasterComponent', () => {
  let component: FacilityMasterComponent;
  let fixture: ComponentFixture<FacilityMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacilityMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacilityMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
