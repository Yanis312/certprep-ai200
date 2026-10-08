"use client";

import { certs, type Cert } from "@/data/certs";
import { useCertCode } from "@/lib/progress";

export function useCert(): [Cert, (code: string) => void] {
  const [code, setCode] = useCertCode(certs[0].code);
  return [certs.find((c) => c.code === code) ?? certs[0], setCode];
}

export default function CertTabs({ current, onChange }: { current: Cert; onChange: (code: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Certification">
      {certs.map((c) => {
        const active = c.code === current.code;
        return (
          <button
            key={c.code}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(c.code)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${active ? "bg-indigo-600 text-white border-indigo-600 shadow-sm" : "bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600"}`}
          >
            <span>{c.icon}</span>
            {c.code}
          </button>
        );
      })}
    </div>
  );
}
