import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, Users, Package, ArrowUpRight, ArrowDownLeft, UserCheck, Clock, XCircle } from "lucide-react";
import type { Customer } from "@shared/schema";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

function StatCard({
  title,
  value,
  icon: Icon,
  description,
}: {
  title: string;
  value: number;
  icon: typeof Users;
  description?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function CustomerCard({ customer }: { customer: Customer }) {
  const statusConfig = {
    active: { label: "Active", variant: "default" as const },
    pending: { label: "Pending", variant: "secondary" as const },
    inactive: { label: "Inactive", variant: "outline" as const },
  };

  const typeConfig = {
    exporter: { icon: ArrowUpRight, label: "Exporter" },
    importer: { icon: ArrowDownLeft, label: "Importer" },
  };

  const status = statusConfig[customer.status];
  const type = typeConfig[customer.type];
  const TypeIcon = type.icon;

  return (
    <Card className="hover-elevate" data-testid={`card-customer-${customer.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-medium truncate">
              {customer.name}
            </CardTitle>
            <CardDescription className="truncate mt-1">
              {customer.email}
            </CardDescription>
          </div>
          <Badge variant={status.variant} className="shrink-0">
            {status.label}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <TypeIcon className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{type.label}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">GSTIN:</span>
            <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
              {customer.gstin}
            </code>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CustomerCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
          <Skeleton className="h-5 w-16" />
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-36" />
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <Card className="col-span-full">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div className="rounded-full bg-muted p-4 mb-4">
          <Users className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-2">No customers yet</h3>
        <p className="text-muted-foreground text-center mb-6 max-w-sm">
          Start by adding your first exporter or importer to begin the onboarding process.
        </p>
        <Link href="/customers/add">
          <Button data-testid="button-add-first-customer">
            <Plus className="mr-2 h-4 w-4" />
            Add Your First Customer
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const { broker } = useAuth();

  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const stats = {
    total: customers?.length || 0,
    active: customers?.filter((c) => c.status === "active").length || 0,
    pending: customers?.filter((c) => c.status === "pending").length || 0,
    inactive: customers?.filter((c) => c.status === "inactive").length || 0,
    exporters: customers?.filter((c) => c.type === "exporter").length || 0,
    importers: customers?.filter((c) => c.type === "importer").length || 0,
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold" data-testid="text-dashboard-title">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, {broker?.name}
          </p>
        </div>
        <Link href="/customers/add">
          <Button data-testid="button-add-customer">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Customers"
          value={stats.total}
          icon={Users}
          description="All onboarded customers"
        />
        <StatCard
          title="Active"
          value={stats.active}
          icon={UserCheck}
          description="Verified and active"
        />
        <StatCard
          title="Pending"
          value={stats.pending}
          icon={Clock}
          description="Awaiting verification"
        />
        <StatCard
          title="Exporters"
          value={stats.exporters}
          icon={ArrowUpRight}
          description={`${stats.importers} importers`}
        />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4" data-testid="text-customers-heading">
          Your Customers
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading ? (
            <>
              <CustomerCardSkeleton />
              <CustomerCardSkeleton />
              <CustomerCardSkeleton />
            </>
          ) : customers && customers.length > 0 ? (
            customers.map((customer) => (
              <CustomerCard key={customer.id} customer={customer} />
            ))
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
