import React from "react";

export default function PotreePage() {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-hidden app-surface text-[color:var(--foreground)]">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 h-full">
        <div className="app-frame p-8 h-full flex items-center justify-center">
          <div className="text-center space-y-4">
        <div className="mx-auto w-20 h-20 rounded-2xl bg-[var(--muted)] flex items-center justify-center shadow">
          <svg className="w-10 h-10 text-[#94A3B8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">Potree Viewer</h1>
          <p className="text-lg text-[color:var(--foreground)]/70">To be implemented</p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--muted)] border border-neutral-200 text-sm text-[color:var(--foreground)]/60">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Coming soon
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
