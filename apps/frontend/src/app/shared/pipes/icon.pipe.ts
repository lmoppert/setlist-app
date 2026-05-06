import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ftIcon', })
export class FiletypePipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return 'question_mark';
    const n = value?.toLowerCase();
    if(n.includes('pdf')) return 'picture_as_pdf';
    if(n.includes('txt')) return 'lyrics';
    if(n.includes('md')) return 'description';
    return 'audio_file';
  }
}

@Pipe({ name: 'catIcon', })
export class CategoryPipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return 'insert_drive_file';
    const n = value?.toLowerCase();
    if(n.includes('sheet') || n.includes('bass')) return 'library_music';
    if(n.includes('lyrics')) return 'library_books';
    if(n.includes('recording')) return 'video_library';
    return 'photo_library';
  }
}