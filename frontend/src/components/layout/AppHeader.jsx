import { Bell, Command, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AppHeader() {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-white/[0.06] bg-[#07090d]/80 px-5 backdrop-blur-xl">
      <SidebarTrigger />

      <div className="hidden h-8 w-px bg-white/[0.08] md:block" />

      {/* Search */}
      <div className="relative max-w-md flex-1">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />

        <Input
          placeholder="Search transaction ID..."
          className="h-9 border-white/[0.08] bg-white/[0.03] pl-9 pr-16 text-xs placeholder:text-muted-foreground/60 focus-visible:ring-1 focus-visible:ring-white/20"
        />

        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-md border border-white/[0.08] bg-white/[0.04] px-1.5 py-0.5 text-[9px] text-muted-foreground">
          <Command size={9} />
          K
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-muted-foreground hover:bg-white/[0.05] hover:text-white"
        >
          <Bell size={17} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-amber-400" />
        </Button>

        <div className="hidden h-6 w-px bg-white/[0.08] sm:block" />

        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-[10px] font-semibold">
            AK
          </div>

          <div className="hidden sm:block">
            <p className="text-xs font-medium">Alex Kumar</p>
            <p className="text-[9px] text-muted-foreground">
              Support Agent
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}