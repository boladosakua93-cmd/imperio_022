import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Car, CheckCircle2, PlayCircle, XCircle } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";

const STATUS_LABELS: Record<string, string> = {
  pending: "Aguardando", in_progress: "Em andamento",
  completed: "Concluído",   cancelled: "Cancelado",
};
const STATUS_COLORS: Record<string, string> = {
  pending:     "border-l-yellow-400",
  in_progress: "border-l-blue-500",
  completed:   "border-l-green-500",
  cancelled:   "border-l-gray-400",
};

export default function Queue() {
  const [filter, setFilter] = useState<string>("all");
  const ordersQuery = trpc.orders.list.useQuery(
    filter !== "all" ? { status: filter as any } : undefined,
    { refetchInterval: 20_000 },
  );
  const updateStatus = trpc.orders.updateStatus.useMutation({
    onSuccess: () => ordersQuery.refetch(),
  });

  const orders = ordersQuery.data ?? [];

  function handleAction(id: number, current: string, action: "advance" | "cancel") {
    if (action === "cancel") {
      updateStatus.mutate({ id, status: "cancelled" });
      return;
    }
    const next = current === "pending" ? "in_progress" : "completed";
    const completionTime = next === "completed" ? new Date().toISOString() : undefined;
    updateStatus.mutate({ id, status: next as any, completionTime });
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Fila de Serviços</h1>
          <p className="text-muted-foreground text-sm">Gerencie as ordens em tempo real</p>
        </div>

        {/* Filtros */}
        <div className="flex gap-2 flex-wrap">
          {["all","pending","in_progress","completed"].map((s) => (
            <Button
              key={s}
              size="sm"
              variant={filter === s ? "default" : "outline"}
              onClick={() => setFilter(s)}
            >
              {s === "all" ? "Todas" : STATUS_LABELS[s]}
            </Button>
          ))}
        </div>

        {ordersQuery.isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(n => <Skeleton key={n} className="h-24 w-full" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Car className="mx-auto h-12 w-12 mb-3 opacity-30" />
            <p>Nenhuma ordem encontrada.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <Card key={order.id} className={`border-l-4 ${STATUS_COLORS[order.status]}`}>
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm">#{order.orderNumber}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {STATUS_LABELS[order.status]}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Veículo #{order.vehicleId} •{" "}
                        R$ {Number(order.price).toFixed(2).replace(".",",")} •{" "}
                        {new Date(order.entryTime).toLocaleTimeString("pt-BR",{hour:"2-digit",minute:"2-digit"})}
                      </p>
                      {order.notes && <p className="text-xs text-muted-foreground mt-1 truncate">{order.notes}</p>}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      {order.status !== "completed" && order.status !== "cancelled" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleAction(order.id, order.status, "advance")}
                            disabled={updateStatus.isPending}
                          >
                            {order.status === "pending"
                              ? <><PlayCircle className="h-4 w-4 mr-1" />Iniciar</>
                              : <><CheckCircle2 className="h-4 w-4 mr-1" />Concluir</>}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleAction(order.id, order.status, "cancel")}
                            disabled={updateStatus.isPending}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
