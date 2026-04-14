import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GigEdit } from './gig-edit';

describe('GigEdit', () => {
  let component: GigEdit;
  let fixture: ComponentFixture<GigEdit>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GigEdit],
    }).compileComponents();

    fixture = TestBed.createComponent(GigEdit);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
