import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { EMPTY, forkJoin, map, Observable, switchMap } from 'rxjs';
import { Atendimento, AtendimentoProduto } from '../models/atendimento.model';
import { Pessoa } from '../models/pessoa.model';
import { Servico } from '../models/servico.model';
import { Animal } from '../models/animal.model';

@Injectable({
  providedIn: 'root'
})
export class AtendimentoService {
  private http = inject(HttpClient);
  private apiUrl = 'https://myvet-ds.onrender.com/atendimentos';

  listar(): Observable<Atendimento[]> {
    return this.http.get<Atendimento[]>(this.apiUrl);
  }

  buscarPorId(id: number | string): Observable<Atendimento> {
    return this.http.get<Atendimento>(`${this.apiUrl}/${id}`);
  }

  salvar(atendimento: Atendimento, atendimentoProduto: AtendimentoProduto[]): Observable<Atendimento> {
    console.log(atendimentoProduto);

    // 1. Faz o POST do atendimento
    return this.http.post<Atendimento>(this.apiUrl, atendimento).pipe(
      switchMap((atendimentoGerado) => {

        console.log('Dados do Atendimento Gerado:', atendimentoGerado);
        console.log('Primeiro Produto da lista:', atendimentoProduto[0]);

        // Se não houver produtos, pula o forkJoin e passa o atendimento direto na linha
        if (!atendimentoProduto || atendimentoProduto.length === 0) {
          return [atendimentoGerado];
        }

        // 2. Mapeia os produtos para requisições HTTP
        const requisicoesProdutos = atendimentoProduto.map((dados) => {
          var dados2 : any = {
            quantidade: dados.qtd,
            valor_produto: dados.valorProduto,
            id_atendimento: atendimentoGerado.id,
            id_produto: dados.produtoId
          };

          console.log(dados2);
          return this.http.post<AtendimentoProduto>(`${this.apiUrl}/produtos`, dados2 );
        });

        // 3. Executa todos os produtos em paralelo e, ao terminar, 
        // usa o 'map' para garantir que o método retorne o ATENDIMENTO original
        return forkJoin(requisicoesProdutos).pipe(
          map(() => atendimentoGerado)
        );
      })
    );
  }

  alterar(id: number, atendimento: Atendimento): Observable<Atendimento> {
    return this.http.put<Atendimento>(`${this.apiUrl}/${id}`, atendimento);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}