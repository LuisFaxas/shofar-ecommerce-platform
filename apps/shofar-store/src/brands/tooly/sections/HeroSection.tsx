"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { HeroContent } from "../lib/storefront-content";

/* -------------------------------------------------------------------------- */
/* Cinemascroll config                                                        */
/* -------------------------------------------------------------------------- */

const FRAME_PATH = "/hero/cinemascroll/cheetahs-monolith/frame-{n}.jpg";
const FRAME_COUNT = 128;
const PINNED_SVH = 240;
const FILM_END = 0.65;
const MIN_PRELOAD = 24;
const TRICKLE_BATCH = 8;
const TRICKLE_DELAY_MS = 60;

const SERIF = "var(--font-cormorant), Georgia, serif";

/* -------------------------------------------------------------------------- */
/* Choreography                                                                */
/*                                                                            */
/* Narrative copy flanks the monolith (alternating left / right). The CTA     */
/* materialises out of the light beam at the end of the film (115 → 128) and  */
/* holds during the end-pause. Everything is scroll-driven — no time-based    */
/* animations.                                                                */
/* -------------------------------------------------------------------------- */

type Side = "left" | "right";

interface Beat {
  range: [number, number]; // scroll progress 0..1
  side: Side;
  lines: string[]; // 1–3 short lines (mobile-narrow flank)
}

// 3 beats, alternating R → L → R. ALL narrative ends at frame 88
// (scroll ≈ 44.5%). Frames 88 → 115 are silent cinematic — beam rising —
// then the CTA emerges from the light at frame 115 → 128.
//   B1: frames  1 → 31  (scroll  0% → 16%)  — wide savanna establish
//   B2: frames 31 → 60  (scroll 16% → 31%)  — cheetahs at the monolith
//   B3: frames 60 → 88  (scroll 31% → 45%)  — light igniting
// Each beat is exactly 3 short lines so it never wraps into 4. Final line of
// each beat renders italic (set in the JSX) to act as the punch-out.
// Narrative chain: bow → instinct → precision → now-it-rises-again.
const BEATS: Beat[] = [
  {
    range: [0.0, 0.16],
    side: "right",
    lines: ["Before", "precision,", "instinct."],
  },
  { range: [0.16, 0.31], side: "left", lines: ["Even", "the apex", "kneels."] },
  { range: [0.31, 0.45], side: "right", lines: ["Now,", "it rises", "again."] },
];

const CTA_START = 0.57;
const CTA_END = 0.65;

// Stagger windows (sub-ranges of CTA_START..CTA_END) for each CTA element.
const CTA_STAGGER = {
  wordmark: [0.57, 0.605] as [number, number],
  tagline: [0.595, 0.63] as [number, number],
  primary: [0.615, 0.65] as [number, number],
  secondary: [0.628, 0.66] as [number, number],
};

const CTA = {
  wordmark: "TOOLY",
  tagline: "The instrument they bow to.",
  primary: { label: "Claim yours", targetId: "product-buy" },
  secondary: { label: "See the origin", targetId: "technology" },
};

/* -------------------------------------------------------------------------- */
/* Math helpers                                                               */
/* -------------------------------------------------------------------------- */

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

// Cubic ease-out — settles cinematically rather than springing.
function easeOutCubic(t: number): number {
  const inv = 1 - t;
  return 1 - inv * inv * inv;
}

function frameUrl(i: number): string {
  const n = String(i + 1).padStart(3, "0");
  return FRAME_PATH.replace("{n}", n);
}

/** Window-based reveal: 0 before `start`, eased 0→1 across [start, end], 1 after. */
function revealAt(progress: number, [start, end]: [number, number]): number {
  if (progress <= start) return 0;
  if (progress >= end) return 1;
  return easeOutCubic((progress - start) / (end - start));
}

