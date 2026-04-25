import { AfterViewInit, Component, effect, ElementRef, inject, input, viewChild, ViewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';

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
  protected store = inject(SetlistStore);

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
        this.store.loadSetlist(currentSlug);
        this.isEditMode = true;
      }
      else {
        this.store.loadSetlist(null);
      }
    })

    effect(() => {
      const location = this.store.currentSetlist()?.location; 
      this.titleService.setTitle(location ? `Gig ${location}` : 'Setliste bearbeiten');
    })

    effect(() => {
      const input = this.locationInput();
      if (input) {
        setTimeout(() => input.nativeElement.focus(), 0);
      }
    });

    effect(() => {
      const setlist = this.store.currentSetlist();
      if (setlist && this.isEditMode) {
        this.setlistForm.patchValue({
          name: setlist.name,
          date: setlist.date,
          location: setlist.location,
          duration: setlist.duration,
          notes: setlist.notes
        });
      }
    });
  }

  submit() {
    if (this.setlistForm.invalid) return;

    const data = this.setlistForm.getRawValue() as ISetlistBase;
    if (this.isEditMode) {
      this.store.update(data).subscribe(() =>{
        this.setlistForm.markAsPristine();
        this.router.navigate(['/setlists', this.slug()]);
      });
    } else {
      console.log('CREATE', data)
      this.store.create(data).subscribe((newSetlist) => {
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