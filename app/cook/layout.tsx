import { CookSidebar } from "@/components/layout/cook-sidebar";

export default function CookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <CookSidebar />
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
