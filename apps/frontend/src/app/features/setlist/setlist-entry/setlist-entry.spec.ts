import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SongListItem } from './setlist-entry';

describe('SongListItem', () => {
  let component: SongListItem;
  let fixture: ComponentFixture<SongListItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SongListItem],
    }).compileComponents();

    fixture = TestBed.createComponent(SongListItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
