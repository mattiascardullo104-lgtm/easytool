import Link from "next/link";

export default function AffiliateDisclosure() {
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
          Trasparenza affiliati
        </h1>

        <div className="space-y-6 text-sm text-[var(--text-muted)] leading-relaxed">
          <p>
            EasyTools è un sito gratuito. Per coprire i costi di gestione può
            mostrare annunci pubblicitari e, in alcuni casi, link affiliati.
          </p>
          <p>
            Un <strong>link affiliato</strong> è un link che ci consente di
            ricevere una commissione se acquisti un prodotto o servizio dopo aver
            cliccato su di esso, <strong>senza alcun costo aggiuntivo per te</strong>.
          </p>
          <p>
            Le raccomandazioni che pubblichiamo sono basate su valutazioni
            indipendenti. La presenza di un link affiliato non modifica il prezzo
            che paghi.
          </p>
          <p>
            La pubblicità che vedi è gestita da terze parti (es. Google AdSense),
            che potrebbero mostrarti annunci in base alla tua attività di
            navigazione. Puoi disattivare la personalizzazione degli annunci su{" "}
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--accent-steel)]"
            >
              adssettings.google.com
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
