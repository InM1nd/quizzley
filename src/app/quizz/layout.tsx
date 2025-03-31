import Header from "@/components/header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col flex-1 max-w-7xl w-full m-auto h-screen gap-6">
        {children}
      </div>
    </>
  );
}
