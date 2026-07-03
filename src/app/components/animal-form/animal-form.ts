import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

import { AnimalService } from '../../services/animal';
import { Animal } from '../../models/animal.model';
import { Observable } from 'rxjs';
import { Pessoa } from '../../models/pessoa.model';

@Component({
  selector: 'app-animal-form',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './animal-form.html'
})
export class AnimalForm implements OnInit {
  private fb = inject(FormBuilder);
  private animalService = inject(AnimalService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  formAnimal!: FormGroup;
  mensagemErro = '';

  // donosMock = [
  //   { id: 10, nome: 'Carlos Augusto (Cliente)' },
  //   { id: 15, nome: 'Mariana Costa (Cliente)' },
  //   { id: 22, nome: 'Roberto Souza (Cliente)' }
  // ];

  donosMock: Pessoa[] = [];

  private readonly apiUrl = 'http://localhost:8080/pessoas';

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {

    this.listarDonos();

    this.formAnimal = this.fb.group({
      id: [null],
      nome: ['', [Validators.required]],
      idPessoaDono: [null, [Validators.required]]
    });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.animalService.buscarPorId(id).subscribe({
        next: (animal) => this.formAnimal.patchValue(animal),
        error: () => this.mensagemErro = 'Erro ao carregar dados do animal.'
      });
    }
  }

  listarDonos() {
    this.http.get<Pessoa[]>(this.apiUrl).subscribe({
      next: (dados) => {
        this.donosMock = dados;
        this.mensagemErro = '';

        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar a lista de animais.';
      }
    });
  }

  validarCampo(campo: string, validacao: string): boolean {
    const control = this.formAnimal.get(campo);
    return !!(control && control.hasError(validacao) && (control.dirty || control.touched));
  }

  salvar(): void {
    if (this.formAnimal.invalid) return;
    const dadosForm = this.formAnimal.value;

    var dadosAnimal = null;
    var tipoRequisicao = null;

    if (dadosForm.id) {
      dadosAnimal = {
        id: dadosForm.id,
        nome: dadosForm.nome,
        pessoaId: dadosForm.idPessoaDono
      };
      tipoRequisicao = 'PATCH';
    } else {
      dadosAnimal = {
        nome: dadosForm.nome,
        pessoaId: dadosForm.idPessoaDono
      };
      tipoRequisicao = 'POST';
    }

    this.animalService.salvar(dadosAnimal,tipoRequisicao).subscribe({
      next: () => this.router.navigate(['/animais']),
      error: () => this.mensagemErro = 'Erro ao salvar o animal.'
    });
  }
}