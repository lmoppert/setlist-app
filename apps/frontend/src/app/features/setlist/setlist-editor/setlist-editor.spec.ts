import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetlistEditor } from './setlist-editor';

describe('SetlistEditor', () => {
  let component: SetlistEditor;
  let fixture: ComponentFixture<SetlistEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SetlistEditor],
    }).compileComponents();

    fixture = TestBed.createComponent(SetlistEditor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
