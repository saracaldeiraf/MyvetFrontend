import { Routes } from '@angular/router';

import { Principal } from './components/principal/principal';
import { ProdutoForm } from './components/produto-form/produto-form';
import { ProdutoList } from './components/produto-list/produto-list';
import { ServicoForm } from './components/servico-form/servico-form';
import { ServicoList } from './components/servico-list/servico-list';
import { AnimalForm } from './components/animal-form/animal-form';
import { AnimalList } from './components/animal-list/animal-list';
import { ClienteForm } from './components/cliente-form/cliente-form';
import { ClienteList } from './components/cliente-list/cliente-list';
import { FuncionarioForm } from './components/funcionario-form/funcionario-form';
import { FuncionarioList } from './components/funcionario-list/funcionario-list';
import { AtendimentoForm } from './components/atendimento-form/atendimento-form';
import { AtendimentoList } from './components/atendimento-list/atendimento-list';


export const routes: Routes = [
  {
    path: '',
    component: Principal,
    children: [
      {
        path: 'produtos',
        component: ProdutoList
      },
      {
        path: 'produtos/cadastrar',
        component: ProdutoForm
      },
      {
        path: 'produtos/alterar/:id',
        component: ProdutoForm
      },
      {
        path: 'servicos',
        component: ServicoList
      },
      {
        path: 'servicos/cadastrar',
        component: ServicoForm
      },
      {
        path: 'servicos/alterar/:id',
        component: ServicoForm
      },
      {
        path: 'animais',
        component: AnimalList
      },
      {
        path: 'animais/cadastrar',
        component: AnimalForm
      },
      {
        path: 'animais/alterar/:id',
        component: AnimalForm
      },

      {
        path: 'clientes',
        component: ClienteList
      },
      {
        path: 'clientes/cadastrar',
        component: ClienteForm
      },
      {
        path: 'clientes/alterar/:id',
        component: ClienteForm
      },

      {
        path: '',
        redirectTo: 'clientes',
        pathMatch: 'full'
      },
      {
        path: 'funcionarios',
        component: FuncionarioList
      },
      {
        path: 'funcionarios/cadastrar',
        component: FuncionarioForm
      },
      {
        path: 'funcionarios/alterar/:id',
        component: FuncionarioForm
      },

      {
        path: 'atendimentos',
        component: AtendimentoList
      },
      {
        path: 'atendimentos/cadastrar',
        component: AtendimentoForm
      },
      {
        path: 'atendimentos/alterar/:id',
        component: AtendimentoForm
      }
    ]
  }
];