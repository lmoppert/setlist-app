import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'formatMonospace', })
export class FormatMonospacePipe implements PipeTransform {
  /**
   * @param value Der Zahlenwert
   * @param width Gewünschte Breite (Standard: 3)
   * @param char Das Füllzeichen (Standard: Leerzeichen ' ')
   */
  transform(value: number | string| undefined | null, width: number = 3, char: string = ' '): string {
    if (value == null) {
      return char.repeat(width);
    }

    if (typeof value === 'string') {
      return value.padEnd(width, char);
    }
    return value.toString().padStart(width, char);
  }
}