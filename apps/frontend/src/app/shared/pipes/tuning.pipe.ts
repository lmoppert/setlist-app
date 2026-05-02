import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tuning', })
export class TuningPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';
    const n = value?.toLowerCase();
    if(n.includes('drop-d')) return 'DD';
    if(n.includes('standard')) return 'St';

    return value.substring(0, 2).toUpperCase();
  }
}

