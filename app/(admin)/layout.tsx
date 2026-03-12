export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border/40 bg-muted/20 px-6 py-3">
        <h1 className="text-lg font-semibold">HomeCook Admin</h1>
      </header>
      <main className="p-6 md:p-8">{children}</main>
    </div>
  );
}
