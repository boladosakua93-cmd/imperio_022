import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, DollarSign, CheckCircle2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";

function fmt(n: number) {
  return `R$ ${n.toFixed(2).replace(".", ",")}`;
}

export default function Reports() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  const now = new Date();
  const dateFrom =
    period === "today"
      ? (() => { const d = new Date(now); d.setHours(0,0,0,0); return d.toISOString(); })()
      : period === "week"
      ? (() => { const d = new Date(now); d.setDate(d.getDate()-6); d.setHours(0,0,0,0); return d.toISOString(); })()
      : (() => { const d = new Date(now); d.setDate(1); d.setHours(0,0,0,0); return d.toISOString(); })();

  const ordersQuery = trpc.orders.list.useQuery({ dateFrom });
  const orders = ordersQuery.data ?? [];

  const completed   = orders.filter(o => o.status === "completed");
  const totalRev    = completed.reduce((s, o) => s + Number(o.price), 0);
  const avgTicket   = completed.length ? totalRev / completed.length : 0;
  const pending     = orders.filter(o => o.status === "pending").length;
  const cancelled   = orders.filter(o => o.status === "cancelled").length;

  const byPayment: Record<string, number> = {};
  completed.forEach(o => {
    const pm = o.paymentMethod ?? "cash";
    byPayment[pm] = (byPayment[pm] ?? 0) + Number(o.price);
  });

  const pmLabels: Record<string, string> = {
    cash: "Dinheiro", pix: "PIX", credit: "Crédito", debit: "Débito",
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground text-sm">Análise financeira e operacional</p>
        </div>

        {/* Filtro de período */}
        <div className="flex gap-2">
          {(["today","week","month"] as const).map(p => (
            <Button key={p} size="sm" variant={period===p?"default":"outline"} onClick={()=>setPeriod(p)}>
              {p==="today"?"Hoje":p==="week"?"7 dias":"Mês"}
            </Button>
          ))}
        </div>

        {ordersQuery.isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1,2,3,4].map(n=><Skeleton key={n} className="h-28" />)}
          </div>
        ) : (
          <>
            {/* Cards resumo */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Faturamento</p>
                      <p className="text-2xl font-bold">{fmt(totalRev)}</p>
                    </div>
                    <div className="bg-emerald-600 rounded-full p-2">
                      <DollarSign className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Ticket médio</p>
                      <p className="text-2xl font-bold">{fmt(avgTicket)}</p>
                    </div>
                    <div className="bg-blue-500 rounded-full p-2">
                      <TrendingUp className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Concluídos</p>
                      <p className="text-2xl font-bold">{completed.length}</p>
                    </div>
                    <div className="bg-green-500 rounded-full p-2">
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground">Total de ordens</p>
                      <p className="text-2xl font-bold">{orders.length}</p>
                    </div>
                    <div className="bg-purple-500 rounded-full p-2">
                      <BarChart3 className="h-4 w-4 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pagamentos por método */}
            {Object.keys(byPayment).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Faturamento por forma de pagamento</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {Object.entries(byPayment).map(([pm, val]) => (
                      <div key={pm} className="flex justify-between items-center py-1 border-b last:border-0">
                        <span className="text-sm">{pmLabels[pm] ?? pm}</span>
                        <span className="font-semibold">{fmt(val)}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 font-bold">
                      <span>Total</span>
                      <span>{fmt(totalRev)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Detalhes */}
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <p>Aguardando: <strong>{pending}</strong></p>
              <p>Cancelados: <strong>{cancelled}</strong></p>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
