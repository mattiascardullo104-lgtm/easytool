import { SITE } from "@/lib/site";
import Link from "next/link";

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Back to home
        </Link>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          LEGAL
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-8">
          Cookie Policy
        </h1>

        <div className="space-y-8 text-sm text-[var(--text-muted)] leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              1. What cookies are
            </h2>
            <p>
              Cookies are small text files stored by your browser while you
              browse. They make the site work and collect statistical or
              advertising information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              2. Cookies used by {SITE.name}
            </h2>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>Technical cookies</strong>: essential for the site to
                work (e.g. local storage of tool preferences and the Premium
                status).
              </li>
              <li>
                <strong>Analytics cookies</strong>: aggregated visit
                statistics.
              </li>
              <li>
                <strong>Advertising cookies</strong>: if the site displays
                Google AdSense ads, Google and its partners may use cookies to
                show relevant ads. You can manage these preferences at{" "}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-steel)]"
                >
                  adssettings.google.com
                </a>
                .
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              3. How to manage cookies
            </h2>
            <p>
              You can disable or delete cookies from your browser settings
              (Chrome, Firefox, Safari, Edge, etc.). Disabling technical
              cookies may affect some site features.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              4. Contact
            </h2>
            <p>
              For any question about cookies, write to {SITE.email}.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
