"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { Icons } from "./icons";
import { Toaster } from "./ui/toaster";

const navItems = [
  { href: "/", icon: Icons.Dashboard, label: "Overview" },
  { href: "/anomaly-detection", icon: Icons.AnomalyDetection, label: "Anomaly Detection" },
  { href: "/policies", icon: Icons.PolicyManagement, label: "Policy Management" },
  { href: "/shadow-monitor", icon: Icons.ShadowMonitor, label: "Shadow Monitor" },
  { href: "/violation-analysis", icon: Icons.ViolationAnalysis, label: "Violation Analysis" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="group-data-[collapsible=icon]:hidden">
               <Icons.Logo className="size-6 text-primary" />
            </Button>
            <div className="flex flex-col group-data-[collapsible=icon]:hidden">
              <span className="text-lg font-semibold tracking-tight">AAGATE</span>
              <span className="text-xs text-muted-foreground">by Firebase</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <Link href={item.href}>
                    <item.icon className="shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="group-data-[collapsible=icon]:hidden">
          <div className="p-2 text-xs text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} AAGATE
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex items-center justify-between h-14 px-4 border-b bg-background/80 backdrop-blur-sm">
          <SidebarTrigger />
          <div className="flex items-center gap-4">
            <span className="font-semibold">Agentic AI Governance</span>
            <UserNav />
          </div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
            <Toaster />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function UserNav() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src="https://placehold.co/40x40.png" alt="@shadcn" data-ai-hint="person avatar" />
            <AvatarFallback>AU</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Admin User</p>
            <p className="text-xs leading-none text-muted-foreground">
              admin@aagate.dev
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
