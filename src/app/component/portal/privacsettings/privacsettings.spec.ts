import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Privacsettings } from './privacsettings';

describe('Privacsettings', () => {
  let component: Privacsettings;
  let fixture: ComponentFixture<Privacsettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Privacsettings],
    }).compileComponents();

    fixture = TestBed.createComponent(Privacsettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
