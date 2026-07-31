import { SITE } from "@/lib/site";
import Link from "next/link";

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>

        <div className="space-y-8 text-sm text-[var(--text-muted)] leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              1. Titolare del trattamento
            </h2>
            <p>
              Il titolare del trattamento dei dati di {SITE.name} è raggiungibile
              all&apos;indirizzo email {SITE.email}. Il presente sito non richiede
              registrazione e non gestisce account utente.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              2. Dati trattati
            </h2>
            <p>
              {SITE.name} è un insieme di strumenti che funzionano interamente nel
              browser. I file (immagini, PDF, testi) che utilizzi <strong>non vengono
              caricati su alcun server</strong>: l&apos;elaborazione avviene in locale,
              sul tuo dispositivo.
            </p>
            <p className="mt-3">
              I soli dati che possono essere raccolti sono quelli statistici e
              tecnici forniti dal tuo browser (indirizzo IP, tipo di dispositivo,
              pagine visitate), tramite strumenti di analisi e servizi pubblicitari
              descritti al punto 3.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              3. Servizi di terze parti
            </h2>
            <p>Il sito può utilizzare i seguenti servizi esterni:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>Google AdSense</strong>: per mostrare annunci pubblicitari.
                Google può utilizzare cookie per personalizzare gli annunci; per le
                modalità di trattamento consulta la{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-steel)]"
                >
                  privacy policy di Google
                </a>
                .
              </li>
              <li>
                <strong>Servizi di analisi</strong>: per statistiche aggregate di
                utilizzo del sito.
              </li>
              <li>
                <strong>YouTube</strong>: per mostrare video tutorial tramite
                embedding.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              4. Diritti dell&apos;interessato
            </h2>
            <p>
              Ai sensi del GDPR (Reg. UE 2016/679) hai il diritto di chiedere al
              titolare l&apos;accesso, la rettifica, la cancellazione dei tuoi dati,
              la limitazione del trattamento e la portabilità dei dati, scrivendo
              all&apos;indirizzo {SITE.email}. Hai inoltre il diritto di proporre
              reclamo al Garante per la protezione dei dati personali.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              5. Modifiche
            </h2>
            <p>
              La presente informativa può essere aggiornata; la versione in vigore
              è sempre quella pubblicata su questa pagina.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
