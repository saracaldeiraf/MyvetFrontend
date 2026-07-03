import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { Animal } from '../models/animal.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnimalService {

  private listaAnimaisTeste: Animal[] = [
    { id: 1, nome: 'Thor', pessoaId: 10, nomePessoa: '' },
    { id: 2, nome: 'Luna', pessoaId: 15, nomePessoa: '' },
    { id: 3, nome: 'Mel', pessoaId: 22, nomePessoa: '' }
  ];

  private readonly apiUrl = 'http://localhost:8080/animais';

  constructor(private http: HttpClient) { }

  listar(): Observable<Animal[]> {
    return this.http.get<Animal[]>(this.apiUrl);
  }

  buscarPorId(id: string | number): Observable<Animal> {
    return this.http.get<Animal>(this.apiUrl + `/${id}`);
  }

  buscarPorIdAntigo(id: string | number): Observable<Animal> {
    const animal = this.listaAnimaisTeste.find(a => a.id === Number(id));
    return of(animal || { id: 0, nome: '', pessoaId: 0, nomePessoa: '' });
  }

  // buscarPorId(id : string | number): Observable<Animal> {
  //   return true;
  // }

  salvarAntigo(animal: Animal): Observable<Animal> {
    if (animal.id) {
      const index = this.listaAnimaisTeste.findIndex(a => a.id === animal.id);
      if (index !== -1) {
        this.listaAnimaisTeste[index] = animal;
      }
    } else {
      const proximoId = this.listaAnimaisTeste.length > 0
        ? Math.max(...this.listaAnimaisTeste.map(a => a.id || 0)) + 1
        : 1;
      animal.id = proximoId;
      this.listaAnimaisTeste.push(animal);
    }
    return of(animal);
  }

  salvar(dadoAnimal: any, tipo: string): Observable<Animal> {
    switch (tipo) {
      case 'POST':
        return this.http.post<Animal>(this.apiUrl, dadoAnimal);
      case 'PATCH':
        console.log(dadoAnimal)
        return this.http.put<Animal>(this.apiUrl + `/${dadoAnimal.id}`, {nome:dadoAnimal.nome, pessoaId:dadoAnimal.pessoaId});
      default:
        return EMPTY;
    }
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/${id}`);
  }
}