import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'duration', })
export class DurationPipe implements PipeTransform {
  transform(value: number | undefined | null): string {
    if (!value || isNaN(value)) return '00:00';

    const bigValue: number = Math.floor(value / 60);
    const smallValue: number = Math.floor(value % 60);

    if (bigValue > 0) {
      return `${this.pad(bigValue)}:${this.pad(smallValue)}`;
    }
    return `00:${this.pad(smallValue)}`;
  }

  private pad(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }
}
