import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GigList } from './gig-list';

describe('GigList', () => {
  let component: GigList;
  let fixture: ComponentFixture<GigList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GigList],
    }).compileComponents();

    fixture = TestBed.createComponent(GigList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
