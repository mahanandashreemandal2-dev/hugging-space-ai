import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Send, Eye } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SpendingChart from "@/components/dashboard/SpendingChart";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const stats = [
  { icon: DollarSign, iconBg: "bg-blue-500/10 text-blue-400", label: "Total Balance", value: "$45,231.89", change: "12.5%", changeType: "up" as const },
  { icon: TrendingUp, iconBg: "bg-emerald-500/10 text-emerald-400", label: "Monthly Income", value: "$8,432.5", change: "8.2%", changeType: "up" as const },
  { icon: TrendingDown, iconBg: "bg-purple-500/10 text-purple-400", label: "Monthly Expenses", value: "$3,120.45", change: "4.1%", changeType: "down" as const },
  { icon: PiggyBank, iconBg: "bg-primary/10 text-primary", label: "Total Savings", value: "$12,450", change: "15.3%", changeType: "up" as const },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [sendAmount, setSendAmount] = useState("");
  const [sendTo, setSendTo] = useState("");
  const [sendOpen, setSendOpen] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);

  const handleSend = () => {
    if (!sendAmount || !sendTo) return;
    toast({ title: "Money Sent!", description: `$${sendAmount} sent to ${sendTo} successfully.` });
    setSendAmount("");
    setSendTo("");
    setSendOpen(false);
  };

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, demo123</h1>
          <p className="text-sm text-muted-foreground">Here's what's happening with your finance today.</p>
        </div>
        <div className="flex gap-3">
          <Dialog open={balanceOpen} onOpenChange={setBalanceOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Eye className="mr-2 h-4 w-4" /> Check Balance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Account Balances</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 pt-2">
                {[
                  { name: "Savings Account", balance: "$25,400.00" },
                  { name: "Checking Account", balance: "$8,231.89" },
                  { name: "Investment Portfolio", balance: "$11,600.00" },
                ].map((acc) => (
                  <div key={acc.name} className="flex items-center justify-between rounded-lg bg-secondary p-3">
                    <span className="text-sm text-foreground">{acc.name}</span>
                    <span className="font-semibold text-foreground">{acc.balance}</span>
                  </div>
                ))}
                <div className="flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 p-3">
                  <span className="text-sm font-medium text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">$45,231.89</span>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={sendOpen} onOpenChange={setSendOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive">
                <Send className="mr-2 h-4 w-4" /> Send Money
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Money</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Recipient</Label>
                  <Input placeholder="Enter name or account number" value={sendTo} onChange={(e) => setSendTo(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Amount ($)</Label>
                  <Input type="number" placeholder="0.00" value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} />
                </div>
                <Button className="w-full" onClick={handleSend}>
                  <Send className="mr-2 h-4 w-4" /> Send
                </Button>
              </div>
            </DialogContent>
          </Dialog>
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
    </div>
  );
};

export default Dashboard;
