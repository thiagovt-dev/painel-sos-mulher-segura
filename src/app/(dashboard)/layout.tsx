import * as React from "react";
import DashboardShell from "./_components/DashboardShell";
import { requireAdmin } from "@/lib/auth/guards";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return <DashboardShell>{children}</DashboardShell>;
}
