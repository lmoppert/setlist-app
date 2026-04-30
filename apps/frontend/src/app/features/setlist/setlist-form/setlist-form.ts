import { Component, effect, ElementRef, inject, input, viewChild, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';

import { slugify } from "@setlist-app/shared-utils";
import { ISetlistBase } from '@setlist-app/shared-types';
import { TitleService } from '../../../core/title.service';
import { SetlistStore } from '../../../models/setlist-store';
import { HasUnsavedChanges } from '../../../shared/guards/pending-changes.guard';

@Component({
  selector: 'app-setlist-form',
  providers: [provideNativeDateAdapter()],
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatProgressBarModule, MatDatepickerModule,
    MatButtonModule
  ],
  templateUrl: './setlist-form.html',
  styleUrl: './setlist-form.scss',
})
export class SetlistForm implements HasUnsavedChanges {
  protected fb = inject(FormBuilder);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected titleService = inject(TitleService);
  protected setlistStore = inject(SetlistStore);

  slug = input.required<string>();
  isEditMode = false;
  locationInput = viewChild<ElementRef>('location');

  setlistForm = this.fb.group({
    date: this.fb.control('', { 
      nonNullable: true,
    }),
    location: this.fb.control('', {
      validators: [Validators.required, Validators.minLength(3)],
      nonNullable: true,
    }),
    duration: this.fb.control(60, {
      validators: [Validators.required, Validators.min(0)],
      nonNullable: true,
    }),
    name: this.fb.control('', {
      nonNullable: true,
    }),
    notes: this.fb.control('', {
      nonNullable: true,
    }),
  });

  hasUnsavedChanges(): boolean { 
    return this.setlistForm.dirty && !this.setlistForm.pristine;
  }

  constructor() {
    effect(() => {
      const currentSlug = this.slug();
      if (currentSlug && currentSlug !== 'new') {
        this.setlistStore.loadSetlist(currentSlug);
        this.isEditMode = true;
      }
      else {
        this.setlistStore.loadSetlist(null);
      }
    })

    effect(() => {
      const location = this.setlistStore.currentSetlist()?.location; 
      this.titleService.setTitle(location ? `Gig ${location}` : 'Setliste bearbeiten');
    })

    effect(() => {
      const input = this.locationInput();
      if (input) {
        setTimeout(() => input.nativeElement.focus(), 0);
      }
    });

    effect(() => {
      const setlist = this.setlistStore.currentSetlist();
      if (setlist && this.isEditMode) {
        this.setlistForm.patchValue({
          name: setlist.name,
          date: setlist.date,
          location: setlist.location,
          duration: setlist.duration,
          notes: setlist.notes
        });
        console.log('Current Setlist:', setlist.id)
      }
    });
  }

  submit() {
    if (this.setlistForm.invalid) return;

    const data = this.setlistForm.getRawValue() as ISetlistBase;
    if (this.isEditMode) {
      this.setlistStore.update(data).subscribe(() =>{
        this.setlistForm.markAsPristine();
        //this.router.navigate(['/setlists', this.slug()]);
        if (data.location || data.date) {
          const newDate = data.date ? data.date : this.setlistStore.currentSetlist()?.date;
          const newLocation = data.location ? data.location : this.setlistStore.currentSetlist()?.location
          const newSlug = slugify(`${newDate?.substring(0, 10)}-${newLocation}`);
          console.log('new slug:', newSlug) 
          this.router.navigate(['/setlists', newSlug]);
        }
      });
    } else {
      this.setlistStore.create(data).subscribe((newSetlist) => {
        this.setlistForm.markAsPristine();
        this.router.navigate(['/setlists', newSetlist.slug]);
      });
    }
  }

  cancel() {
    console.log('CANCEL')
    if (this.isEditMode) {
      this.router.navigate(['/setlists', this.slug()]);
    } else {
      this.router.navigate(['/setlists']);
    }
  }
}