import {
  double,
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core";

// ── Usuários (autenticação web OAuth) ──────────────────────────────────────
export const users = mysqlTable("users", {
  id:           int("id").autoincrement().primaryKey(),
  openId:       varchar("openId",       { length: 64  }).notNull().unique(),
  name:         text("name"),
  email:        varchar("email",        { length: 320 }),
  loginMethod:  varchar("loginMethod",  { length: 64  }),
  role:         mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt:    timestamp("createdAt").defaultNow().notNull(),
  updatedAt:    timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// ── Clientes ───────────────────────────────────────────────────────────────
export const clients = mysqlTable("clients", {
  id:        int("id").autoincrement().primaryKey(),
  name:      varchar("name",  { length: 255 }).notNull(),
  phone:     varchar("phone", { length: 20  }),
  email:     varchar("email", { length: 320 }),
  address:   text("address"),
  city:      varchar("city",  { length: 100 }),
  state:     varchar("state", { length: 2   }),
  notes:     text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ── Categorias de veículos ─────────────────────────────────────────────────
export const vehicleCategories = mysqlTable("vehicle_categories", {
  id:          int("id").autoincrement().primaryKey(),
  name:        varchar("name",        { length: 100 }).notNull(),
  description: text("description"),
  createdAt:   timestamp("createdAt").defaultNow().notNull(),
});

// ── Tipos de serviço ───────────────────────────────────────────────────────
export const serviceTypes = mysqlTable("service_types", {
  id:              int("id").autoincrement().primaryKey(),
  name:            varchar("name", { length: 100 }).notNull(),
  description:     text("description"),
  basePrice:       double("basePrice").notNull(),
  durationMinutes: int("durationMinutes"),
  active:          int("active").default(1).notNull(),
  createdAt:       timestamp("createdAt").defaultNow().notNull(),
  updatedAt:       timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ── Veículos ───────────────────────────────────────────────────────────────
export const vehicles = mysqlTable("vehicles", {
  id:         int("id").autoincrement().primaryKey(),
  plate:      varchar("plate", { length: 10 }).notNull().unique(),
  brand:      varchar("brand", { length: 50  }),
  model:      varchar("model", { length: 100 }),
  color:      varchar("color", { length: 50  }),
  year:       int("year"),
  categoryId: int("categoryId"),
  clientId:   int("clientId"),
  createdAt:  timestamp("createdAt").defaultNow().notNull(),
  updatedAt:  timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ── Ordens de serviço (fila) ───────────────────────────────────────────────
export const serviceOrders = mysqlTable("service_orders", {
  id:             int("id").autoincrement().primaryKey(),
  orderNumber:    varchar("orderNumber", { length: 20 }).notNull().unique(),
  vehicleId:      int("vehicleId").notNull(),
  clientId:       int("clientId"),
  serviceTypeId:  int("serviceTypeId"),
  employeeId:     int("employeeId"),
  status:         mysqlEnum("status", [
                    "pending",
                    "in_progress",
                    "completed",
                    "cancelled",
                  ]).default("pending").notNull(),
  price:          double("price").notNull(),
  paymentMethod:  varchar("paymentMethod", { length: 30 }).default("cash"),
  entryTime:      timestamp("entryTime").defaultNow().notNull(),
  completionTime: timestamp("completionTime"),
  notes:          text("notes"),
  createdAt:      timestamp("createdAt").defaultNow().notNull(),
  updatedAt:      timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

// ── Entradas de caixa ──────────────────────────────────────────────────────
export const cashEntries = mysqlTable("cash_entries", {
  id:            int("id").autoincrement().primaryKey(),
  orderId:       int("orderId"),
  type:          mysqlEnum("type", ["income", "expense"]).notNull(),
  amount:        double("amount").notNull(),
  description:   text("description"),
  paymentMethod: varchar("paymentMethod", { length: 30 }).default("cash"),
  createdBy:     int("createdBy"),
  createdAt:     timestamp("createdAt").defaultNow().notNull(),
});

// ── Tipos exportados ───────────────────────────────────────────────────────
export type User             = typeof users.$inferSelect;
export type InsertUser       = typeof users.$inferInsert;
export type Client           = typeof clients.$inferSelect;
export type InsertClient     = typeof clients.$inferInsert;
export type Vehicle          = typeof vehicles.$inferSelect;
export type InsertVehicle    = typeof vehicles.$inferInsert;
export type ServiceOrder     = typeof serviceOrders.$inferSelect;
export type InsertServiceOrder = typeof serviceOrders.$inferInsert;
export type ServiceType      = typeof serviceTypes.$inferSelect;
export type CashEntry        = typeof cashEntries.$inferSelect;
