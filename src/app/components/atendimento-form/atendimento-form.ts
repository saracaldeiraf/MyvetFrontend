import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { AtendimentoService } from '../../services/atendimento';
import { AnimalService } from '../../services/animal';
import { ServicoService } from '../../services/servico';
import { PessoaService } from '../../services/pessoa';
import { ProdutoService } from '../../services/produto';

import { Atendimento, AtendimentoProduto } from '../../models/atendimento.model';
import { Animal } from '../../models/animal.model';
import { Servico } from '../../models/servico.model';
import { Pessoa } from '../../models/pessoa.model';
import { Produto } from '../../models/produto.model';

@Component({
  selector: 'app-atendimento-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './atendimento-form.html',
})
export class AtendimentoForm implements OnInit {
  private fb = inject(FormBuilder);
  private atendimentoService = inject(AtendimentoService);
  private animalService = inject(AnimalService);
  private servicoService = inject(ServicoService);
  private pessoaService = inject(PessoaService);
  private produtoService = inject(ProdutoService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  formAtendimento!: FormGroup;
  mensagemErro = '';

  animais: Animal[] = [];
  servicos: Servico[] = [];
  funcionarios: Pessoa[] = [];
  produtos: Produto[] = [];

  produtoSelecionadoId: number | null = null;
  qtdSelecionada: number = 1;

  produtosAdicionados: AtendimentoProduto[] = [];

  ngOnInit(): void {
    this.inicializarFormulario();
    this.carregarListas();
    this.verificarEdicao();
  }

  inicializarFormulario(): void {
    this.formAtendimento = this.fb.group({
      id: [null],
      data: ['', [Validators.required]],
      situacao: ['MARCADO', [Validators.required]],
      valorServico: [0, [Validators.required, Validators.min(0)]],
      servico_id: [null, [Validators.required]],
      animal_id: [null, [Validators.required]],
      pessoa_funcionario_id: [null, [Validators.required]]
    });
  }

  carregarListas(): void {
    this.animalService.listar().subscribe({
      next: (dados) => { this.animais = dados; this.cdr.detectChanges(); },
      error: () => this.mensagemErro = 'Erro ao carregar a lista de animais.'
    });

    this.servicoService.listar().subscribe({
      next: (dados) => { this.servicos = dados; this.cdr.detectChanges(); },
      error: () => this.mensagemErro = 'Erro ao carregar a lista de serviços.'
    });

    this.pessoaService.listarTodas().subscribe({
      next: (dados) => {
        this.funcionarios = dados.filter((p: any) => p.tipo === 'MEDICO' || p.tipo === 'ATENDENTE');
        this.cdr.detectChanges();
      },
      error: () => this.mensagemErro = 'Erro ao carregar a lista de funcionários.'
    });

    this.produtoService.listar().subscribe({
      next: (dados) => { this.produtos = dados; this.cdr.detectChanges(); },
      error: () => this.mensagemErro = 'Erro ao carregar a lista de produtos.'
    });
  }

  verificarEdicao(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.atendimentoService.buscarPorId(+id).subscribe({
      next: (atendimento: any) => {
        this.formAtendimento.patchValue({
          id: atendimento.id,
          data: atendimento.data,
          situacao: atendimento.situacao,
          valorServico: atendimento.valorServico,
          servico_id: atendimento.servicoId,
          animal_id: atendimento.animalId,
          pessoa_funcionario_id: atendimento.pessoaFuncionarioId
        });

        this.produtosAdicionados = (atendimento.produtos || []).map((p: any) => ({
          produtoId: p.produtoId,
          descricaoProduto: p.descricaoProduto,
          qtd: p.qtd,
          valorProduto: p.valorProduto,
          subtotal: p.subtotal
        }));

        this.cdr.detectChanges();
      },
      error: () => this.mensagemErro = 'Erro ao carregar os dados do atendimento.'
    });
  }

  onServicoSelecionado(): void {
    const servicoId = this.formAtendimento.get('servico_id')?.value;
    const servico = this.servicos.find(s => s.id === Number(servicoId));
    if (servico) {
      this.formAtendimento.get('valorServico')?.setValue(servico.valor);
    }
  }

  adicionarProduto(): void {
    if (!this.produtoSelecionadoId || !this.qtdSelecionada || this.qtdSelecionada < 1) {
      return;
    }

    const produto = this.produtos.find(p => p.id === Number(this.produtoSelecionadoId));
    if (!produto) {
      return;
    }

    const existente = this.produtosAdicionados.find(p => p.produtoId === produto.id);
    if (existente) {
      existente.qtd += this.qtdSelecionada;
      existente.subtotal = existente.qtd * (existente.valorProduto || 0);
    } else {
      this.produtosAdicionados.push({
        produtoId: produto.id!,
        descricaoProduto: produto.descricao,
        qtd: this.qtdSelecionada,
        valorProduto: produto.valor,
        subtotal: produto.valor * this.qtdSelecionada
      });
    }

    this.produtoSelecionadoId = null;
    this.qtdSelecionada = 1;
  }

  removerProduto(index: number): void {
    this.produtosAdicionados.splice(index, 1);
  }

  get totalProdutos(): number {
    return this.produtosAdicionados.reduce((soma, p) => soma + (p.subtotal || 0), 0);
  }

  get totalGeral(): number {
    const valorServico = this.formAtendimento?.get('valorServico')?.value || 0;
    return valorServico + this.totalProdutos;
  }

  validarCampo(campo: string, erro: string): boolean {
    const control = this.formAtendimento.get(campo);
    return !!(control && control.hasError(erro) && (control.touched || control.dirty));
  }

  salvar(): void {
    if (this.formAtendimento.invalid) {
      this.formAtendimento.markAllAsTouched();
      return;
    }

    const dadosForm = this.formAtendimento.value;

    const dadosAtendimento: Atendimento = {
      data: dadosForm.data,
      situacao: dadosForm.situacao,
      valorServico: dadosForm.valorServico,
      servico_id: dadosForm.servico_id,
      animal_id: dadosForm.animal_id,
      pessoa_funcionario_id: dadosForm.pessoa_funcionario_id,
      produtos: this.produtosAdicionados.map(p => ({ produtoId: p.produtoId, qtd: p.qtd }))
    } as any;

    const id = dadosForm.id;
    const operacao = id
      ? this.atendimentoService.alterar(id, dadosAtendimento)
      : this.atendimentoService.salvar(dadosAtendimento);

    operacao.subscribe({
      next: () => this.router.navigate(['/atendimentos']),
      error: () => this.mensagemErro = 'Erro ao salvar o atendimento.'
    });
  }
}