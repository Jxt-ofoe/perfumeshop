import '../admin.css';
import AdminNav from './AdminNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-layout">
      <AdminNav />
      <main className="admin-main">
        {children}
      </main>
    </div>
  );
}
