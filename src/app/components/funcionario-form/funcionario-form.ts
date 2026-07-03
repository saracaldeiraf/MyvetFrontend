import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { PessoaService } from '../../services/pessoa';
import { Pessoa } from '../../models/pessoa.model';

@Component({
  selector: 'app-funcionario-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './funcionario-form.html',
})
export class FuncionarioForm implements OnInit {
  private fb = inject(FormBuilder);
  private pessoaService = inject(PessoaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formFuncionario!: FormGroup;
  mensagemErro = '';

  ngOnInit(): void {
    this.inicializarFormulario();
    this.verificarEdicao();
  }

  inicializarFormulario(): void {
    this.formFuncionario = this.fb.group({
      id: [null],
      nome: ['', [Validators.required]],
      cpf: ['', [Validators.required, Validators.minLength(11), Validators.maxLength(11)]],
      email: ['', [Validators.required, Validators.email]],
      tipo: ['MEDICO', [Validators.required]]
    });
  }

  verificarEdicao(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.pessoaService.buscarPorId(+id).subscribe({
        next: (funcionario) => {
          this.formFuncionario.patchValue(funcionario);
        },
        error: () => {
          this.mensagemErro = 'Erro ao carregar os dados do funcionário.';
        }
      });
    }
  }

  validarCampo(campo: string, erro: string): boolean {
    const control = this.formFuncionario.get(campo);
    return !!(control && control.hasError(erro) && (control.touched || control.dirty));
  }

  salvar(): void {
    if (this.formFuncionario.invalid) {
      return;
    }

    const dadosFuncionario: Pessoa = this.formFuncionario.value;
    const id = this.formFuncionario.get('id')?.value;

    const operacao = id
      ? this.pessoaService.alterar(id, dadosFuncionario)
      : this.pessoaService.salvar(dadosFuncionario);

    operacao.subscribe({
      next: () => {
        this.router.navigate(['/funcionarios']);
      },
      error: (err) => {
        this.mensagemErro = 'Erro ao salvar as informações do funcionário.';
      }
    }
    );
  }

}