import AdminSidebar from "./AdminSidebar";
import { createClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-sand flex">
      <AdminSidebar user={user} />
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
