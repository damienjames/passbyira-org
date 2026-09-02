"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const slides = [
  "Opening",
  "Recommendation",
  "Three-version comparison",
  "Brand continuity",
  "Audience",
  "Research",
  "Giving and trust content",
  "Participation and care content",
  "CMS workflow",
  "Technical handover",
  "Team alignment",
] as const;

function SlideNumber({ current }: { current: number }) {
  return (
    <span className="pb-team-slide__number" aria-label={`Slide ${current} of ${slides.length}`}>
      {String(current).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
    </span>
  );
}

function SourceLinks({ children }: { children: React.ReactNode }) {
  return <p className="pb-team-sources">Sources: {children}</p>;
}

export default function TeamBriefDeck() {
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (["ArrowRight", "ArrowDown", "PageDown", " "].includes(event.key)) {
        event.preventDefault();
        setActiveSlide((current) => Math.min(slides.length - 1, current + 1));
      }
      if (["ArrowLeft", "ArrowUp", "PageUp"].includes(event.key)) {
        event.preventDefault();
        setActiveSlide((current) => Math.max(0, current - 1));
      }
      if (event.key === "Home") setActiveSlide(0);
      if (event.key === "End") setActiveSlide(slides.length - 1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="pb-team-deck" aria-label="Pass by Ira website redesign team presentation">
      <div className="pb-team-deck__toolbar">
        <nav className="pb-team-deck__links" aria-label="Internal project resources">
          <Link href="/handover">Handover home</Link>
        </nav>
        <span aria-live="polite">{slides[activeSlide]}</span>
        <div className="pb-team-deck__controls">
          <button
            type="button"
            onClick={() => setActiveSlide((current) => Math.max(0, current - 1))}
            disabled={activeSlide === 0}
            aria-label="Previous slide"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => setActiveSlide((current) => Math.min(slides.length - 1, current + 1))}
            disabled={activeSlide === slides.length - 1}
            aria-label="Next slide"
          >
            →
          </button>
        </div>
      </div>

      <div className="pb-team-deck__stage">
        <section className="pb-team-slide pb-team-slide--opening" data-active={activeSlide === 0}>
          <div className="pb-team-slide__topline">
            <span>Pass by Ira</span>
            <span>Website redesign team brief</span>
          </div>
          <div className="pb-team-opening__grid">
            <div>
              <p className="pb-team-eyebrow">September 2026</p>
              <h1>Preserve recognition. Make action easier.</h1>
              <p>
                The case for the current redesign—and the evidence, stories, and service details
                needed before launch.
              </p>
            </div>
            <div className="pb-team-opening__mark">
              <Image src="/images/logo.webp" alt="Pass by Ira" width={504} height={364} priority />
            </div>
          </div>
          <SlideNumber current={1} />
        </section>

        <section className="pb-team-slide pb-team-slide--dark" data-active={activeSlide === 1}>
          <div className="pb-team-slide__topline">
            <span>Recommendation</span>
            <span>Design direction</span>
          </div>
          <div className="pb-team-ratio">
            <div className="pb-team-ratio__number">80</div>
            <div className="pb-team-ratio__copy">
              <p>Stay the course</p>
              <h2>The current visual system and information architecture provide a strong foundation.</h2>
            </div>
            <div className="pb-team-ratio__number pb-team-ratio__number--accent">20</div>
            <div className="pb-team-ratio__copy">
              <p>Strengthen the substance</p>
              <h2>Add evidence, specificity, transparency, and service navigation.</h2>
            </div>
          </div>
          <p className="pb-team-ratio__bottom">
            The next phase should strengthen content and credibility, not restart the visual design.
          </p>
          <SlideNumber current={2} />
        </section>

        <section className="pb-team-slide" data-active={activeSlide === 2}>
          <div className="pb-team-slide__topline">
            <span>What changed</span>
            <span>Three versions, one lesson</span>
          </div>
          <h2 className="pb-team-title">The current version carries forward the strongest qualities of both predecessors.</h2>
          <div className="pb-team-comparison">
            <figure>
              <Image
                src="/images/internal/team-brief/original-home.png"
                alt="Original Pass by Ira homepage"
                width={1440}
                height={900}
                loading="eager"
              />
              <figcaption>
                <span>Original</span>
                <strong>A recognizable foundation with usability limits.</strong>
                <small>Authentic identity; clearer hierarchy, evidence, and mobile behavior were needed.</small>
              </figcaption>
            </figure>
            <figure>
              <Image
                src="/images/internal/team-brief/azure-home.png"
                alt="First Azure redesign homepage"
                width={1440}
                height={900}
                loading="eager"
              />
              <figcaption>
                <span>Azure revamp</span>
                <strong>More program detail, with less visual focus.</strong>
                <small>Stronger substance; dense presentation, formal tone, and competing actions.</small>
              </figcaption>
            </figure>
            <figure>
              <Image
                src="/images/internal/team-brief/local-home.png"
                alt="Current Pass by Ira homepage redesign"
                width={1440}
                height={900}
                loading="eager"
              />
              <figcaption>
                <span>Current redesign</span>
                <strong>Clear, human, and supporter-focused.</strong>
                <small>Strong hierarchy and mobile experience; verified evidence is the next priority.</small>
              </figcaption>
            </figure>
          </div>
          <SlideNumber current={3} />
        </section>

        <section className="pb-team-slide pb-team-slide--sand" data-active={activeSlide === 3}>
          <div className="pb-team-slide__topline">
            <span>Brand continuity</span>
            <span>What remains familiar</span>
          </div>
          <div className="pb-team-split">
            <div>
              <h2 className="pb-team-title">The redesign feels current while remaining consistent with existing materials.</h2>
              <ul className="pb-team-large-list">
                <li><span>01</span>The official logo remains a primary brand asset.</li>
                <li><span>02</span>The warm ivory, taupe, charcoal, and skyline visual language remains recognizable.</li>
                <li><span>03</span>Ira’s story still anchors the organization’s purpose.</li>
                <li><span>04</span>Dallas–Fort Worth remains visually and verbally explicit.</li>
              </ul>
            </div>
            <div className="pb-team-split__image">
              <Image
                src="/images/internal/team-brief/local-home.png"
                alt="Current homepage showing the preserved Pass by Ira palette and logo"
                width={1440}
                height={900}
                loading="eager"
              />
            </div>
          </div>
          <SlideNumber current={4} />
        </section>

        <section className="pb-team-slide" data-active={activeSlide === 4}>
          <div className="pb-team-slide__topline">
            <span>Audience</span>
            <span>Who the site serves</span>
          </div>
          <h2 className="pb-team-title">The redesign serves first-time donors well; other audience paths need more support.</h2>
          <div className="pb-team-audience">
            <div className="pb-team-audience__primary">
              <span>Primary</span>
              <h3>Individual donors</h3>
              <p>The story, visual identity, sense of urgency, and donation path are clear.</p>
            </div>
            <div>
              <span>Secondary</span>
              <h3>Volunteers</h3>
              <p>The invitation is clear, but roles, schedules, and expectations are still abstract.</p>
            </div>
            <div>
              <span>Needs more support</span>
              <h3>Evidence-seeking supporters</h3>
              <p>Grantmakers, partners, and repeat donors need current impact and transparency.</p>
            </div>
            <div>
              <span>Path to add</span>
              <h3>People seeking help</h3>
              <p>Visitors need a direct statement of scope and accurate DFW referral resources.</p>
            </div>
          </div>
          <p className="pb-team-callout">
            The audience strategy is sound. The remaining content should clarify each visitor&apos;s next step.
          </p>
          <SlideNumber current={5} />
        </section>

        <section className="pb-team-slide pb-team-slide--dark" data-active={activeSlide === 5}>
          <div className="pb-team-slide__topline">
            <span>Research</span>
            <span>Patterns across effective nonprofit sites</span>
          </div>
          <div className="pb-team-evidence">
            <div className="pb-team-evidence__stat">
              <strong>53%</strong>
              <span>of nonprofit website visits came from mobile devices.</span>
            </div>
            <div className="pb-team-evidence__stat">
              <strong>31%</strong>
              <span>of online nonprofit revenue came from monthly giving.</span>
            </div>
            <div className="pb-team-evidence__peer">
              <h2>DFW peer organizations answer practical questions before asking for commitment.</h2>
              <ul>
                <li>Current organizational impact—not only regional need</li>
                <li>Specific volunteer roles, schedules, and group options</li>
                <li>Prominent “Find Help” or resource navigation</li>
                <li>Annual reports, tax filings, partners, and governance</li>
              </ul>
            </div>
          </div>
          <SourceLinks>
            <a href="https://2025.mrbenchmarks.com/website-performance.html">M+R Benchmarks 2025</a>,{` `}
            <a href="https://www.ourcalling.org/">OurCalling</a>,{` `}
            <a href="https://austinstreet.org/">Austin Street Center</a>,{` `}
            <a href="https://housingforwardntx.org/">Housing Forward</a>
          </SourceLinks>
          <SlideNumber current={6} />
        </section>

        <section className="pb-team-slide" data-active={activeSlide === 6}>
          <div className="pb-team-slide__topline">
            <span>Content priorities</span>
            <span>Giving and trust</span>
          </div>
          <h2 className="pb-team-title">Four content blocks turn interest into confidence.</h2>
          <div className="pb-team-priorities">
            <article>
              <span>01</span>
              <h3>Annual impact</h3>
              <p>Verified results from Pass by Ira, with the reporting period and source.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Current outcome story</h3>
              <p>A current story, shared with informed consent, that reflects dignity and individual agency.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Case for support</h3>
              <p>What unrestricted support enables, plus honest cost examples and monthly giving.</p>
            </article>
            <article>
              <span>04</span>
              <h3>Transparency</h3>
              <p>Board, EIN, annual report, filing status, policies, and approved governance material.</p>
            </article>
          </div>
          <p className="pb-team-callout">These are launch-critical because they answer: “Why should I trust this organization with my gift?”</p>
          <SourceLinks>
            <a href="https://candid.org/about/financials/">Candid financial transparency example</a>
          </SourceLinks>
          <SlideNumber current={7} />
        </section>

        <section className="pb-team-slide pb-team-slide--sand" data-active={activeSlide === 7}>
          <div className="pb-team-slide__topline">
            <span>Content priorities</span>
            <span>Participation and care</span>
          </div>
          <h2 className="pb-team-title">Four more blocks make action easier and expectations clearer.</h2>
          <div className="pb-team-priorities pb-team-priorities--lines">
            <article>
              <span>05</span>
              <h3>Volunteer specifics</h3>
              <p>Active roles, dates, locations, commitments, requirements, and group opportunities.</p>
            </article>
            <article>
              <span>06</span>
              <h3>Help and referral pathway</h3>
              <p>What Pass by Ira can provide, what it cannot, and where to seek immediate DFW help.</p>
            </article>
            <article>
              <span>07</span>
              <h3>Partners</h3>
              <p>Approved relationships that clarify the organization’s role in the broader response system.</p>
            </article>
            <article>
              <span>08</span>
              <h3>Current needs</h3>
              <p>A dated priority list with item condition, delivery instructions, and an assigned updater.</p>
            </article>
          </div>
          <SourceLinks>
            <a href="https://www.thehumanimpact.org/">The Human Impact</a>,{` `}
            <a href="https://austinstreet.org/volunteer/">Austin Street volunteer model</a>,{` `}
            <a href="https://www.ourcalling.org/findhelp/">OurCalling Find Help</a>
          </SourceLinks>
          <SlideNumber current={8} />
        </section>

        <section className="pb-team-slide" data-active={activeSlide === 8}>
          <div className="pb-team-slide__topline">
            <span>CMS workflow</span>
            <span>How priority content becomes publishable</span>
          </div>
          <div className="pb-team-workflow">
            <div className="pb-team-workflow__image">
              <Image
                src="/images/internal/team-brief/content-readiness.png"
                alt="Content readiness workspace"
                width={1440}
                height={900}
                loading="eager"
              />
            </div>
            <div>
              <h2 className="pb-team-title">The new workspace makes every gap actionable.</h2>
              <ol>
                <li><span>01</span><strong>Populate</strong><small>The content owner supplies the required inputs.</small></li>
                <li><span>02</span><strong>Verify</strong><small>Numbers, links, consent, and scope are checked.</small></li>
                <li><span>03</span><strong>Approve</strong><small>Leadership or the board clears public wording.</small></li>
                <li><span>04</span><strong>Publish</strong><small>Publishing is enabled only after approval.</small></li>
              </ol>
              <Link href="/content-readiness" className="pb-team-inline-link">
                Open the content readiness workspace →
              </Link>
            </div>
          </div>
          <SlideNumber current={9} />
        </section>

        <section className="pb-team-slide pb-team-slide--dark" data-active={activeSlide === 9}>
          <div className="pb-team-slide__topline">
            <span>Technical handover</span>
            <span>Application → operational ownership</span>
          </div>
          <div className="pb-team-handover-slide">
            <div>
              <p className="pb-team-eyebrow">Transition status</p>
              <h2>The application and Azure are ready. Ownership transfer comes next.</h2>
              <p>
                The runbook records production resources, ownership decisions, acceptance tests,
                and domain cutover as the transition is completed.
              </p>
              <Link href="/team-handover" className="pb-team-inline-link pb-team-inline-link--light">
                Open the Azure handover runbook →
              </Link>
            </div>
            <ol>
              <li><span>Prepared</span><strong>Application, content, CMS, Functions, and workflow</strong></li>
              <li><span>Provisioned</span><strong>Static Web App, storage, secrets, and campaign publishing</strong></li>
              <li><span>Complete next</span><strong>CMS onboarding, domain cutover, billing, and access ownership</strong></li>
            </ol>
          </div>
          <SlideNumber current={10} />
        </section>

        <section className="pb-team-slide pb-team-slide--closing" data-active={activeSlide === 10}>
          <div className="pb-team-slide__topline">
            <span>Team alignment</span>
            <span>What happens next</span>
          </div>
          <div className="pb-team-closing">
            <div>
              <p className="pb-team-eyebrow">Recommended decision</p>
              <h2>Approve the direction. Assign the evidence.</h2>
            </div>
            <div className="pb-team-closing__asks">
              <p><span>01</span>Confirm the current visual and information-architecture direction.</p>
              <p><span>02</span>Assign one accountable owner to each of the eight content blocks.</p>
              <p><span>03</span>Supply verified metrics, documents, operating details, and stories with documented consent.</p>
              <p><span>04</span>Publish each block only after its verification gate is complete.</p>
            </div>
          </div>
          <blockquote>Modernization earns attention. Evidence earns trust.</blockquote>
          <SlideNumber current={11} />
        </section>
      </div>

      <div className="pb-team-deck__progress" aria-hidden="true">
        <span style={{ width: `${((activeSlide + 1) / slides.length) * 100}%` }} />
      </div>
    </div>
  );
}
