import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Produto } from '../models/produto.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private listaProdutosTeste: Produto[] = [
    { id: 1, nome: 'Dipirona 500 mg', valor: 25.00, descricao: 'Medicamento analgésico', qtd_estoque: 31 },
    { id: 2, nome: 'Soro Fisiológico', valor: 100.00, descricao: 'Uso clínico geral', qtd_estoque: 60 },
    { id: 3, nome: 'Ração Premium Cães', valor: 120.00, descricao: 'Sabor carne 15kg', qtd_estoque: 16 }
  ];

  private readonly apiUrl = 'http://localhost:8080/produtos';

  constructor(private http: HttpClient) { }

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(this.apiUrl);
  }

  buscarPorId(id: string | number): Observable<Produto> {
    return this.http.get<Produto>(this.apiUrl + `/${id}`);
  }

  salvar(produto: Produto): Observable<Produto> {
    console.log(produto);
    if (produto.id) {
      return this.http.put<Produto>(this.apiUrl + `/${produto.id}`, produto);
    } else {
      const dadosSemId = {
        nome: produto.nome,
        descricao: produto.descricao,
        valor: produto.valor,
        qtd_estoque: produto.qtd_estoque
      }
      return this.http.post<Produto>(this.apiUrl, dadosSemId);
    }
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(this.apiUrl + `/${id}`);
  }
}