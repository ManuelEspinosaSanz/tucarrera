/**
 * Analytics event taxonomy for the individual-mode funnel (Hito 2) and the
 * competitive-mode funnel (Hito 4). Defined now so the UI is instrumented as it's
 * built, not patched afterward — see the "umbrales de decisión" in the roadmap,
 * which are measured against these exact events.
 *
 * track() is a no-op until NEXT_PUBLIC_POSTHOG_KEY is set (Hito 2), so this file
 * can be imported safely before analytics is actually wired up.
 */

export type AnalyticsEvent =
  | { name: "career_started"; props: { position: string; archetype: string } }
  | { name: "career_completed"; props: { finalScore: number; legacyTier: string; seasons: number } }
  | { name: "share_clicked"; props: { careerId: string } }
  | { name: "challenge_created"; props: { mode: string } }
  | { name: "challenge_accepted"; props: { challengeId: string } }
  | { name: "challenge_completed"; props: { challengeId: string; won: boolean } }
  | { name: "revenge_requested"; props: { challengeId: string } };

export function track(event: AnalyticsEvent): void {
  if (typeof window === "undefined" || !process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    return;
  }
  // Real PostHog client wiring lands in Hito 2, once there's a funnel to point it at.
  console.debug("[analytics]", event.name, event.props);
}
