"use client";

import { useState } from "react";

type Cert = {
  title: string;
  provider: string;
  icon: string;
  status: "en-cours" | "planifie" | "fait";
  color: string;
  bg: string;
  border: string;
  url?: string;
};

const certs: Cert[] = [
  {
    title: "AI-103 — Azure AI Apps and Agents Developer Associate",
    provider: "Microsoft",
    icon: "🤖",
    status: "en-cours",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  {
    title: "AI-200 — Azure AI Cloud Developer Associate",
    provider: "Microsoft",
    icon: "☁️",
    status: "planifie",
    color: "text-indigo-700",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
  },
  {
    title: "Foundational C# with Microsoft",
    provider: "Microsoft",
    icon: "🔷",
    status: "planifie",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    title: "ASP.NET Core — Fondamentaux & API REST",
    provider: "Microsoft",
    icon: "🌐",
    status: "planifie",
    color: "text-blue-700",
    bg: "bg-blue-50",
    border: "border-blue-200",
  },
  {
    title: "Playwright — Tests end-to-end",
    provider: "Microsoft",
    icon: "🎭",
    status: "planifie",
    color: "text-slate-700",
    bg: "bg-slate-50",
    border: "border-slate-200",
  },
  {
    title: "MongoDB — Core Concepts & Schema Design",
    provider: "MongoDB",
    icon: "🍃",
    status: "planifie",
    color: "text-green-700",
    bg: "bg-green-50",
    border: "border-green-200",
  },
  {
    title: "Python for Data Science",
    provider: "IBM",
    icon: "🐍",
    status: "planifie",
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
  },
  {
    title: "Maîtrise de l'IA",
    provider: "Microsoft",
    icon: "🤖",
    status: "planifie",
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
  },
];

const statusLabel = {
  "en-cours": { label: "En cours", color: "bg-indigo-500 text-white" },
  "planifie": { label: "À venir", color: "bg-slate-200 text-slate-600" },
  "fait": { label: "Complété ✓", color: "bg-emerald-100 text-emerald-700" },
};

export default function Roadmap() {
  const [open, setOpen] = useState(false);

  const done = certs.filter((c) => c.status === "fait").length;
  const inProgress = certs.filter((c) => c.status === "en-cours").length;

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden mt-6">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">🏆</span>
          <div className="text-left">
            <p className="font-bold text-slate-800 text-sm">Roadmap certifications</p>
            <p className="text-xs text-slate-400">{done}/{certs.length} complétées · {inProgress} en cours</p>
          </div>
        </div>
        <span className="text-slate-300 text-sm">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-slate-50">
          <div className="space-y-2 mt-3">
            {certs.map((cert, i) => {
              const s = statusLabel[cert.status];
              return (
                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl border ${cert.bg} ${cert.border}`}>
                  <span className="text-lg shrink-0">{cert.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-xs leading-tight ${cert.color}`}>{cert.title}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{cert.provider}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${s.color}`}>
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="text-xs text-slate-300 text-center mt-4">
            Inspiré par les certifs de Dyhia 💪
          </p>
        </div>
      )}
    </div>
  );
}
