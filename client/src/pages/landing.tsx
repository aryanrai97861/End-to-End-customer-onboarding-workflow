import { Link } from "wouter";
import { Package, Users, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth-context";

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Users;
  title: string;
  description: string;
}) {
  return (
    <Card className="hover-elevate">
      <CardContent className="pt-6">
        <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm">{description}</p>
      </CardContent>
    </Card>
  );
}

export default function Landing() {
  const { isAuthenticated, broker } = useAuth();

  const features = [
    {
      icon: Users,
      title: "Customer Onboarding",
      description:
        "Quickly register exporters and importers with validated GSTIN verification.",
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description:
        "Industry-standard security with encrypted passwords and secure sessions.",
    },
    {
      icon: Package,
      title: "Centralized Dashboard",
      description:
        "Manage all your customers from a single, intuitive dashboard.",
    },
  ];

  const benefits = [
    "Streamlined customer registration process",
    "GSTIN validation and verification",
    "Real-time customer status tracking",
    "Secure broker authentication",
    "Admin oversight and reporting",
    "Mobile-friendly responsive design",
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between gap-4 p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-semibold text-lg">ClearBroker</span>
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link href={broker?.isAdmin ? "/admin" : "/dashboard"}>
              <Button data-testid="button-go-to-dashboard">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" data-testid="button-login-header">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button data-testid="button-register-header">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </header>

      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Streamlined Customer Onboarding for{" "}
                <span className="text-primary">Customs Brokers</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Register, verify, and manage your exporters and importers with
                our secure, efficient platform designed specifically for customs
                brokerage operations.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                {isAuthenticated ? (
                  <Link href={broker?.isAdmin ? "/admin" : "/dashboard"}>
                    <Button size="lg" data-testid="button-dashboard-hero">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link href="/register">
                      <Button size="lg" data-testid="button-get-started">
                        Get Started Free
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href="/login">
                      <Button
                        size="lg"
                        variant="outline"
                        data-testid="button-sign-in-hero"
                      >
                        Sign In
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4 md:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">
                Everything You Need to Onboard Customers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform provides all the tools customs brokers need to
                efficiently manage their customer base.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3 max-w-5xl mx-auto">
              {features.map((feature) => (
                <FeatureCard key={feature.title} {...feature} />
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24">
          <div className="container mx-auto px-4 md:px-8">
            <div className="max-w-5xl mx-auto grid gap-12 lg:grid-cols-2 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  Why Choose ClearBroker?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Built specifically for customs brokerage operations, our
                  platform streamlines the entire customer onboarding process
                  from registration to verification.
                </p>
                <ul className="space-y-3">
                  {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
                    <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Quick Registration</div>
                      <div className="text-sm text-muted-foreground">
                        Onboard customers in minutes
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
                    <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">GSTIN Validation</div>
                      <div className="text-sm text-muted-foreground">
                        Automatic format verification
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-muted rounded-md">
                    <div className="rounded-full bg-primary/10 w-10 h-10 flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-medium">Unified Dashboard</div>
                      <div className="text-sm text-muted-foreground">
                        All customers in one place
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <span className="font-semibold">ClearBroker</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Secure customer onboarding for customs brokers
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
