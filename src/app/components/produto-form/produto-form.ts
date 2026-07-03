import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ProdutoService } from '../../services/produto';

@Component({
  selector: 'app-produto-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './produto-form.html',
  styleUrl: './produto-form.css',
})
export class ProdutoForm implements OnInit {
  formProduto: FormGroup;
  mensagemErro = '';

  constructor(
    private fb: FormBuilder,
    private produtoService: ProdutoService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.formProduto = this.fb.group({
      id: [null],
      nome: ['', [Validators.required, Validators.minLength(3)]],
      valor: ['', [Validators.required, Validators.min(0)]],
      descricao: [''],
      qtd_estoque: ['', [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.produtoService.buscarPorId(id).subscribe({
        next: (produto) => this.formProduto.patchValue(produto),
        error: () => this.mensagemErro = 'Erro ao carregar dados do produto.'
      });
    }
  }

  salvar(): void {
    if (this.formProduto.invalid) return;

    this.produtoService.salvar(this.formProduto.value).subscribe({
      next: () => {
        this.router.navigate(['/produtos']);
      },
      error: () => {
        this.mensagemErro = 'Erro ao salvar o produto.';
      }
    });
  }

  validarCampo(campo: string, erro: string): boolean {
    const controle = this.formProduto.get(campo);
    return !!(controle && controle.touched && controle.hasError(erro));
  }
}