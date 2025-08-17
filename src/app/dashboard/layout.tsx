// src/app/dashboard/layout.tsx
import Sidebar from '@/component/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      {/* Sidebar always on the left */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 bg-gray-50 min-h-screen p-6">
        {children}
      </main>
    </div>
  );
}
