import type { Metadata } from "next";
import { getModules, summarize } from "@/lib/course";
import PlanClient from "@/components/PlanClient";

export const metadata: Metadata = { title: "Plan de révision AI-200 — CertPrep" };

export default function PlanPage() {
  return <PlanClient modules={getModules().map(summarize)} />;
}
