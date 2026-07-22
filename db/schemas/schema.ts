import { pgTable, text, integer, serial } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

// Funcionários
export const funcionarios = pgTable('funcionarios', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  telefone: text('telefone').notNull().default(''),
  cargo: text('cargo').notNull().default('Lavador'),
  ativo: integer('ativo', { mode: 'boolean' }).notNull().default(true),
  criadoEm: text('criado_em').notNull().default(sql`CURRENT_TIMESTAMP`),
})

// Serviços cadastrados
export const servicos = pgTable('servicos', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  descricao: text('descricao').notNull().default(''),
  preco: integer('preco').notNull(), // em centavos
  comissao: integer('comissao').notNull().default(0), // em centavos
  duracaoMin: integer('duracao_min').notNull().default(30),
  ativo: integer('ativo', { mode: 'boolean' }).notNull().default(true),
  criadoEm: text('criado_em').notNull().default(sql`CURRENT_TIMESTAMP`),
})

// Clientes
export const clientes = pgTable('clientes', {
  id: serial('id').primaryKey(),
  nome: text('nome').notNull(),
  telefone: text('telefone').notNull().default(''),
  criadoEm: text('criado_em').notNull().default(sql`CURRENT_TIMESTAMP`),
})

// Ordens de serviço (entrada de veículo)
export const ordens = pgTable('ordens', {
  id: serial('id').primaryKey(),
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
  funcionarioId: text("funcionario_id").references(() => funcionarios.id),
  funcionarioNome: text("funcionario_nome").notNull().default(""),
  comissaoValor: integer('comissao_valor').notNull().default(0),
  status: text('status').notNull().default('aguardando'), // aguardando, em_servico, concluido, entregue
  statusPagamento: text('status_pagamento').notNull().default('pendente'), // pendente, pago
  formaPagamento: text('forma_pagamento'), // dinheiro, pix, credito, debito, outro
  observacoes: text('observacoes').notNull().default(''),
  entradaEm: text('entrada_em').notNull().default(sql`CURRENT_TIMESTAMP`),
  saidaEm: text('saida_em'),
})
