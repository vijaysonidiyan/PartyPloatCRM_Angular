import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyPlotMasterComponent } from './party-plot-master.component';

describe('PartyPlotMasterComponent', () => {
  let component: PartyPlotMasterComponent;
  let fixture: ComponentFixture<PartyPlotMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PartyPlotMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PartyPlotMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
