import { Wallet, TrendingUp, TrendingDown, Bitcoin, DollarSign, Landmark, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const assets = [
  {
    icon: DollarSign,
    name: "Savings Account",
    category: "Cash",
    value: "$25,400.00",
    change: "+2.1%",
    changeType: "up",
    iconBg: "bg-emerald-500/10 text-emerald-400",
  },
  {
    icon: Landmark,
    name: "Fixed Deposit",
    category: "Cash",
    value: "$10,000.00",
    change: "+5.5%",
    changeType: "up",
    iconBg: "bg-blue-500/10 text-blue-400",
  },
  {
    icon: Bitcoin,
    name: "Bitcoin",
    category: "Crypto",
    value: "$4,231.89",
    change: "-3.2%",
    changeType: "down",
    iconBg: "bg-amber-500/10 text-amber-400",
  },
  {
    icon: BarChart3,
    name: "S&P 500 ETF",
    category: "Stocks",
    value: "$3,600.00",
    change: "+8.4%",
    changeType: "up",
    iconBg: "bg-purple-500/10 text-purple-400",
  },
  {
    icon: Wallet,
    name: "Ethereum",
    category: "Crypto",
    value: "$2,000.00",
    change: "+1.8%",
    changeType: "up",
    iconBg: "bg-cyan-500/10 text-cyan-400",
  },
];

const totalValue = "$45,231.89";

const Assets = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Assets</h1>
        <p className="text-sm text-muted-foreground">Overview of all your assets and investments.</p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 p-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
            <p className="text-3xl font-bold text-foreground">{totalValue}</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {assets.map((asset) => (
          <Card key={asset.name} className="transition-colors hover:bg-secondary/50">
            <CardContent className="flex items-center justify-between p-4">
              <div className="flex items-center gap-4">
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg", asset.iconBg)}>
                  <asset.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{asset.name}</p>
                  <p className="text-xs text-muted-foreground">{asset.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-foreground">{asset.value}</p>
                <div className="flex items-center justify-end gap-1">
                  {asset.changeType === "up" ? (
                    <TrendingUp className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  )}
                  <span className={cn("text-xs", asset.changeType === "up" ? "text-emerald-400" : "text-red-400")}>
                    {asset.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Assets;
