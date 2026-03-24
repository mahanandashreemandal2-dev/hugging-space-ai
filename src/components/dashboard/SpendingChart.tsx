import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { day: "Mon", amount: 2400 },
  { day: "Tue", amount: 3200 },
  { day: "Wed", amount: 4100 },
  { day: "Thu", amount: 3800 },
  { day: "Fri", amount: 3000 },
  { day: "Sat", amount: 2200 },
  { day: "Sun", amount: 2800 },
];

const SpendingChart = () => {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-foreground">Spending Analytics</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(30, 100%, 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(30, 100%, 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 18%)" />
            <XAxis dataKey="day" stroke="hsl(215, 15%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(215, 15%, 55%)" fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(220, 15%, 11%)",
                border: "1px solid hsl(220, 15%, 18%)",
                borderRadius: "8px",
                color: "hsl(210, 20%, 95%)",
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="hsl(30, 100%, 50%)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorAmount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SpendingChart;
