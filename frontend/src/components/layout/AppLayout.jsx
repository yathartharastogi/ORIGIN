import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

import AnimatedBackground from "./AnimatedBackground";
import AppHeader from "./AppHeader";
import AppSidebar from "./AppSidebar";

export default function AppLayout({ children }) {
  return (
    <SidebarProvider>
      <AnimatedBackground />

      <AppSidebar />

      <SidebarInset className="bg-transparent">
        <AppHeader />

        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}