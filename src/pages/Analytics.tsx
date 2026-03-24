import { BarChart3, TrendingUp, TrendingDown, DollarSign, PieChart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip,
  BarChart, Bar, PieChart as RechartsPie, Pie, Cell, Legend,
} from "recharts";

const monthlyData = [
  { month: "Jan", income: 5200, expenses: 3100 },
  { month: "Feb", income: 6100, expenses: 3400 },
  { month: "Mar", income: 5800, expenses: 2900 },
  { month: "Apr", income: 7200, expenses: 4100 },
  { month: "May", income: 6800, expenses: 3600 },
  { month: "Jun", income: 8400, expenses: 3200 },
];

const categoryData = [
  { name: "Food & Drink", value: 1200, color: "hsl(30, 100%, 50%)" },
  { name: "Technology", value: 2100, color: "hsl(199, 89%, 48%)" },
  { name: "Transport", value: 800, color: "hsl(142, 71%, 45%)" },
  { name: "Entertainment", value: 600, color: "hsl(270, 70%, 60%)" },
  { name: "Subscriptions", value: 450, color: "hsl(0, 72%, 51%)" },
];

const weeklySpending = [
  { week: "Week 1", amount: 1200 },
  { week: "Week 2", amount: 980 },
  { week: "Week 3", amount: 1450 },
  { week: "Week 4", amount: 1100 },
];

const tooltipStyle = {
  backgroundColor: "hsl(220, 15%, 11%)",
  border: "1px solid hsl(220, 15%, 18%)",
  borderRadius: "8px",
  color: "hsl(210, 20%, 95%)",
};

const Analytics = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground">Track your financial performance over time.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          { icon: TrendingUp, label: "Avg Monthly Income", value: "$6,583", color: "text-emerald-400" },
          { icon: TrendingDown, label: "Avg Monthly Expenses", value: "$3,383", color: "text-red-400" },
          { icon: DollarSign, label: "Net Savings Rate", value: "48.6%", color: "text-primary" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-xl font-bold text-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Income vs Expenses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" /> Income vs Expenses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                <XAxis dataKey="month" stroke="hsl(215, 15%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="income" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="hsl(0, 72%, 51%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Spending by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-primary" /> Spending by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPie>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={4}>
                    {categoryData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} />
                  <Legend formatter={(value) => <span className="text-xs text-muted-foreground">{value}</span>} />
                </RechartsPie>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Spending Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklySpending}>
                  <defs>
                    <linearGradient id="weeklyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(30, 100%, 50%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(30, 100%, 50%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
                  <XAxis dataKey="week" stroke="hsl(215, 15%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Area type="monotone" dataKey="amount" stroke="hsl(30, 100%, 50%)" strokeWidth={2} fill="url(#weeklyGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
