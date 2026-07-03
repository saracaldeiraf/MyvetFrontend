import { Component, OnInit, inject, ChangeDetectorRef} from '@angular/core'; 
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 

import { Animal } from '../../models/animal.model';
import { AnimalService } from '../../services/animal';

@Component({
  selector: 'app-animal-list',
  standalone: true,
  imports: [RouterLink, CommonModule], 
  templateUrl: './animal-list.html',
})
export class AnimalList implements OnInit {
  private animalService = inject(AnimalService);

  Animais: Animal[] = []; 
  mensagemErro = '';

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.listarAnimais(); 
  }

  listarAnimais(): void {
    this.animalService.listar().subscribe({
      next: (dados) => {
        this.Animais = dados; 
        this.mensagemErro = ''; 
        this.cdr.detectChanges();
      },
      error: () => {
        this.mensagemErro = 'Erro ao carregar a lista de animais.';
      }
    });

  }

  excluir(id: number): void {
    if (!confirm('Deseja realmente excluir este animal?')) {
      return;
    }

    this.animalService.excluir(id).subscribe({
      next: () => {
        this.listarAnimais(); 
      },
      error: () => {
        this.mensagemErro = 'Erro ao excluir animal.';
      }
    });
  }
}