import { Home, BarChart3, CreditCard, Wallet, User, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: BarChart3, label: "Analytics" },
  { icon: CreditCard, label: "Cards" },
  { icon: Wallet, label: "Assets" },
  { icon: User, label: "Profile" },
];

const bottomItems = [
  { icon: Settings, label: "Settings" },
  { icon: LogOut, label: "Logout" },
];

const Sidebar = () => {
  return (
    <aside className="flex h-screen w-52 flex-col bg-sidebar p-4">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-full bg-primary" />
        <span className="text-lg font-bold text-sidebar-foreground">Kodbank</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <button
            key={item.label}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              item.active
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="flex flex-col gap-1">
        {bottomItems.map((item) => (
          <button
            key={item.label}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
