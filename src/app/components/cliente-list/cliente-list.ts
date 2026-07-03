import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core'; 
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 

import { PessoaService } from '../../services/pessoa';
import { CpfPipe } from '../../pipes/cpf-pipe';

@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [RouterLink, CommonModule, CpfPipe], 
  templateUrl: './cliente-list.html',
})
export class ClienteList implements OnInit {
  private pService = inject(PessoaService);
  private cdr = inject(ChangeDetectorRef);

  clientes: any[] = []; 
  mensagemErro = '';

  clienteSelecionado: any = null;
  animaisDoCliente: any[] = [];

  ngOnInit(): void {
    this.listarClientes(); 
  }

  listarClientes(): void {
    this.pService.listarTodas().subscribe({
      next: (dados) => {
        this.clientes = dados.filter((p: any) => p.tipo === 'CLIENTE'); 
        this.mensagemErro = ''; 
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar a lista de clientes.';
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalAnimais(cliente: any): void {
    this.clienteSelecionado = cliente;
    this.animaisDoCliente = []; 

    this.pService.buscarAnimaisDoDono(cliente.id!).subscribe({
      next: (dadosAnimais) => {
        this.animaisDoCliente = dadosAnimais;
        this.mensagemErro = '';

        const modal = document.getElementById('modalAnimais');
        if (modal) {
          modal.classList.add('show');
          modal.style.display = 'block';
          document.body.classList.add('modal-open');
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar os animais deste cliente.';
        this.cdr.detectChanges();
      }
    });
  }

  fecharModal(): void {
    const modal = document.getElementById('modalAnimais');
    if (modal) {
      modal.classList.remove('show');
      modal.style.display = 'none';
      document.body.classList.remove('modal-open');
    }
    this.clienteSelecionado = null;
    this.animaisDoCliente = [];
    this.cdr.detectChanges();
  }

  excluir(id: number): void {
    if (!confirm('Deseja realmente excluir este cliente?')) {
      return;
    }
    this.pService.excluir(id).subscribe({
      next: () => this.listarClientes(),
      error: () => {
        this.mensagemErro = 'Erro ao excluir o cliente.';
        this.cdr.detectChanges();
      }
    });
  }
}