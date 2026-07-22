CREATE TYPE "public"."forma_pagamento" AS ENUM('dinheiro', 'pix', 'credito', 'debito', 'outro');--> statement-breakpoint
CREATE TYPE "public"."status_pagamento" AS ENUM('pendente', 'pago');--> statement-breakpoint
CREATE TYPE "public"."status_veiculo" AS ENUM('aguardando', 'em_servico', 'concluido', 'entregue');--> statement-breakpoint
CREATE TABLE "clientes" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"telefone" text DEFAULT '' NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "funcionarios" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"telefone" text DEFAULT '' NOT NULL,
	"cargo" text DEFAULT 'Lavador' NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ordens" (
	"id" text PRIMARY KEY NOT NULL,
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
	"status" "status_veiculo" DEFAULT 'aguardando' NOT NULL,
	"status_pagamento" "status_pagamento" DEFAULT 'pendente' NOT NULL,
	"forma_pagamento" "forma_pagamento",
	"observacoes" text DEFAULT '' NOT NULL,
	"entrada_em" timestamp DEFAULT now() NOT NULL,
	"saida_em" timestamp
);
--> statement-breakpoint
CREATE TABLE "servicos" (
	"id" text PRIMARY KEY NOT NULL,
	"nome" text NOT NULL,
	"descricao" text DEFAULT '' NOT NULL,
	"preco" integer NOT NULL,
	"comissao" integer DEFAULT 0 NOT NULL,
	"duracao_min" integer DEFAULT 30 NOT NULL,
	"ativo" boolean DEFAULT true NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ordens" ADD CONSTRAINT "ordens_cliente_id_clientes_id_fk" FOREIGN KEY ("cliente_id") REFERENCES "public"."clientes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordens" ADD CONSTRAINT "ordens_servico_id_servicos_id_fk" FOREIGN KEY ("servico_id") REFERENCES "public"."servicos"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ordens" ADD CONSTRAINT "ordens_funcionario_id_funcionarios_id_fk" FOREIGN KEY ("funcionario_id") REFERENCES "public"."funcionarios"("id") ON DELETE no action ON UPDATE no action;