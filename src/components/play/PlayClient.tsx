"use client";

import { useState } from "react";
import { track } from "@/lib/analytics/events";
import { encodeCareerShare } from "@/lib/sharing/encode";
import {
  playSeason,
  startCareerProgress,
  submitDecision,
  type CareerProgress,
} from "@/lib/simulation/interactive";
import { generateSeed } from "@/lib/simulation/seed";
import type { CareerResult, GameEvent, SeasonStats } from "@/lib/simulation/types";
import { DecisionCard } from "./DecisionCard";
import { FinalResultCard } from "./FinalResultCard";
import { PlayerSetupForm, type PlayerSetupValues } from "./PlayerSetupForm";
import { SeasonCard } from "./SeasonCard";

type Phase =
  // A season's stats are always shown first, even if that season also has an event
  // pending — otherwise a decision can appear before the player ever sees what
  // happened that season.
  | { type: "setup" }
  | { type: "stats"; progress: CareerProgress; stats: SeasonStats; event: GameEvent | null }
  | { type: "decision"; progress: CareerProgress; stats: SeasonStats; event: GameEvent }
  | { type: "result"; result: CareerResult; shareId: string };

export function PlayClient() {
  const [phase, setPhase] = useState<Phase>({ type: "setup" });
  const [copied, setCopied] = useState(false);

  function handleSetup(values: PlayerSetupValues) {
    track({
      name: "career_started",
      props: { position: values.posicion, archetype: values.arquetipo },
    });

    const progress = startCareerProgress({ seed: generateSeed(), ...values });
    const { progress: afterSeason, stats, event } = playSeason(progress);
    setPhase({ type: "stats", progress: afterSeason, stats, event });
  }

  function resolveSeason(
    progress: CareerProgress,
    stats: SeasonStats,
    event: GameEvent | null,
    choiceId: string | null
  ) {
    const next = submitDecision(progress, stats, event, choiceId);

    if (next.finished && next.result) {
      const shareId = encodeCareerShare({
        seed: next.options.seed,
        nombre: next.options.nombre,
        posicion: next.options.posicion,
        arquetipo: next.options.arquetipo,
        decisions: next.decisions,
      });
      track({
        name: "career_completed",
        props: {
          finalScore: next.result.puntuacionFinal,
          legacyTier: next.result.legado,
          seasons: next.result.resumen.temporadasJugadas,
        },
      });
      setPhase({ type: "result", result: next.result, shareId });
      return;
    }

    const played = playSeason(next);
    setPhase({ type: "stats", progress: played.progress, stats: played.stats, event: played.event });
  }

  if (phase.type === "setup") {
    return <PlayerSetupForm onSubmit={handleSetup} />;
  }

  if (phase.type === "stats") {
    const { progress, stats, event } = phase;
    return (
      <SeasonCard
        stats={stats}
        continueLabel={event ? "Ver decisión" : "Continuar"}
        onContinue={() =>
          event
            ? setPhase({ type: "decision", progress, stats, event })
            : resolveSeason(progress, stats, null, null)
        }
      />
    );
  }

  if (phase.type === "decision") {
    const { progress, stats, event } = phase;
    return (
      <DecisionCard event={event} onChoose={(choiceId) => resolveSeason(progress, stats, event, choiceId)} />
    );
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/carrera/${phase.shareId}` : "";

  return (
    <FinalResultCard
      result={phase.result}
      primaryAction={{
        label: copied ? "¡Enlace copiado!" : "Compartir carrera",
        onClick: async () => {
          track({ name: "share_clicked", props: { careerId: phase.shareId } });
          try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch {
            window.prompt("Copia tu enlace:", shareUrl);
          }
        },
      }}
      secondaryAction={{ label: "Jugar otra vez", onClick: () => setPhase({ type: "setup" }) }}
    />
  );
}
