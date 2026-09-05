import { Bell, Command, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AppHeader() {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-white/[0.06] bg-[#07090d]/80 px-5 backdrop-blur-xl">
      <SidebarTrigger />

      <div className="hidden h-8 w-px bg-white/[0.08] md:block" />

    

      
        
      
    </header>
  );
}