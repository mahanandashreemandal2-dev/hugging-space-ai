import { DollarSign, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import Sidebar from "@/components/dashboard/Sidebar";
import StatCard from "@/components/dashboard/StatCard";
import SpendingChart from "@/components/dashboard/SpendingChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { Button } from "@/components/ui/button";

const stats = [
  {
    icon: DollarSign,
    iconBg: "bg-blue-500/10 text-blue-400",
    label: "Total Balance",
    value: "$45,231.89",
    change: "12.5%",
    changeType: "up" as const,
  },
  {
    icon: TrendingUp,
    iconBg: "bg-emerald-500/10 text-emerald-400",
    label: "Monthly Income",
    value: "$8,432.5",
    change: "8.2%",
    changeType: "up" as const,
  },
  {
    icon: TrendingDown,
    iconBg: "bg-purple-500/10 text-purple-400",
    label: "Monthly Expenses",
    value: "$3,120.45",
    change: "4.1%",
    changeType: "down" as const,
  },
  {
    icon: PiggyBank,
    iconBg: "bg-primary/10 text-primary",
    label: "Total Savings",
    value: "$12,450",
    change: "15.3%",
    changeType: "up" as const,
  },
];

const Index = () => {
  return (
    <div className="dark flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Welcome back, demo123</h1>
            <p className="text-sm text-muted-foreground">Here's what's happening with your finance today.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">Check Balance</Button>
            <Button variant="destructive">Send Money</Button>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <SpendingChart />
          </div>
          <div className="lg:col-span-2">
            <RecentTransactions />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
