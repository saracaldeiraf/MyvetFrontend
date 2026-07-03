import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpf',
  standalone: true 
})
export class CpfPipe implements PipeTransform {

  transform(cpf: string | number): string {
    if (!cpf) {
      return '';
    }

    const cpfLimpo = cpf.toString().replace(/\D/g, '');

    if (cpfLimpo.length !== 11) {
      return cpf.toString();
    }

    return cpfLimpo.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
}