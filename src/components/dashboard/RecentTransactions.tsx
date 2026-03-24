import { Monitor, Coffee, ArrowUpRight, Tv } from "lucide-react";
import { cn } from "@/lib/utils";

const transactions = [
  {
    icon: Monitor,
    iconBg: "bg-blue-500/10 text-blue-400",
    name: "Apple Store",
    category: "Technology",
    date: "Feb 20, 2026",
    amount: "-$999.00",
    status: "Completed",
    isPositive: false,
  },
  {
    icon: Coffee,
    iconBg: "bg-amber-500/10 text-amber-400",
    name: "Starbucks Coffee",
    category: "Food & Drink",
    date: "Feb 19, 2026",
    amount: "-$15.50",
    status: "Completed",
    isPositive: false,
  },
  {
    icon: ArrowUpRight,
    iconBg: "bg-emerald-500/10 text-emerald-400",
    name: "Salary Deposit",
    category: "Income",
    date: "Feb 18, 2026",
    amount: "+$5000.00",
    status: "Completed",
    isPositive: true,
  },
  {
    icon: Tv,
    iconBg: "bg-purple-500/10 text-purple-400",
    name: "Amazon Prime",
    category: "Subscription",
    date: "Feb 17, 2026",
    amount: "-$14.99",
    status: "Pending",
    isPositive: false,
  },
];

const RecentTransactions = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Recent Transactions</h3>
      <div className="flex flex-col gap-4">
        {transactions.map((t, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", t.iconBg)}>
                <t.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">
                  {t.category} • {t.date}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className={cn(
                  "text-sm font-semibold",
                  t.isPositive ? "text-emerald-400" : "text-foreground"
                )}
              >
                {t.amount}
              </p>
              <p
                className={cn(
                  "text-xs",
                  t.status === "Pending" ? "text-red-400" : "text-muted-foreground"
                )}
              >
                {t.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentTransactions;
