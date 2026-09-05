
import { useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  Bot,
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  ShieldCheck,
  Terminal,
  History,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

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
    url: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Investigate",
    url: "/investigate",
    icon: Search,
  },
  {
    title: "Investigation Log",
    url: "/investigations",
    icon: History,
  },
];

function getInitials(name) {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getRoleName(role) {
  const roles = {
    ADMIN: "Administrator",
    SUPPORT_AGENT: "Support Agent",
    ANALYST: "Analyst",
    VIEWER: "Viewer",
  };

  return roles[role] || role || "User";
}

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      navigate("/login", { replace: true });
    }
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-white/[0.06] bg-[#07090d]"
    >
      {/* Header */}
      <SidebarHeader className="border-b border-white/[0.06] px-4 py-5">
        <button
          onClick={() => navigate("/dashboard")}
          className="flex w-full items-center gap-3 text-left"
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/[0.08]">
            <ShieldCheck className="h-5 w-5 text-cyan-400" />
          </div>

          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-sm font-semibold tracking-tight text-white">
              LedgerLens
            </div>

            <div className="mt-0.5 truncate text-[9px] uppercase tracking-[0.18em] text-slate-600">
              Payment Intelligence
            </div>
          </div>
        </button>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4">
        {/* Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-[9px] uppercase tracking-[0.18em] text-slate-600 group-data-[collapsible=icon]:hidden">
            Workspace
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;

                const isActive =
                  location.pathname === item.url ||
                  (item.url !== "/dashboard" &&
                    location.pathname.startsWith(`${item.url}/`));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={() => navigate(item.url)}
                      className={`
                        relative h-10 rounded-lg px-3
                        transition-all duration-200
                        ${
                          isActive
                            ? "bg-cyan-400/[0.08] text-cyan-300 hover:bg-cyan-400/[0.1] hover:text-cyan-200"
                            : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                        }
                      `}
                    >
                      {isActive && (
                        <span className="absolute left-0 h-5 w-0.5 rounded-full bg-cyan-400" />
                      )}

                      <Icon className="h-4 w-4 shrink-0" />

                      <span className="text-sm group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Connected Systems */}
        <SidebarGroup className="mt-5">
          <SidebarGroupLabel className="px-3 text-[9px] uppercase tracking-[0.18em] text-slate-600 group-data-[collapsible=icon]:hidden">
            Connected Systems
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <div className="space-y-1 px-2 group-data-[collapsible=icon]:px-0">
              {[
                ["Gateway", "Operational"],
                ["Bank", "Operational"],
                ["Ledger", "Operational"],
              ].map(([name, status]) => (
                <div
                  key={name}
                  className="flex items-center gap-3 rounded-lg px-2 py-2"
                >
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                  </span>

                  <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                    <div className="text-xs text-slate-400">{name}</div>
                    <div className="text-[9px] text-slate-600">{status}</div>
                  </div>
                </div>
              ))}
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* AI Engine */}
        <SidebarGroup className="mt-5">
          <SidebarGroupLabel className="px-3 text-[9px] uppercase tracking-[0.18em] text-slate-600 group-data-[collapsible=icon]:hidden">
            AI Engine
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <div className="mx-2 rounded-xl border border-cyan-400/10 bg-cyan-400/[0.025] p-3 group-data-[collapsible=icon]:mx-0">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-400/[0.07]">
                  <Bot className="h-4 w-4 text-cyan-400" />
                </div>

                <div className="min-w-0 group-data-[collapsible=icon]:hidden">
                  <div className="text-xs font-medium text-slate-300">
                    LedgerLens AI
                  </div>

                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span className="text-[9px] text-slate-600">
                      Ready
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Bottom utility links */}
      
      </SidebarContent>

      {/* User / Logout */}
      <SidebarFooter className="border-t border-white/[0.06] p-3">
        <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-2.5">
          <Avatar className="h-9 w-9 shrink-0 border border-white/10">
            <AvatarFallback className="bg-cyan-400/10 text-xs font-semibold text-cyan-300">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <div className="truncate text-xs font-medium text-slate-200">
              {user?.name || "User"}
            </div>

            <div className="mt-0.5 truncate text-[10px] text-slate-600">
              {getRoleName(user?.role)}
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Logout"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-red-500/10 hover:text-red-400 group-data-[collapsible=icon]:hidden"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>

        {/* Collapsed logout */}
        <button
          onClick={handleLogout}
          title="Logout"
          className="mt-2 hidden h-9 w-full items-center justify-center rounded-lg text-slate-600 transition hover:bg-red-500/10 hover:text-red-400 group-data-[collapsible=icon]:flex"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}

