import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveView } from './live-view';

describe('LiveView', () => {
  let component: LiveView;
  let fixture: ComponentFixture<LiveView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LiveView],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
