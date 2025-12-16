import { SidebarProvider } from "@/components/ui/sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return( <SidebarProvider>
    <DashboardSidebar />
    <main className="flex felx-col h-screen
     w-screen bg-muted">
        {children}
    </main>

    </Sidebar>);
};

export default Layout;
