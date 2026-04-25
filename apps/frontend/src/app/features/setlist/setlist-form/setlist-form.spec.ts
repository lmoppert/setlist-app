import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SetlistForm } from './setlist-form';

describe('SetlistForm', () => {
  let component: SetlistForm;
  let fixture: ComponentFixture<SetlistForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetlistForm],
    }).compileComponents();

    fixture = TestBed.createComponent(SetlistForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
