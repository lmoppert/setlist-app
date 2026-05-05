import { Component, effect, inject, input, output } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatSelectModule } from '@angular/material/select';

import { SongStore } from '../../../models/song-store';
import { IBandMember, ISong } from '@setlist-app/shared-types';

@Component({
  selector: 'app-song-form',
  imports: [
    RouterLink, ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatButtonModule, MatDividerModule, MatSelectModule
  ],
  templateUrl: './song-form.html',
  styleUrl: './song-form.scss',
})
export class SongForm {
  protected fb = inject(FormBuilder);
  protected router = inject(Router);
  protected store = inject(SongStore);

  formDirty = output<boolean>();
  slug = input.required<string>();
  isEditMode = false;

  songForm = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    artist: [''],
    duration: [300, [Validators.required, Validators.min(0)]],
    tempo: [120, [Validators.min(0)]],
    key: ['D'],
    leadVocals: ['Volker, Bernd'],
    isActive: [true],
    instruments: this.fb.array([]), 
  });
  get instruments() {
    return this.songForm.get('instruments') as FormArray;
  }
  initInstruments(members: IBandMember[], song?: ISong) {
    members.forEach(member => {
      const existing = song?.instruments?.find(i => i.memberId === member.id);
      
      this.instruments.push(this.fb.group({
        memberId: [member.id],
        memberName: [member.name],
        instrumentName: [existing?.name || ''],
        tuning: [existing?.tuning || 'Standard']
      }));
    });
  }

  constructor() {
    this.songForm.statusChanges.subscribe(() => {
      this.formDirty.emit(this.songForm.dirty);
    });
    effect(() => {
      const currentSlug = this.slug();
      const allMembers = this.store.members();
      const song = this.store.currentSong();
      const isLoading = this.store.songIsLoading();

      if (!allMembers || allMembers.length === 0) return;
      this.isEditMode = currentSlug !== 'new';

      if(this.isEditMode) {
        if (!song || song.slug !== currentSlug) {
          this.store.loadSong(currentSlug);
          return;
        }
        if (!isLoading) {
          this.songForm.patchValue({
            title: song.title,
            artist: song.artist,
            duration: song.duration,
            tempo: song.tempo,
            key: song.key,
            leadVocals: song.leadVocals,
            isActive: song.isActive,
          }, { emitEvent: false });
          this.initInstruments(allMembers, song);
          this.songForm.markAsPristine();
          this.songForm.markAsUntouched();
        }
      } else {
        if (this.instruments.length !== allMembers.length) {
          this.songForm.reset({
            duration: 300,
            tempo: 120,
            key: 'D',
            isActive: true,
            leadVocals: 'Volker, Bernd'
          }, { emitEvent: false });
          this.initInstruments(allMembers);
          this.songForm.markAsPristine();
        }
      }
    });
  }
  submit() {
    if (this.songForm.invalid) return;
    const data = this.songForm.getRawValue() as ISong;

    if (this.isEditMode) {
      this.store.update(data).subscribe(() => {
        this.songForm.markAsPristine();
      })
    } else {
      this.store.create(data).subscribe(() => {
        this.songForm.markAsPristine();
      })
    }
    this.router.navigate(['/songs']);
  }

  cancel() {
    console.log('CANCEL')
    this.router.navigate(['/songs']);
  }
}
