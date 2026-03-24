import { Home, BarChart3, CreditCard, Wallet, User, Settings, LogOut } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/" },
  { icon: BarChart3, label: "Analytics", path: "/analytics" },
  { icon: CreditCard, label: "Cards", path: "/cards" },
  { icon: Wallet, label: "Assets", path: "/assets" },
  { icon: User, label: "Profile", path: "/profile" },
];

const bottomItems = [
  { icon: Settings, label: "Settings", path: "/settings" },
];

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="flex h-screen w-52 flex-col bg-sidebar p-4">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="h-8 w-8 rounded-full bg-primary" />
        <span className="text-lg font-bold text-sidebar-foreground">Kodbank</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            end={item.path === "/"}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex flex-col gap-1">
        {bottomItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent"
            activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
        <button className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground transition-colors hover:bg-sidebar-accent">
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
