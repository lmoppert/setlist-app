import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'instrument', })
export class InstrumentPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';
    const n = value?.toLowerCase();
    if(n.includes('akustik')) return 'AG';
    if(n.includes('e-gitarre')) return 'EG';
    if(n.includes('bass')) return 'BA';
    if(n.includes('akkordeon')) return 'AK';
    if(n.includes('banjo')) return 'BJ';
    if(n.includes('mundharmonika')) return 'MH';
    if(n.includes('schlagzeug')) return 'DR';

    return value.substring(0, 2).toUpperCase();
  }
}
