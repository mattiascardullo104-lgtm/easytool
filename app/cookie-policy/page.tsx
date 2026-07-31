import { SITE } from "@/lib/site";
import Link from "next/link";

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)] px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="font-tool text-xs text-[var(--accent-steel)] mb-6 inline-block">
          ← Torna alla home
        </Link>

        <p className="font-tool text-xs tracking-widest text-[var(--accent-brass)] mb-2">
          LEGALE
        </p>
        <h1 className="font-display text-3xl font-semibold text-[var(--text-primary)] mb-8">
          Cookie Policy
        </h1>

        <div className="space-y-8 text-sm text-[var(--text-muted)] leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              1. Cosa sono i cookie
            </h2>
            <p>
              I cookie sono piccoli file di testo salvati dal tuo browser durante
              la navigazione. Servono a far funzionare il sito e a raccogliere
              informazioni statistiche o pubblicitarie.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              2. Cookie utilizzati da {SITE.name}
            </h2>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>Cookie tecnici</strong>: indispensabili per il funzionamento
                del sito (es. salvataggio locale delle preferenze degli strumenti).
              </li>
              <li>
                <strong>Cookie di analisi</strong>: statistiche aggregate sulle
                visite.
              </li>
              <li>
                <strong>Cookie pubblicitari</strong>: se il sito mostra annunci
                Google AdSense, Google e i suoi partner possono utilizzare cookie
                per mostrare annunci pertinenti. Puoi gestire queste preferenze su{" "}
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
              3. Come gestire i cookie
            </h2>
            <p>
              Puoi disabilitare o eliminare i cookie dalle impostazioni del tuo
              browser (Chrome, Firefox, Safari, Edge, ecc.). La disattivazione dei
              cookie tecnici può compromettere alcune funzionalità del sito.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              4. Contatti
            </h2>
            <p>
              Per qualsiasi domanda sui cookie puoi scrivere a {SITE.email}.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
