"use client";

import { useState, type ReactNode } from "react";
import { track } from "@/lib/analytics/events";
import { encodeCareerShare } from "@/lib/sharing/encode";
import {
  playSeason,
  resolveEvent,
  resolveTransfer,
  skipTransfer,
  startCareerProgress,
  type CareerProgress,
} from "@/lib/simulation/interactive";
import { generateSeed } from "@/lib/simulation/seed";
import type { CareerResult, Club, GameEvent, SeasonStats } from "@/lib/simulation/types";
import { CareerHeaderBar, type CumulativeStats } from "./CareerHeaderBar";
import { DecisionCard } from "./DecisionCard";
import { FinalResultCard } from "./FinalResultCard";
import { PlayerSetupForm, type PlayerSetupValues } from "./PlayerSetupForm";
import { SeasonCard } from "./SeasonCard";
import { SeasonHistory } from "./SeasonHistory";
import { SeasonProgress } from "./SeasonProgress";
import { TransferChoiceCard } from "./TransferChoiceCard";

type Phase =
  // A season's stats are always shown first, even when that season also has an event
  // or transfer offers pending — otherwise a decision can appear before the player
  // ever sees what happened that season.
  | { type: "setup" }
  | { type: "stats"; progress: CareerProgress; stats: SeasonStats; event: GameEvent | null }
  | { type: "decision"; progress: CareerProgress; stats: SeasonStats; event: GameEvent }
  | { type: "transfer"; progress: CareerProgress; offers: Club[] }
  | { type: "result"; result: CareerResult; shareId: string };

function sumStats(temporadas: SeasonStats[], extra?: SeasonStats): CumulativeStats {
  const all = extra ? [...temporadas, extra] : temporadas;
  return all.reduce(
    (acc, s) => ({
      partidos: acc.partidos + s.partidosJugados,
      goles: acc.goles + s.goles,
      asistencias: acc.asistencias + s.asistencias,
    }),
    { partidos: 0, goles: 0, asistencias: 0 }
  );
}

/** Fixed HUD/history/progress up top, the active card fills (and, if needed, scrolls) the rest. */
function PlayLayout({ top, card }: { top: ReactNode; card: ReactNode }) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex-none">{top}</div>
      <div className="min-h-0 flex-1 overflow-y-auto py-1">{card}</div>
    </div>
  );
}

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

  function finishOrContinue(progress: CareerProgress, finished: boolean, result: CareerResult | null) {
    if (finished && result) {
      const shareId = encodeCareerShare({
        seed: progress.options.seed,
        nombre: progress.options.nombre,
        dorsal: progress.options.dorsal ?? 10,
        posicion: progress.options.posicion,
        arquetipo: progress.options.arquetipo,
        decisions: progress.decisions,
      });
      track({
        name: "career_completed",
        props: { finalScore: result.puntuacionFinal, legacyTier: result.legado, seasons: result.resumen.temporadasJugadas },
      });
      setPhase({ type: "result", result, shareId });
      return;
    }

    const played = playSeason(progress);
    setPhase({ type: "stats", progress: played.progress, stats: played.stats, event: played.event });
  }

  function handleEventChoice(progress: CareerProgress, stats: SeasonStats, event: GameEvent | null, choiceId: string | null) {
    const resolved = resolveEvent(progress, stats, event, choiceId);

    if (resolved.finished) {
      finishOrContinue(resolved.progress, true, resolved.result);
      return;
    }

    if (resolved.offers.length > 0) {
      setPhase({ type: "transfer", progress: resolved.progress, offers: resolved.offers });
      return;
    }

    finishOrContinue(skipTransfer(resolved.progress), false, null);
  }

  function handleTransferChoice(progress: CareerProgress, chosenClub: Club | null) {
    finishOrContinue(resolveTransfer(progress, chosenClub), false, null);
  }

  if (phase.type === "setup") {
    return (
      <div className="h-full overflow-y-auto">
        <PlayerSetupForm onSubmit={handleSetup} />
      </div>
    );
  }

  if (phase.type === "stats") {
    const { progress, stats, event } = phase;
    return (
      <PlayLayout
        top={
          <>
            <CareerHeaderBar
              player={progress.player}
              club={progress.club}
              cumulativeStats={sumStats(progress.temporadas, stats)}
            />
            <SeasonHistory temporadas={progress.temporadas} />
            <SeasonProgress seasonNumber={stats.numeroTemporada} />
          </>
        }
        card={
          <SeasonCard
            stats={stats}
            continueLabel={event ? "Ver decisión" : "Continuar"}
            onContinue={() =>
              event
                ? setPhase({ type: "decision", progress, stats, event })
                : handleEventChoice(progress, stats, null, null)
            }
          />
        }
      />
    );
  }

  if (phase.type === "decision") {
    const { progress, stats, event } = phase;
    return (
      <PlayLayout
        top={
          <>
            <CareerHeaderBar
              player={progress.player}
              club={progress.club}
              cumulativeStats={sumStats(progress.temporadas, stats)}
            />
            <SeasonHistory temporadas={progress.temporadas} />
            <SeasonProgress seasonNumber={stats.numeroTemporada} />
          </>
        }
        card={<DecisionCard event={event} onChoose={(choiceId) => handleEventChoice(progress, stats, event, choiceId)} />}
      />
    );
  }

  if (phase.type === "transfer") {
    const { progress, offers } = phase;
    return (
      <PlayLayout
        top={
          <>
            <CareerHeaderBar player={progress.player} club={progress.club} cumulativeStats={sumStats(progress.temporadas)} />
            <SeasonHistory temporadas={progress.temporadas} />
            <SeasonProgress seasonNumber={progress.seasonNumber} />
          </>
        }
        card={
          <TransferChoiceCard
            currentClub={progress.club}
            offers={offers}
            onChoose={(club) => handleTransferChoice(progress, club)}
          />
        }
      />
    );
  }

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/carrera/${phase.shareId}` : "";

  return (
    <div className="h-full overflow-y-auto">
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
    </div>
  );
}
