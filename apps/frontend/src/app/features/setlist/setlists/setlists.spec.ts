import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Setlists } from './setlists';

describe('Setlists', () => {
  let component: Setlists;
  let fixture: ComponentFixture<Setlists>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Setlists],
    }).compileComponents();

    fixture = TestBed.createComponent(Setlists);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
