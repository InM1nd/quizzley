import Sidebar from "@/components/layout/Sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex-1 pl-0 lg:pl-64 min-h-screen">
        <Sidebar />
        {children}
      </div>
    </>
  );
}
