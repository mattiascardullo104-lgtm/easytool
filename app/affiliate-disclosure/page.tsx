import Link from "next/link";

export default function AffiliateDisclosure() {
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
          Affiliate disclosure
        </h1>

        <div className="space-y-6 text-sm text-[var(--text-muted)] leading-relaxed">
          <p>
            EasyTools is a free site. To cover its running costs it may display
            advertisements and, in some cases, affiliate links.
          </p>
          <p>
            An <strong>affiliate link</strong> is a link that allows us to earn
            a commission if you buy a product or service after clicking on it,{" "}
            <strong>at no extra cost to you</strong>.
          </p>
          <p>
            The recommendations we publish are based on independent reviews.
            The presence of an affiliate link does not change the price you
            pay.
          </p>
          <p>
            The ads you see are managed by third parties (e.g. Google AdSense),
            which may show you ads based on your browsing activity. You can opt
            out of ad personalization at{" "}
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
