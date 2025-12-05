import DashboardClient from "./dashboard-client";

export const metadata = {
  title: "Admin - Dashboard",
};

export default function AdminPage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <DashboardClient />
    </main>
  );
}
