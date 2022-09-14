import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPackageMasterComponent } from './add-package-master.component';

describe('AddPackageMasterComponent', () => {
  let component: AddPackageMasterComponent;
  let fixture: ComponentFixture<AddPackageMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddPackageMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPackageMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
