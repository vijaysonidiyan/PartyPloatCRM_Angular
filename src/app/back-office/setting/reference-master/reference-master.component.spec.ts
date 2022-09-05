import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceMasterComponent } from './reference-master.component';

describe('ReferenceMasterComponent', () => {
  let component: ReferenceMasterComponent;
  let fixture: ComponentFixture<ReferenceMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferenceMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
