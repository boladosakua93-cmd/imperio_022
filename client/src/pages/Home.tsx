import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Car, CheckCircle2, Clock, DollarSign, Loader2, RefreshCw, Wrench } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

const STATUS_LABELS: Record<string, string> = {
  pending:     "Aguardando",
  in_progress: "Em andamento",
  completed:   "Concluído",
  cancelled:   "Cancelado",
};

const STATUS_COLORS: Record<string, string> = {
  pending:     "bg-yellow-100 text-yellow-800 border-yellow-200",
  in_progress: "bg-blue-100 text-blue-800 border-blue-200",
  completed:   "bg-green-100 text-green-800 border-green-200",
  cancelled:   "bg-gray-100 text-gray-600 border-gray-200",
};

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  loading,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            {loading ? (
              <Skeleton className="mt-1 h-8 w-20" />
            ) : (
              <p className="text-3xl font-bold mt-1">{value}</p>
            )}
          </div>
          <div className={`rounded-full p-3 ${color}`}>
            <Icon className="h-5 w-5 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const statsQuery = trpc.orders.stats.useQuery(undefined, { refetchInterval: 30_000 });
  const ordersQuery = trpc.orders.list.useQuery(undefined, { refetchInterval: 30_000 });
  const updateStatus = trpc.orders.updateStatus.useMutation({
    onSuccess: () => {
      statsQuery.refetch();
      ordersQuery.refetch();
    },
  });

  const stats = statsQuery.data;
  const orders = ordersQuery.data ?? [];

  function handleAdvance(id: number, current: string) {
    const next =
      current === "pending" ? "in_progress" :
      current === "in_progress" ? "completed" :
      null;
    if (!next) return;
    const completionTime = next === "completed" ? new Date().toISOString() : undefined;
    updateStatus.mutate({ id, status: next as any, completionTime });
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Visão geral do dia — Império 022</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { statsQuery.refetch(); ordersQuery.refetch(); }}
            disabled={statsQuery.isFetching}
          >
            {statsQuery.isFetching ? (
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-1" />
            )}
            Atualizar
          </Button>
        </div>

        {/* Cards de estatísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Aguardando"
            value={stats?.pending ?? "—"}
            icon={Clock}
            color="bg-yellow-500"
            loading={statsQuery.isLoading}
          />
          <StatCard
            title="Em andamento"
            value={stats?.inProgress ?? "—"}
            icon={Wrench}
            color="bg-blue-500"
            loading={statsQuery.isLoading}
          />
          <StatCard
            title="Concluídos hoje"
            value={stats?.completedToday ?? "—"}
            icon={CheckCircle2}
            color="bg-green-500"
            loading={statsQuery.isLoading}
          />
          <StatCard
            title="Faturamento hoje"
            value={
              stats?.revenueToday != null
                ? `R$ ${Number(stats.revenueToday).toFixed(2).replace(".", ",")}`
                : "—"
            }
            icon={DollarSign}
            color="bg-emerald-600"
            loading={statsQuery.isLoading}
          />
        </div>

        {/* Fila de ordens de serviço */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Car className="h-5 w-5" />
              Ordens de serviço recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ordersQuery.isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((n) => (
                  <Skeleton key={n} className="h-10 w-full" />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Car className="mx-auto h-10 w-10 mb-3 opacity-30" />
                <p>Nenhuma ordem de serviço encontrada.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>OS</TableHead>
                      <TableHead>Veículo</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valor</TableHead>
                      <TableHead>Entrada</TableHead>
                      <TableHead className="text-right">Ação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.slice(0, 20).map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm font-medium">
                          #{order.orderNumber}
                        </TableCell>
                        <TableCell>Veículo #{order.vehicleId}</TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${STATUS_COLORS[order.status] ?? ""}`}
                          >
                            {STATUS_LABELS[order.status] ?? order.status}
                          </span>
                        </TableCell>
                        <TableCell className="font-medium">
                          R$ {Number(order.price).toFixed(2).replace(".", ",")}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {new Date(order.entryTime).toLocaleString("pt-BR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {order.status !== "completed" && order.status !== "cancelled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleAdvance(order.id, order.status)}
                              disabled={updateStatus.isPending}
                            >
                              {order.status === "pending" ? "Iniciar" : "Concluir"}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
