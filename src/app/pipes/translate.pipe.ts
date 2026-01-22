import { Pipe, PipeTransform } from '@angular/core';
import { LanguageService } from '../services/language.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false // Impure pipe to detect signal changes from service
})
export class TranslatePipe implements PipeTransform {
  constructor(private langService: LanguageService) {}

  transform(key: string): string {
    return this.langService.translate(key);
  }
}
