import { Injectable } from '@angular/core';
import { EMPTY, Observable, of } from 'rxjs';
import { Servico } from '../models/servico.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicoService {

  private listaProdutosTeste: Servico[] = [
    { id: 1, valor: 50.00, descricao: 'Banho e tosa' },
    { id: 2, valor: 80.00, descricao: 'Consulta Geral' },
    { id: 3, valor: 120.00, descricao: 'Ultrassonografia' }
  ];

  private readonly apiUrl = 'https://myvet-ds.onrender.com/servicos';
  

  constructor(private http: HttpClient) { }

  listarAntigo(): Observable<Servico[]> {
    return of(this.listaProdutosTeste);
  }

  listar(): Observable<Servico[]> {
    return this.http.get<Servico[]>(this.apiUrl);
  }

  buscarPorIdAntigo(id: string | number): Observable<Servico> {
    const produto = this.listaProdutosTeste.find(p => p.id === Number(id));
    return of(produto || { id: 0, nome: '', valor: 0, descricao: '' });
  }

  buscarPorId(id: string | number): Observable<Servico> {
    return this.http.get<Servico>(this.apiUrl + `/${id}`);
  }

  salvar(servico: Servico): Observable<Servico> {
    if (servico.id) {
      return this.http.put<Servico>(this.apiUrl + `/${servico.id}`, servico);
    } else {
      const dadosSemId = {
        descricao: servico.descricao,
        valor: servico.valor
      }
      return this.http.post<Servico>(this.apiUrl, dadosSemId);
    }
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/${id}`);
  }
}