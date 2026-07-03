import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

import { ServicoService } from '../../services/servico';
import { Servico } from '../../models/servico.model';

@Component({
  selector: 'app-servico-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './servico-form.html'
})
export class ServicoForm implements OnInit {
  private fb = inject(FormBuilder);
  private servicoService = inject(ServicoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formServico!: FormGroup;
  mensagemErro = '';

  ngOnInit(): void {
    this.formServico = this.fb.group({
      id: [null],
      descricao: ['', [Validators.required]], 
      valor: [null, [Validators.required, Validators.min(0.01)]] 
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.servicoService.buscarPorId(id).subscribe({
        next: (servico) => {
          this.formServico.patchValue(servico);
        },
        error: () => {
          this.mensagemErro = 'Erro ao carregar dados do serviço.';
        }
      });
    }
  }

  validarCampo(campo: string, validacao: string): boolean {
    const control = this.formServico.get(campo);
    return !!(control && control.hasError(validacao) && (control.dirty || control.touched));
  }

  salvar(): void {
    if (this.formServico.invalid) return;

    const dadosServico: Servico = this.formServico.value;

    this.servicoService.salvar(dadosServico).subscribe({
      next: () => {
        this.router.navigate(['/servicos']); 
      },
      error: () => {
        this.mensagemErro = 'Erro ao salvar o serviço.';
      }
    });
  }
}