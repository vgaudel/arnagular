import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abreviation',
})
export class AbreviationPipe implements PipeTransform {
  transform(value: string, nb: number = 5): string {
    if(!value) return '';
    else return value.slice(0,nb)+'...';
  }
}
