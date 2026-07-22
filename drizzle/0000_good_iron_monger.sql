CREATE TABLE "clientes" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"telefone" text DEFAULT '' NOT NULL,
	"criado_em" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "funcionarios" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"telefone" text DEFAULT '' NOT NULL,
	"cargo" text DEFAULT 'Lavador' NOT NULL,
	"ativo" integer DEFAULT true NOT NULL,
	"criado_em" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ordens" (
	"id" serial PRIMARY KEY NOT NULL,
	"numero" integer NOT NULL,
	"cliente_id" text,
	"nome_cliente" text NOT NULL,
	"telefone_cliente" text DEFAULT '' NOT NULL,
	"modelo_veiculo" text NOT NULL,
	"placa_veiculo" text DEFAULT '' NOT NULL,
	"cor_veiculo" text DEFAULT '' NOT NULL,
	"servico_id" text,
	"servico_nome" text NOT NULL,
	"servico_preco" integer NOT NULL,
	"funcionario_id" text,
	"funcionario_nome" text DEFAULT '' NOT NULL,
	"comissao_valor" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'aguardando' NOT NULL,
	"status_pagamento" text DEFAULT 'pendente' NOT NULL,
	"forma_pagamento" text,
	"observacoes" text DEFAULT '' NOT NULL,
	"entrada_em" text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"saida_em" text
);
--> statement-breakpoint
CREATE TABLE "servicos" (
	"id" serial PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"descricao" text DEFAULT '' NOT NULL,
	"preco" integer NOT NULL,
	"comissao" integer DEFAULT 0 NOT NULL,
	"duracao_min" integer DEFAULT 30 NOT NULL,
	"ativo" integer DEFAULT true NOT NULL,
	"criado_em" text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ordens" ADD CONSTRAINT "ordens_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordens" ADD CONSTRAINT "ordens_servico_id_servicos_id_fk" FOREIGN KEY ("servico_id") REFERENCES "public"."servicos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordens" ADD CONSTRAINT "ordens_funcionario_id_funcionarios_id_fk" FOREIGN KEY ("funcionario_id") REFERENCES "public"."funcionarios"("id") ON DELETE no action ON UPDATE no action;