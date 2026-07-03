import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 

import { Produto } from '../../models/produto.model';
import { ProdutoService } from '../../services/produto';

@Component({
  selector: 'app-produto-list',
  standalone: true,
  imports: [RouterLink, CommonModule], 
  templateUrl: './produto-list.html',
  styleUrl: './produto-list.css',
})
export class ProdutoList implements OnInit {
  Produtos: Produto[] = [];
  mensagemErro = '';

  constructor(private produtoService: ProdutoService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listarProdutos();
  }

  listarProdutos(): void {
    this.produtoService.listar().subscribe({
      next: (dados) => {
        console.log(dados);
        this.Produtos = dados;
        this.mensagemErro = ''; 

        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar a lista de Produtos.';
      }
    });
  }

  obterTotalItensEstoque(): number {
    return this.Produtos.reduce(
      (somaAcumulada, produtoItem) => somaAcumulada + (produtoItem.qtd_estoque || 0), 
      0
    );
  }

  excluir(id: number): void {
    if (!confirm('Deseja realmente excluir este Produto?')) {
      return;
    }


    this.produtoService.excluir(id).subscribe({
      next: () => {
        this.listarProdutos(); 
      },  
      error: () => {
        this.mensagemErro = 'Erro ao excluir Produto.';
      }
    });
  }
}