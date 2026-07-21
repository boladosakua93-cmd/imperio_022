import { eq, desc, and, gte, lte, sql } from "drizzle-orm";
import { z } from "zod/v4";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import {
  clients, vehicles, serviceOrders, serviceTypes, cashEntries,
  InsertClient, InsertVehicle, InsertServiceOrder,
} from "../drizzle/schema";

// ── Auth ──────────────────────────────────────────────────────────────────────
const authRouter = router({
  me: publicProcedure.query(opts => opts.ctx.user),
  logout: publicProcedure.mutation(({ ctx }) => {
    const opts = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...opts, maxAge: -1 });
    return { success: true } as const;
  }),
});

// ── Clientes ──────────────────────────────────────────────────────────────────
const clientsRouter = router({
  list: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(clients).orderBy(desc(clients.createdAt));
  }),

  create: protectedProcedure
    .input(z.object({
      name:    z.string().min(1),
      phone:   z.string().optional(),
      email:   z.string().optional(),
      address: z.string().optional(),
      city:    z.string().optional(),
      state:   z.string().optional(),
      notes:   z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.insert(clients).values(input as InsertClient);
      return { success: true };
    }),

  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(clients).where(eq(clients.id, input.id)).limit(1);
      return result[0] ?? null;
    }),
});

// ── Veículos ──────────────────────────────────────────────────────────────────
const vehiclesRouter = router({
  list: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(vehicles).orderBy(desc(vehicles.createdAt));
  }),

  create: protectedProcedure
    .input(z.object({
      plate:      z.string().min(1),
      brand:      z.string().optional(),
      model:      z.string().optional(),
      color:      z.string().optional(),
      year:       z.number().optional(),
      categoryId: z.number().optional(),
      clientId:   z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.insert(vehicles).values(input as InsertVehicle);
      return { success: true };
    }),

  getByPlate: protectedProcedure
    .input(z.object({ plate: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;
      const result = await db.select().from(vehicles)
        .where(eq(vehicles.plate, input.plate)).limit(1);
      return result[0] ?? null;
    }),
});

// ── Tipos de serviço ──────────────────────────────────────────────────────────
const serviceTypesRouter = router({
  list: protectedProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return db.select().from(serviceTypes).orderBy(serviceTypes.name);
  }),
});

// ── Ordens de serviço ─────────────────────────────────────────────────────────
const ordersRouter = router({
  list: protectedProcedure
    .input(z.object({
      status:    z.enum(["pending","in_progress","completed","cancelled"]).optional(),
      dateFrom:  z.string().optional(),
      dateTo:    z.string().optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const conditions = [];
      if (input?.status) conditions.push(eq(serviceOrders.status, input.status));
      if (input?.dateFrom) conditions.push(gte(serviceOrders.createdAt, new Date(input.dateFrom)));
      if (input?.dateTo)   conditions.push(lte(serviceOrders.createdAt, new Date(input.dateTo)));
      const query = conditions.length
        ? db.select().from(serviceOrders).where(and(...conditions))
        : db.select().from(serviceOrders);
      return query.orderBy(desc(serviceOrders.createdAt));
    }),

  create: protectedProcedure
    .input(z.object({
      orderNumber:   z.string().min(1),
      vehicleId:     z.number(),
      clientId:      z.number().optional(),
      serviceTypeId: z.number().optional(),
      employeeId:    z.number().optional(),
      price:         z.number(),
      paymentMethod: z.string().optional(),
      notes:         z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.insert(serviceOrders).values({
        ...input,
        status: "pending",
        entryTime: new Date(),
      } as InsertServiceOrder);
      return { success: true };
    }),

  updateStatus: protectedProcedure
    .input(z.object({
      id:             z.number(),
      status:         z.enum(["pending","in_progress","completed","cancelled"]),
      completionTime: z.string().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database unavailable");
      await db.update(serviceOrders)
        .set({
          status: input.status,
          completionTime: input.completionTime ? new Date(input.completionTime) : undefined,
          updatedAt: new Date(),
        })
        .where(eq(serviceOrders.id, input.id));
      return { success: true };
    }),

  stats: protectedProcedure
    .input(z.object({ date: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return { pending: 0, inProgress: 0, completedToday: 0, revenueToday: 0 };

      const today = input?.date ? new Date(input.date) : new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);

      const [pending, inProgress, todayOrders] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(serviceOrders)
          .where(eq(serviceOrders.status, "pending")),
        db.select({ count: sql<number>`count(*)` }).from(serviceOrders)
          .where(eq(serviceOrders.status, "in_progress")),
        db.select({ count: sql<number>`count(*)`, revenue: sql<number>`COALESCE(SUM(price),0)` })
          .from(serviceOrders)
          .where(and(
            eq(serviceOrders.status, "completed"),
            gte(serviceOrders.completionTime, today),
            lte(serviceOrders.completionTime, tomorrow),
          )),
      ]);

      return {
        pending:       Number(pending[0]?.count ?? 0),
        inProgress:    Number(inProgress[0]?.count ?? 0),
        completedToday: Number(todayOrders[0]?.count ?? 0),
        revenueToday:  Number(todayOrders[0]?.revenue ?? 0),
      };
    }),
});

// ── Caixa ─────────────────────────────────────────────────────────────────────
const cashRouter = router({
  list: protectedProcedure
    .input(z.object({ dateFrom: z.string().optional(), dateTo: z.string().optional() }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];
      const conditions = [];
      if (input?.dateFrom) conditions.push(gte(cashEntries.createdAt, new Date(input.dateFrom)));
      if (input?.dateTo)   conditions.push(lte(cashEntries.createdAt, new Date(input.dateTo)));
      const query = conditions.length
        ? db.select().from(cashEntries).where(and(...conditions))
        : db.select().from(cashEntries);
      return query.orderBy(desc(cashEntries.createdAt));
    }),
});

// ── App router ────────────────────────────────────────────────────────────────
export const appRouter = router({
  system:       systemRouter,
  auth:         authRouter,
  clients:      clientsRouter,
  vehicles:     vehiclesRouter,
  serviceTypes: serviceTypesRouter,
  orders:       ordersRouter,
  cash:         cashRouter,
});

export type AppRouter = typeof appRouter;
