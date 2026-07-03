import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; 
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 

import { Servico } from '../../models/servico.model';
import { ServicoService } from '../../services/servico'; 

@Component({
  selector: 'app-servico-list',
  standalone: true,
  imports: [RouterLink, CommonModule], 
  templateUrl: './servico-list.html',
})
export class ServicoList implements OnInit {
  private servicoService = inject(ServicoService);

  Servicos: Servico[] = []; 
  mensagemErro = '';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listarservicos();
  }

  listarservicos(): void {
    this.servicoService.listar().subscribe({
      next: (dados) => {
        dados.sort((s1,s2) => s1.descricao.localeCompare(s2.descricao));
        console.log(dados);
        this.Servicos = dados; 
        this.mensagemErro = ''; 

        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar a lista de serviços.';
      }
    });
  }

  excluir(id: number): void {
    if (!confirm('Deseja realmente excluir este serviço?')) {
      return;
    }

    this.servicoService.excluir(id).subscribe({
      next: () => {
        this.listarservicos(); 
      },
      error: () => {
        this.mensagemErro = 'Erro ao excluir serviço.';
      }
    });
  }
}