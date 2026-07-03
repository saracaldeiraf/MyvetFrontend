import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { PessoaService } from '../../services/pessoa';
import { CpfPipe } from '../../pipes/cpf-pipe';


@Component({
  selector: 'app-funcionario-list',
  standalone: true,
  imports: [RouterLink, CommonModule, CpfPipe],
  templateUrl: './funcionario-list.html',
})
export class FuncionarioList implements OnInit {
  private pService = inject(PessoaService);
  private cdr = inject(ChangeDetectorRef);

  funcionarios: any[] = [];
  mensagemErro = '';

  ngOnInit(): void {
    this.listarFuncionarios();
  }

  listarFuncionarios(): void {
    this.pService.listarTodas().subscribe({
      next: (dados) => {
        this.funcionarios = dados.filter((p: any) => p.tipo === 'MEDICO' || p.tipo === 'ATENDENTE');
        this.mensagemErro = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar a lista de funcionários.';
        this.cdr.detectChanges();
      }
    });
  }

  excluir(id: number): void {
    if (!confirm('Deseja realmente excluir este funcionário?')) {
      return;
    }
    this.pService.excluir(id).subscribe({
      next: () => this.listarFuncionarios(),
      error: () => {
        this.mensagemErro = 'Erro ao excluir o funcionário.';
        this.cdr.detectChanges();
      }
    });
  }
}