/** Trapezoidal envelope for narrative beats with eased ramps. */
function beatOpacity(
  progress: number,
  [start, end]: [number, number],
  isFirst: boolean,
): number {
  if (progress < start || progress > end) return 0;
  const len = end - start;
  const local = (progress - start) / len;
  const rampIn = 0.22;
  const rampOut = 0.28;
  if (!isFirst && local < rampIn) return easeOutCubic(local / rampIn);
  if (local > 1 - rampOut) return easeOutCubic((1 - local) / rampOut);
  return 1;
}

/* -------------------------------------------------------------------------- */
/* Props                                                                      */
/* -------------------------------------------------------------------------- */

interface ProductAsset {
  id: string;
  preview: string;
  source: string;
}

interface HeroSectionProps {
  className?: string;
  heroImage?: string | null;
  heroImageMobile?: string | null;
  featuredAsset?: ProductAsset | null;
  productName?: string;
  content?: HeroContent;
}

/* -------------------------------------------------------------------------- */
/* Component                                                                  */
/* -------------------------------------------------------------------------- */

export function HeroSection({
  className,
  productName = "TOOLY",
}: HeroSectionProps): React.ReactElement {
  const pinnedRef = React.useRef<HTMLElement | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

  const imagesRef = React.useRef<(HTMLImageElement | undefined)[]>([]);
  const loadedCountRef = React.useRef(0);
  const lastDrawnRef = React.useRef(-1);
  const dimsRef = React.useRef({ w: 0, h: 0 });
  const rafRef = React.useRef(0);
  const visibleRef = React.useRef(true);

  const [progress, setProgress] = React.useState(0);
  const [canvasReady, setCanvasReady] = React.useState(false);
  const [prefersReducedMotion, setPRM] = React.useState(false);

  /* prefers-reduced-motion ----------------------------------------------- */
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPRM(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPRM(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  /* Frame preload -------------------------------------------------------- */
  React.useEffect(() => {
    if (prefersReducedMotion) return;
    imagesRef.current = new Array(FRAME_COUNT);
    loadedCountRef.current = 0;
    lastDrawnRef.current = -1;
    setCanvasReady(false);

    let cancelled = false;
    const loadOne = (i: number) => {
      if (cancelled) return;
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        imagesRef.current[i] = img;
        loadedCountRef.current += 1;
        if (loadedCountRef.current === MIN_PRELOAD) setCanvasReady(true);
      };
      img.src = frameUrl(i);
    };

    const prio = Math.min(MIN_PRELOAD, FRAME_COUNT);
    for (let i = 0; i < prio; i++) loadOne(i);

    let idx = prio;
    let timer: number | undefined;
    const trickle = () => {
      if (cancelled) return;
      const end = Math.min(idx + TRICKLE_BATCH, FRAME_COUNT);
      for (let j = idx; j < end; j++) loadOne(j);
      idx = end;
      if (idx < FRAME_COUNT)
        timer = window.setTimeout(trickle, TRICKLE_DELAY_MS);
    };
    if (idx < FRAME_COUNT) timer = window.setTimeout(trickle, 80);

    return () => {
      cancelled = true;
      if (timer) window.clearTimeout(timer);
    };
  }, [prefersReducedMotion]);

  /* Canvas size ---------------------------------------------------------- */
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width * dpr));
      const h = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        dimsRef.current = { w, h };
        lastDrawnRef.current = -1;
      }
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });
    return () => window.removeEventListener("resize", resize);
  }, []);

  /* Pause RAF when hero offscreen --------------------------------------- */
  React.useEffect(() => {
    const section = pinnedRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      (entries) => {
        visibleRef.current = entries[0]?.isIntersecting ?? false;
      },
      { rootMargin: "0px" },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  /* Scroll + canvas scrub ------------------------------------------------ */
  React.useEffect(() => {
    if (prefersReducedMotion) return;
    const canvas = canvasRef.current;
    const section = pinnedRef.current;
    if (!canvas || !section) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let lastProgress = -1;

    const computeProgress = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const distance = section.offsetHeight - vh;
      if (distance <= 0) return 0;
      return clamp(-rect.top / distance, 0, 1);
    };

    const draw = (p: number) => {
      if (!canvasReady) return;
      const max = FRAME_COUNT - 1;
      const filmP = p < FILM_END ? p / FILM_END : 1;
      const i = clamp(Math.round(filmP * max), 0, max);
      let img = imagesRef.current[i];
      if (!img) {
        let nearest = -1;
        for (let k = 0; k < imagesRef.current.length; k++) {
          if (
            imagesRef.current[k] &&
            (nearest === -1 || Math.abs(k - i) < Math.abs(nearest - i))
          ) {
            nearest = k;
          }
        }
        if (nearest === -1) return;
        img = imagesRef.current[nearest];
      }
      if (!img) return;
      if (i === lastDrawnRef.current) return;
      lastDrawnRef.current = i;
      const { w, h } = dimsRef.current;
      if (!w || !h) return;
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      const scale = Math.max(w / iw, h / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, iw, ih, (w - dw) * 0.5, (h - dh) * 0.5, dw, dh);
    };

    const tick = () => {
      if (visibleRef.current) {
        const p = computeProgress();
        if (p !== lastProgress) {
          lastProgress = p;
          setProgress(p);
          draw(p);
        }
      }
      rafRef.current = window.requestAnimationFrame(tick);
    };
    rafRef.current = window.requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
    };
  }, [canvasReady, prefersReducedMotion]);

  /* CTA element reveals -------------------------------------------------- */
  const tWordmark = revealAt(progress, CTA_STAGGER.wordmark);
  const tTagline = revealAt(progress, CTA_STAGGER.tagline);
  const tPrimary = revealAt(progress, CTA_STAGGER.primary);
  const tSecondary = revealAt(progress, CTA_STAGGER.secondary);
  // Overall CTA presence — fades out the narrative beats as it appears.
  const ctaPresence = revealAt(progress, [CTA_START, CTA_END]);

  const handleScrollTo = (id?: string) => {
    if (!id) return;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const sectionStyle: React.CSSProperties = prefersReducedMotion
    ? { minHeight: "100svh" }
    : { minHeight: `${PINNED_SVH}svh` };

  return (
    <section
      id="hero"
      ref={pinnedRef}
      className={cn("relative", className)}
      aria-labelledby="hero-heading"
      style={sectionStyle}
    >
      <h1 id="hero-heading" className="sr-only">
        {productName} — {CTA.tagline}
      </h1>

      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#0b0e14]">
        {/* ===== Cinematic canvas + poster ===== */}
        {!prefersReducedMotion && (
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-300",
              canvasReady ? "opacity-100" : "opacity-0",
            )}
          />
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={frameUrl(0)}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover",
            !prefersReducedMotion && canvasReady && "opacity-0",
            "transition-opacity duration-300",
          )}
          fetchPriority="high"
          decoding="async"
        />

        {/* Top scrim — keeps copy + navbar legible against bright sky */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[26svh] bg-gradient-to-b from-[#0b0e14]/55 via-[#0b0e14]/15 to-transparent pointer-events-none"
        />

        {/* Bottom hand-off — fades into next section's #0d1218 */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[55svh] pointer-events-none"
          style={{
            background:
              "linear-gradient(to bottom, rgba(13,18,24,0) 0%, rgba(13,18,24,0.15) 20%, rgba(13,18,24,0.45) 45%, rgba(13,18,24,0.80) 70%, rgba(13,18,24,0.96) 88%, #0d1218 100%)",
          }}
        />

        {/* ===========================================================
            Narrative beats — alternating flank around the monolith
            =========================================================== */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden={ctaPresence >= 0.5}
          style={{ opacity: 1 - ctaPresence * 0.95 }}
        >
          {BEATS.map((beat, i) => {
            const op = beatOpacity(progress, beat.range, i === 0);
            // "From center out" motion: each beat starts near the monolith
            // and travels outward toward the page border as it appears.
            //   left flank  → slides right→left  (starts at +X, settles at 0)
            //   right flank → slides left→right  (starts at −X, settles at 0)
            const slideFrom = beat.side === "left" ? 18 : -18;
            const tx = (1 - op) * slideFrom;
            return (
              <div
                key={i}
                className={cn(
                  "absolute top-[24svh]",
                  // "From center out": text anchors at the INNER edge (next to
                  // the monolith) and extends outward toward the page border.
                  //   left flank  → text-right  (anchored to right/inner edge)
                  //   right flank → text-left   (anchored to left/inner edge)
                  beat.side === "left" ? "text-right" : "text-left",
                )}
                style={{
                  // Hard 130px gap centred on the viewport so the TOOLY stick
                  // is never clipped, regardless of viewport width.
                  //   left flank  : from 16px → (centre − 65px)
                  //   right flank : from (centre + 65px) → right-16px
                  ...(beat.side === "left"
                    ? { left: 16, right: "calc(50% + 65px)" }
                    : { left: "calc(50% + 65px)", right: 16 }),
                  opacity: op,
                  transform: `translateX(${tx}px)`,
                  willChange: "transform, opacity",
                }}
              >
                {beat.lines.map((line, li) => {
                  // Sub-stagger lines within the beat: each line trails the
                  // previous by ~0.06 of the beat's local progress.
                  const len = beat.range[1] - beat.range[0];
                  const local = clamp((progress - beat.range[0]) / len, 0, 1);
                  const lineStart = li * 0.06;
                  const lineEnd = lineStart + 0.18;
                  const lineT = clamp(
                    (local - lineStart) / (lineEnd - lineStart),
                    0,
                    1,
                  );
                  const lineEased = easeOutCubic(lineT);
                  return (
                    <span
                      key={li}
                      className="block whitespace-nowrap"
                      style={{
                        fontFamily: SERIF,
                        fontWeight: 500,
                        fontStyle:
                          li === beat.lines.length - 1 ? "italic" : "normal",
                        // Tightened so even the longest line ("precision,")
                        // fits a 134px flank without wrapping.
                        fontSize: "clamp(1.2rem, 6vw, 1.7rem)",
                        lineHeight: 1.1,
                        letterSpacing: "0.005em",
                        color: "rgba(246,241,224,0.96)",
                        marginTop: li === 0 ? 0 : "0.1em",
                        textShadow:
                          "0 1px 18px rgba(0,0,0,0.6), 0 0 36px rgba(0,0,0,0.35)",
                        opacity: lineEased,
                        transform: `translateY(${(1 - lineEased) * 8}px)`,
                        transition: "transform 220ms linear",
                        display: "block",
                      }}
                    >
                      {line}
                    </span>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* ===========================================================
            CTA — emerges from the light beam (115 → 128, hold after)
            =========================================================== */}
        <div
          className="absolute inset-x-0 z-10 px-6"
          style={{
            top: "22svh",
            opacity: ctaPresence,
            // Whole block rises softly as it appears.
            transform: `translateY(${lerp(60, 0, ctaPresence)}px)`,
            pointerEvents: ctaPresence > 0.6 ? "auto" : "none",
            willChange: "opacity, transform",
          }}
        >
          <div className="max-w-md mx-auto text-center">
            {/* Wordmark — letter-by-letter reveal */}
            <WordmarkReveal text={CTA.wordmark} t={tWordmark} />

            {/* Tagline — one line, italic serif */}
            <p
              className="mt-3 whitespace-nowrap"
              style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                fontWeight: 500,
                fontSize: "clamp(0.95rem, 4.4vw, 1.2rem)",
                lineHeight: 1.35,
                color: "rgba(246,241,224,0.85)",
                textShadow:
                  "0 0 18px rgba(255,226,165,0.18), 0 1px 14px rgba(0,0,0,0.6)",
                opacity: tTagline,
                transform: `translateY(${lerp(14, 0, tTagline)}px)`,
                willChange: "opacity, transform",
              }}
            >
              {CTA.tagline}
            </p>

            {/* Actions */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <PlaqueButton
                t={tPrimary}
                onClick={() => handleScrollTo(CTA.primary.targetId)}
                data-testid="cta-shop-now"
              >
                {CTA.primary.label}
              </PlaqueButton>
              <UnderlineLink
                t={tSecondary}
                onClick={() => handleScrollTo(CTA.secondary.targetId)}
              >
                {CTA.secondary.label}
              </UnderlineLink>
            </div>
          </div>
        </div>

        {/* Subtle right-edge progress rail */}
        {!prefersReducedMotion && (
          <div
            aria-hidden="true"
            className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 h-32 sm:h-44 w-px bg-white/12 rounded-full overflow-hidden"
          >
            <div
              className="absolute inset-x-0 top-0 bg-white/80 rounded-full"
              style={{ height: `${progress * 100}%` }}
            />
          </div>
        )}
      </div>

      {/* Dev-only HUD */}
      {process.env.NODE_ENV !== "production" && (
        <HeroHud progress={progress} ctaPresence={ctaPresence} />
      )}
    </section>
  );
}

HeroSection.displayName = "HeroSection";

/* -------------------------------------------------------------------------- */
/* WordmarkReveal — letter-by-letter cinematic appearance                     */
/* -------------------------------------------------------------------------- */

function WordmarkReveal({
  text,
  t,
}: {
  text: string;
  t: number;
}): React.ReactElement {
  const chars = text.split("");
  // Each character occupies a sub-window of t. They stagger smoothly across [0, 1].
  return (
    <div
      className="select-none"
      style={{
        fontFamily: SERIF,
        fontWeight: 600,
        fontSize: "clamp(3.2rem, 16vw, 4.5rem)",
        letterSpacing: "0.04em",
        lineHeight: 0.95,
        color: "#f6f1e0",
        textShadow:
          "0 0 22px rgba(255,226,165,0.35), 0 0 60px rgba(255,226,165,0.18), 0 2px 18px rgba(0,0,0,0.5)",
      }}
    >
      {chars.map((ch, i) => {
        const start = i / (chars.length + 1);
        const end = start + 1.6 / (chars.length + 1);
        const lt = clamp((t - start) / (end - start), 0, 1);
        const eased = easeOutCubic(lt);
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: eased,
              transform: `translateY(${lerp(22, 0, eased)}px) scale(${lerp(0.92, 1, eased)})`,
              filter: `blur(${lerp(6, 0, eased)}px)`,
              willChange: "transform, opacity, filter",
            }}
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PlaqueButton — B.2: hairline plaque with brass corner brackets             */
/* -------------------------------------------------------------------------- */

interface PlaqueButtonProps {
  t: number; // 0..1 reveal progress
  onClick?: () => void;
  children: React.ReactNode;
  "data-testid"?: string;
}

function PlaqueButton({
  t,
  onClick,
  children,
  ...rest
}: PlaqueButtonProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={rest["data-testid"]}
      className={cn(
        "relative inline-flex items-center justify-center",
        // Button hugs the label: no min-width, tighter padding, larger text.
        // With 32px italic serif label, box is ~232×56 → text fills ~57% of
        // button height (vs 17% in the original, 45% in the prior pass).
        "px-[22px] py-3",
        "bg-transparent hover:bg-[rgba(255,226,165,0.92)]",
        "border border-[rgba(255,226,165,0.6)] hover:border-[rgba(255,226,165,0.95)]",
        "text-[#fff5d6] hover:text-[#1a1207]",
        "transition-colors duration-200 ease-out",
        "cursor-pointer",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/70",
      )}
      style={{
        fontFamily: SERIF,
        fontStyle: "italic",
        fontWeight: 500,
        fontSize: "clamp(1.7rem, 7.5vw, 2.1rem)",
        letterSpacing: "0.015em",
        lineHeight: 1,
        boxShadow:
          "0 0 0 1px rgba(255,226,165,0) inset, 0 0 30px rgba(255, 226, 165, 0.18)",
        opacity: t,
        transform: `translateY(${lerp(20, 0, t)}px) scale(${lerp(0.96, 1, t)})`,
        willChange: "transform, opacity",
      }}
    >
      <span className="relative z-10">{children}</span>

      {/* Brass corner brackets — top-left + bottom-right. Sized down
          (12px) to stay proportional with the tighter button. */}
      <span
        aria-hidden="true"
        className="absolute -top-px -left-px w-3 h-3 pointer-events-none z-10"
        style={{
          borderTop: "2px solid rgba(255,226,165,0.95)",
          borderLeft: "2px solid rgba(255,226,165,0.95)",
        }}
      />
      <span
        aria-hidden="true"
        className="absolute -bottom-px -right-px w-3 h-3 pointer-events-none z-10"
        style={{
          borderBottom: "2px solid rgba(255,226,165,0.95)",
          borderRight: "2px solid rgba(255,226,165,0.95)",
        }}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* UnderlineLink — secondary CTA with growing underline                       */
/* -------------------------------------------------------------------------- */

function UnderlineLink({
  t,
  onClick,
  children,
}: {
  t: number;
  onClick?: () => void;
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative inline-block select-none",
        "text-[rgba(246,241,224,0.88)] hover:text-[rgba(255,255,255,1)]",
        "transition-colors duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-sm",
      )}
      style={{
        fontFamily: "var(--font-inter), system-ui, sans-serif",
        fontSize: "0.95rem",
        fontWeight: 500,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        background: "transparent",
        border: 0,
        padding: "10px 4px 12px",
        cursor: "pointer",
        opacity: t,
        transform: `translateY(${lerp(14, 0, t)}px)`,
        willChange: "transform, opacity",
        textShadow: "0 1px 14px rgba(0,0,0,0.55)",
      }}
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={cn(
          "absolute left-1/2 -translate-x-1/2 bottom-1",
          "transition-all duration-300 ease-out",
          "w-[36px] bg-[rgba(246,241,224,0.7)]",
          "group-hover:w-full group-hover:bg-[rgba(255,255,255,1)]",
        )}
        style={{ height: 1.5 }}
      />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* Dev-only HUD                                                               */
/* -------------------------------------------------------------------------- */

function HeroHud({
  progress,
  ctaPresence,
}: {
  progress: number;
  ctaPresence: number;
}): React.ReactElement {
  const filmP = progress < FILM_END ? progress / FILM_END : 1;
  const frameIdx = clamp(
    Math.round(filmP * (FRAME_COUNT - 1)),
    0,
    FRAME_COUNT - 1,
  );
  const frameNum = frameIdx + 1;
  const phase = progress < FILM_END ? "film" : "hold";
  const activeBeat = BEATS.findIndex(
    (b) => progress >= b.range[0] && progress < b.range[1],
  );
  return (
    <div
      className="fixed bottom-3 left-3 z-[60] select-none font-mono text-[11px] leading-tight text-white bg-black/80 backdrop-blur-md border border-white/15 rounded-md px-2.5 py-1.5 shadow-lg pointer-events-none"
      aria-hidden="true"
    >
      <div>
        frame <span className="text-emerald-300">{frameNum}</span>
        <span className="text-white/45"> / {FRAME_COUNT}</span>
      </div>
      <div>
        scroll{" "}
        <span className="text-emerald-300">{(progress * 100).toFixed(1)}%</span>
      </div>
      <div>
        film{" "}
        <span className="text-emerald-300">{(filmP * 100).toFixed(1)}%</span>
      </div>
      <div>
        phase{" "}
        <span className={phase === "film" ? "text-cyan-300" : "text-amber-300"}>
          {phase}
        </span>
      </div>
      <div>
        beat{" "}
        <span className="text-cyan-300">
          {activeBeat >= 0
            ? `B${activeBeat + 1} (${BEATS[activeBeat].side})`
            : "—"}
        </span>
      </div>
      <div>
        cta{" "}
        <span className="text-amber-300">
          {(ctaPresence * 100).toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

export default HeroSection;
