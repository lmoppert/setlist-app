import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'initials', })
export class InitialsPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';

    return value
      .split(',')
      .map(name => name.trim())
      .filter(name => name.length > 0)
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase();
  }
}
