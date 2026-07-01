import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Personaldetails } from './personaldetails';

describe('Personaldetails', () => {
  let component: Personaldetails;
  let fixture: ComponentFixture<Personaldetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Personaldetails],
    }).compileComponents();

    fixture = TestBed.createComponent(Personaldetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
