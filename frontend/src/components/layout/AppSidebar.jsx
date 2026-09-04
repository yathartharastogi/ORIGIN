import {
  Activity,
  Bot,
  ChevronDown,
  CircleHelp,
  FileSearch,
  History,
  LayoutDashboard,
  Search,
  Settings,
  ShieldCheck,
  UserRound,
  WalletCards,
  Zap,
} from "lucide-react";

import { useLocation, useNavigate } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";


const navigation = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Investigate",
    icon: Search,
    path: "/investigate",
  },
  {
    title: "Investigation Log",
    icon: History,
    path: "/investigations",
  },
];


const systems = [
  {
    name: "Payment Gateway",
    icon: WalletCards,
  },
  {
    name: "Bank Settlement",
    icon: Activity,
  },
  {
    name: "Internal Ledger",
    icon: FileSearch,
  },
];


export default function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();


  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    if (path === "/investigate") {
      return location.pathname === "/investigate";
    }

    if (path === "/investigations") {
      return location.pathname.startsWith("/investigations");
    }

    return location.pathname === path;
  };


  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-r border-white/[0.06]"
    >

      {/* ================================================= */}
      {/* LOGO */}
      {/* ================================================= */}

      <SidebarHeader className="border-b border-white/[0.05]">
        <div className="flex h-14 items-center gap-3 px-2">

          <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-500/20 bg-cyan-500/10">
            <ShieldCheck className="h-4.5 w-4.5 text-cyan-400" />

            <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          </div>

          <div className="flex min-w-0 flex-col group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold tracking-tight text-white">
              LedgerLens
            </span>

            <span className="truncate text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Payment Intelligence
            </span>
          </div>

        </div>
      </SidebarHeader>


      <SidebarContent className="px-2">


        {/* ================================================= */}
        {/* MAIN NAVIGATION */}
        {/* ================================================= */}

        <SidebarGroup>
          <SidebarGroupLabel className="px-2 text-[9px] uppercase tracking-[0.18em] text-slate-700">
            Workspace
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>

              {navigation.map((item) => {
                const active = isActive(item.path);

                return (
                  <SidebarMenuItem key={item.title}>

                    <SidebarMenuButton
                      onClick={() => navigate(item.path)}
                      isActive={active}
                      tooltip={item.title}
                      className={`
                        h-10 transition-all duration-200
                        ${
                          active
                            ? "bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/10 hover:text-cyan-300"
                            : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                        }
                      `}
                    >

                      <item.icon
                        className={`h-4 w-4 ${
                          active
                            ? "text-cyan-400"
                            : "text-slate-600"
                        }`}
                      />

                      <span className="text-xs font-medium">
                        {item.title}
                      </span>

                      {active && (
                        <div className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_7px_rgba(34,211,238,0.8)]" />
                      )}

                    </SidebarMenuButton>

                  </SidebarMenuItem>
                );
              })}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* ================================================= */}
        {/* CONNECTED SYSTEMS */}
        {/* ================================================= */}

        <SidebarGroup className="mt-3">

          <SidebarGroupLabel className="px-2 text-[9px] uppercase tracking-[0.18em] text-slate-700">
            Connected Systems
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>

              {systems.map((system) => (
                <SidebarMenuItem key={system.name}>

                  <SidebarMenuButton
                    tooltip={system.name}
                    className="h-9 text-slate-500 hover:bg-white/[0.03] hover:text-slate-300"
                  >

                    <system.icon className="h-3.5 w-3.5 text-slate-600" />

                    <span className="text-[11px]">
                      {system.name}
                    </span>

                    <div className="ml-auto flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

                      <span className="text-[8px] uppercase tracking-wider text-emerald-500 group-data-[collapsible=icon]:hidden">
                        Live
                      </span>
                    </div>

                  </SidebarMenuButton>

                </SidebarMenuItem>
              ))}

            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


        {/* ================================================= */}
        {/* AI ENGINE */}
        {/* ================================================= */}

        <SidebarGroup className="mt-3">

          <SidebarGroupLabel className="px-2 text-[9px] uppercase tracking-[0.18em] text-slate-700">
            Intelligence
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>

              <SidebarMenuItem>

                <SidebarMenuButton
                  tooltip="AI Engine"
                  className="h-9 text-slate-500 hover:bg-white/[0.03] hover:text-slate-300"
                >

                  <Bot className="h-3.5 w-3.5 text-cyan-500" />

                  <span className="text-[11px]">
                    AI Engine
                  </span>

                  <div className="ml-auto flex items-center gap-1.5">
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-400" />

                    <span className="text-[8px] uppercase tracking-wider text-cyan-500 group-data-[collapsible=icon]:hidden">
                      Ready
                    </span>
                  </div>

                </SidebarMenuButton>

              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarGroupContent>

        </SidebarGroup>


        {/* ================================================= */}
        {/* SETTINGS */}
        {/* ================================================= */}

        <SidebarGroup className="mt-3">

          <SidebarGroupLabel className="px-2 text-[9px] uppercase tracking-[0.18em] text-slate-700">
            System
          </SidebarGroupLabel>

          <SidebarGroupContent>

            <SidebarMenu>

              <SidebarMenuItem>

                <SidebarMenuButton
                  tooltip="Settings"
                  className="h-9 text-slate-500 hover:bg-white/[0.03] hover:text-slate-300"
                >
                  <Settings className="h-3.5 w-3.5" />

                  <span className="text-[11px]">
                    Settings
                  </span>
                </SidebarMenuButton>

              </SidebarMenuItem>


              <SidebarMenuItem>

                <SidebarMenuButton
                  tooltip="Help & Support"
                  className="h-9 text-slate-500 hover:bg-white/[0.03] hover:text-slate-300"
                >
                  <CircleHelp className="h-3.5 w-3.5" />

                  <span className="text-[11px]">
                    Help & Support
                  </span>
                </SidebarMenuButton>

              </SidebarMenuItem>

            </SidebarMenu>

          </SidebarGroupContent>

        </SidebarGroup>

      </SidebarContent>


      {/* ================================================= */}
      {/* USER */}
      {/* ================================================= */}

      <SidebarFooter className="border-t border-white/[0.05] p-2">

        <SidebarMenu>

          <SidebarMenuItem>

            <SidebarMenuButton
              tooltip="Account"
              className="h-12 text-slate-400 hover:bg-white/[0.04]"
            >

              <Avatar className="h-8 w-8 border border-white/[0.08]">
                <AvatarFallback className="bg-cyan-500/10 text-xs text-cyan-400">
                  AK
                </AvatarFallback>
              </Avatar>

              <div className="flex min-w-0 flex-1 flex-col text-left group-data-[collapsible=icon]:hidden">
                <span className="truncate text-xs font-medium text-slate-300">
                  Alex Kumar
                </span>

                <span className="truncate text-[9px] text-slate-600">
                  Support Agent
                </span>
              </div>

              <ChevronDown className="h-3.5 w-3.5 text-slate-700 group-data-[collapsible=icon]:hidden" />

            </SidebarMenuButton>

          </SidebarMenuItem>

        </SidebarMenu>


        {/* AI status */}
        <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/[0.04] bg-white/[0.015] px-3 py-2 group-data-[collapsible=icon]:hidden">

          <div className="relative">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-40" />
          </div>

          <span className="text-[9px] text-slate-600">
            All systems operational
          </span>

        </div>

      </SidebarFooter>

    </Sidebar>
  );
}