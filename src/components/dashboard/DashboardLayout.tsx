import Sidebar from "@/components/dashboard/Sidebar";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <div className="dark flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
