import { pgTable, text, integer, timestamp, boolean, pgEnum } from 'drizzle-orm/pg-core'

export const statusVeiculoEnum = pgEnum('status_veiculo', ['aguardando', 'em_servico', 'concluido', 'entregue'])
export const statusPagamentoEnum = pgEnum('status_pagamento', ['pendente', 'pago'])
export const formaPagamentoEnum = pgEnum('forma_pagamento', ['dinheiro', 'pix', 'credito', 'debito', 'outro'])

// Funcionários
export const funcionarios = pgTable('funcionarios', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text('nome').notNull(),
  telefone: text('telefone').notNull().default(''),
  cargo: text('cargo').notNull().default('Lavador'),
  ativo: boolean('ativo').notNull().default(true),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
})

// Serviços cadastrados
export const servicos = pgTable('servicos', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text('nome').notNull(),
  descricao: text('descricao').notNull().default(''),
  preco: integer('preco').notNull(), // em centavos
  comissao: integer('comissao').notNull().default(0), // em centavos
  duracaoMin: integer('duracao_min').notNull().default(30),
  ativo: boolean('ativo').notNull().default(true),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
})

// Clientes
export const clientes = pgTable('clientes', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  nome: text('nome').notNull(),
  telefone: text('telefone').notNull().default(''),
  criadoEm: timestamp('criado_em').notNull().defaultNow(),
})

// Ordens de serviço (entrada de veículo)
export const ordens = pgTable('ordens', {
  id: text('id').primaryKey().$defaultFn(() => crypto.randomUUID()),
  numero: integer('numero').notNull(),
  clienteId: text('cliente_id').references(() => clientes.id),
  nomeCliente: text('nome_cliente').notNull(),
  telefoneCliente: text('telefone_cliente').notNull().default(''),
  modeloVeiculo: text('modelo_veiculo').notNull(),
  placaVeiculo: text('placa_veiculo').notNull().default(''),
  corVeiculo: text('cor_veiculo').notNull().default(''),
  servicoId: text('servico_id').references(() => servicos.id),
  servicoNome: text('servico_nome').notNull(),
  servicoPreco: integer('servico_preco').notNull(), // em centavos
  funcionarioId: text('funcionario_id').references(() => funcionarios.id),
  funcionarioNome: text('funcionario_nome').notNull().default(''),
  comissaoValor: integer('comissao_valor').notNull().default(0),
  status: statusVeiculoEnum('status').notNull().default('aguardando'),
  statusPagamento: statusPagamentoEnum('status_pagamento').notNull().default('pendente'),
  formaPagamento: formaPagamentoEnum('forma_pagamento'),
  observacoes: text('observacoes').notNull().default(''),
  entradaEm: timestamp('entrada_em').notNull().defaultNow(),
  saidaEm: timestamp('saida_em'),
})
