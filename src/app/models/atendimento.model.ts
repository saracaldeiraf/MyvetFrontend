
export interface Atendimento {
  id?: number;
  dataMarcada: string;
  situacao: 'MARCADO' | 'CONCLUIDO';
  valorServico: number;
  pessoaClienteId: number;
  pessoaFuncionarioId: number;
  servicoId: number;
  animalId: number;

  //   animalNome?: string; 
  //   clienteNome?: string;
  //   funcionarioNome?: string;
  //   servicoNome?: string;
  //   total?: number;

}

export interface AtendimentoProduto {
    id?: number;
    produtoId: number;
    descricaoProduto?: string;
    qtd: number;
    valorProduto?: number;
    subtotal?: number;
}
