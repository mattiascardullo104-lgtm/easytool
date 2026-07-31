import { SITE } from "@/lib/site";

export default function AdSlot({ className = "" }: { className?: string }) {
  return (
    <div className={`w-full ${className}`}>
      <p className="font-tool text-[10px] tracking-widest text-[var(--text-muted)] text-center mb-2">
        PUBBLICITÀ
      </p>
      {SITE.adsenseClient ? (
        // Appena imposti adsenseClient in lib/site.ts, qui viene mostrato l'annuncio.
        <ins
          className="adsbygoogle block mx-auto"
          style={{ display: "block", minHeight: 90 }}
          data-ad-client={SITE.adsenseClient}
          data-ad-slot="0000000000"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="border border-dashed border-[var(--border-subtle)] rounded-lg py-8 flex flex-col items-center justify-center gap-2 bg-[var(--bg-surface)]/40">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5">
            <path d="M12 3l10 18H2L12 3z" />
          </svg>
          <span className="font-tool text-[11px] text-[var(--text-muted)]">
            Spazio pubblicitario
          </span>
        </div>
      )}
    </div>
  );
}
