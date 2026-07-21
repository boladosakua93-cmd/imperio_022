import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, Phone, Mail, Search } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";

export default function Clients() {
  const [search, setSearch] = useState("");
  const clientsQuery = trpc.clients.list.useQuery();
  const clients = (clientsQuery.data ?? []).filter(c =>
    !search ||
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone ?? "").includes(search),
  );

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Clientes</h1>
          <p className="text-muted-foreground text-sm">{clients.length} cliente(s) cadastrado(s)</p>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Buscar por nome ou telefone…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {clientsQuery.isLoading ? (
          <div className="space-y-3">
            {[1,2,3,4].map(n => <Skeleton key={n} className="h-20 w-full" />)}
          </div>
        ) : clients.length === 0 ? (
          <div className="py-16 text-center text-muted-foreground">
            <Users className="mx-auto h-12 w-12 mb-3 opacity-30" />
            <p>Nenhum cliente encontrado.</p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {clients.map(client => (
              <Card key={client.id}>
                <CardContent className="pt-4 pb-4">
                  <p className="font-semibold">{client.name}</p>
                  {client.phone && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" />{client.phone}
                    </p>
                  )}
                  {client.email && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />{client.email}
                    </p>
                  )}
                  {client.city && (
                    <p className="text-xs text-muted-foreground mt-1">{client.city}</p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
