import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { AtendimentoService } from '../../services/atendimento';

@Component({
  selector: 'app-atendimento-list',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './atendimento-list.html',
})
export class AtendimentoList implements OnInit {
  private atendimentoService = inject(AtendimentoService);
  private cdr = inject(ChangeDetectorRef);

  atendimentos: any[] = [];
  mensagemErro = '';

  ngOnInit(): void {
    this.listarAtendimentos();
  }

  listarAtendimentos(): void {
    this.atendimentoService.listar().subscribe({
      next: (dados) => {
        this.atendimentos = dados;
        this.mensagemErro = '';
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar a lista de atendimentos.';
        this.cdr.detectChanges();
      }
    });
  }

  excluir(id: number): void {
    if (!confirm('Deseja realmente excluir este atendimento?')) {
      return;
    }
    this.atendimentoService.excluir(id).subscribe({
      next: () => this.listarAtendimentos(),
      error: () => {
        this.mensagemErro = 'Erro ao excluir o atendimento.';
        this.cdr.detectChanges();
      }
    });
  }
}