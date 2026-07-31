import Link from "next/link";
import PremiumButton from "@/components/PremiumButton";

export default function PremiumPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="font-tool text-xs text-[var(--accent-steel)] mb-8 inline-block">
          ← Back to home
        </Link>

        <div className="text-center mb-12">
          <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-3">
            EASYTOOLS PREMIUM
          </p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Zero ads.
            <br />
            <span className="bg-gradient-to-r from-[var(--accent-brass)] to-[var(--accent-steel)] bg-clip-text text-transparent">
              Everything else stays free.
            </span>
          </h1>
          <p className="text-[var(--text-muted)] text-lg max-w-lg mx-auto">
            EasyTools tools remain free forever. With Premium you only remove
            ads and support the development of the site.
          </p>
        </div>

        <div className="border border-[var(--border-subtle)] rounded-2xl p-8 bg-[var(--bg-surface)] mb-10 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(201,161,90,0.1),transparent_60%)]" />
          <div className="relative text-center">
            <p className="font-display text-5xl font-bold text-[var(--text-primary)] mb-2">
              €1.99<span className="text-lg text-[var(--text-muted)] font-normal">/month</span>
            </p>
            <p className="font-tool text-xs text-[var(--text-muted)] mb-8">
              CANCEL ANYTIME · NO COMMITMENT
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
              {[
                {
                  title: "No ads",
                  desc: "Every ad removed, everywhere on the site.",
                },
                {
                  title: "Support development",
                  desc: "Your contribution keeps everything free for others.",
                },
                {
                  title: "Premium badge",
                  desc: "A visible badge in the site header.",
                },
              ].map((b) => (
                <div key={b.title} className="border border-[var(--border-subtle)] rounded-xl p-5 bg-[var(--bg-base)]/60">
                  <p className="font-display text-base font-semibold text-[var(--accent-brass)] mb-2">
                    {b.title}
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">{b.desc}</p>
                </div>
              ))}
            </div>

            <PremiumButton />

            <p className="font-tool text-xs text-[var(--text-muted)] mt-6">
              Secure payment via Ko-fi · cancel anytime from your Ko-fi area
            </p>
          </div>
        </div>

        <div className="text-center text-sm text-[var(--text-muted)] max-w-xl mx-auto">
          <p>
            A question? Write to us at{" "}
            <a href="mailto:contatto@easytools.it" className="text-[var(--accent-steel)]">
              contatto@easytools.it
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
