import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PessoaService } from '../../services/pessoa';
import { Pessoa } from '../../models/pessoa.model';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './cliente-form.html',
})
export class ClienteForm implements OnInit {
  private fb = inject(FormBuilder);
  private pessoaService = inject(PessoaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formCliente!: FormGroup;
  mensagemErro = '';

  ngOnInit(): void {
    this.inicializarFormulario();
    this.verificarEdicao();
  }

  inicializarFormulario(): void {
    this.formCliente = this.fb.group({
      id: [null],
      nome: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      tipo: ['CLIENTE']
    });
  }

  verificarEdicao(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pessoaService.buscarPorId(+id).subscribe({
        next: (cliente) => {
          this.formCliente.patchValue(cliente);
        },
        error: () => {
          this.mensagemErro = 'Erro ao carregar os dados do cliente.';
        }
      });
    }
  }

  validarCampo(campo: string, erro: string): boolean {
    const control = this.formCliente.get(campo);
    return !!(control && control.hasError(erro) && (control.touched || control.dirty));
  }

  salvar(): void {
    if (this.formCliente.invalid) {
      return;
    }

    const dadosCliente: Pessoa = this.formCliente.value;
    const id = this.formCliente.get('id')?.value;

    const operacao = id
      ? this.pessoaService.alterar(id, dadosCliente)
      : this.pessoaService.salvar(dadosCliente);

    operacao.subscribe({
      next: () => {
        this.router.navigate(['/clientes']);
      },
      error: (err) => {
        if (err?.status === 400) {
          this.formCliente.get('cpf')?.setErrors({ cpfDuplicado: true });
        } else {
          this.mensagemErro = 'Erro ao salvar as informações do cliente.';
        }
      }
    });
  }
}