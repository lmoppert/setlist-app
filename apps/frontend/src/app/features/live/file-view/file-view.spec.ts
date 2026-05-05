import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileView } from './file-view';

describe('FileView', () => {
  let component: FileView;
  let fixture: ComponentFixture<FileView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
