import { useQuery } from "@tanstack/react-query";
import { Users, Building2, UserCheck, Clock, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import type { Broker, Customer } from "@shared/schema";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

interface AdminStats {
  totalBrokers: number;
  totalCustomers: number;
  activeCustomers: number;
  pendingCustomers: number;
}

interface BrokerWithCustomers extends Broker {
  customerCount: number;
}

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
        <div className="text-4xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-10 w-16" />
        <Skeleton className="h-3 w-32 mt-2" />
      </CardContent>
    </Card>
  );
}

function BrokerTableSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <TableRow key={i}>
          <TableCell><Skeleton className="h-4 w-32" /></TableCell>
          <TableCell><Skeleton className="h-4 w-40" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
          <TableCell><Skeleton className="h-4 w-8" /></TableCell>
          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
        </TableRow>
      ))}
    </>
  );
}

function CustomerRow({ customer }: { customer: Customer }) {
  const statusConfig = {
    active: { label: "Active", variant: "default" as const },
    pending: { label: "Pending", variant: "secondary" as const },
    inactive: { label: "Inactive", variant: "outline" as const },
  };

  const status = statusConfig[customer.status];

  return (
    <TableRow data-testid={`row-customer-${customer.id}`}>
      <TableCell className="font-medium">{customer.name}</TableCell>
      <TableCell>{customer.email}</TableCell>
      <TableCell>
        <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded">
          {customer.gstin}
        </code>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-1">
          {customer.type === "exporter" ? (
            <ArrowUpRight className="h-3 w-3" />
          ) : (
            <ArrowDownLeft className="h-3 w-3" />
          )}
          <span className="capitalize">{customer.type}</span>
        </div>
      </TableCell>
      <TableCell>
        <Badge variant={status.variant}>{status.label}</Badge>
      </TableCell>
      <TableCell className="text-muted-foreground">
        {format(new Date(customer.createdAt), "MMM d, yyyy")}
      </TableCell>
    </TableRow>
  );
}

export default function Admin() {
  const { data: stats, isLoading: statsLoading } = useQuery<AdminStats>({
    queryKey: ["/api/admin/stats"],
  });

  const { data: brokers, isLoading: brokersLoading } = useQuery<BrokerWithCustomers[]>({
    queryKey: ["/api/admin/brokers"],
  });

  const { data: allCustomers, isLoading: customersLoading } = useQuery<Customer[]>({
    queryKey: ["/api/admin/customers"],
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold" data-testid="text-admin-title">
          Admin Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">
          Overview of all brokers and customers on the platform
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard
              title="Total Brokers"
              value={stats?.totalBrokers || 0}
              icon={Building2}
              description="Registered customs brokers"
            />
            <StatCard
              title="Total Customers"
              value={stats?.totalCustomers || 0}
              icon={Users}
              description="Exporters and importers"
            />
            <StatCard
              title="Active Customers"
              value={stats?.activeCustomers || 0}
              icon={UserCheck}
              description="Verified and active"
            />
            <StatCard
              title="Pending Verification"
              value={stats?.pendingCustomers || 0}
              icon={Clock}
              description="Awaiting review"
            />
          </>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4" data-testid="text-brokers-heading">
          Registered Brokers
        </h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Customers</TableHead>
                <TableHead>Registered</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brokersLoading ? (
                <BrokerTableSkeleton />
              ) : brokers && brokers.length > 0 ? (
                brokers.map((broker) => (
                  <TableRow key={broker.id} data-testid={`row-broker-${broker.id}`}>
                    <TableCell className="font-medium">{broker.name}</TableCell>
                    <TableCell>{broker.email}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {broker.companyName || "-"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{broker.customerCount}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(broker.createdAt), "MMM d, yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No brokers registered yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4" data-testid="text-all-customers-heading">
          All Customers
        </h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>GSTIN</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customersLoading ? (
                <BrokerTableSkeleton />
              ) : allCustomers && allCustomers.length > 0 ? (
                allCustomers.map((customer) => (
                  <CustomerRow key={customer.id} customer={customer} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No customers onboarded yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
