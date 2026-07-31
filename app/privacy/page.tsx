import { SITE } from "@/lib/site";
import Link from "next/link";

export default function PrivacyPolicy() {
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
          Privacy Policy
        </h1>

        <div className="space-y-8 text-sm text-[var(--text-muted)] leading-relaxed">
          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              1. Data controller
            </h2>
            <p>
              The data controller of {SITE.name} can be reached at {SITE.email}.
              This site does not require registration and does not manage user
              accounts.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              2. Data processed
            </h2>
            <p>
              {SITE.name} is a set of tools that run entirely in the browser.
              The files you use (images, PDFs, texts) are{" "}
              <strong>never uploaded to any server</strong>: processing happens
              locally, on your device.
            </p>
            <p className="mt-3">
              The only data that may be collected is statistical and technical
              information provided by your browser (IP address, device type,
              pages visited), through the analytics and advertising services
              described in section 3.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              3. Third-party services
            </h2>
            <p>The site may use the following external services:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>Google AdSense</strong>: to display advertisements.
                Google may use cookies to personalize ads; for processing
                details see Google&apos;s{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--accent-steel)]"
                >
                  privacy policy
                </a>
                .
              </li>
              <li>
                <strong>Analytics services</strong>: for aggregated usage
                statistics.
              </li>
              <li>
                <strong>Ko-fi</strong>: for donations and the Premium
                subscription, processed by Ko-fi&apos;s own platform.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              4. Your rights
            </h2>
            <p>
              Under the GDPR (Reg. EU 2016/679) you have the right to request
              access, rectification, erasure of your data, restriction of
              processing and data portability, by writing to {SITE.email}. You
              also have the right to lodge a complaint with your local data
              protection authority.
            </p>
          </section>

          <section>
            <h2 className="font-display text-lg font-semibold text-[var(--text-primary)] mb-3">
              5. Changes
            </h2>
            <p>
              This policy may be updated; the version in force is always the
              one published on this page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
