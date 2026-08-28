import { describe, expect, it } from "vitest";
import {
  playSeason,
  resolveEvent,
  resolveTransfer,
  skipTransfer,
  startCareerProgress,
  type CareerOptions,
} from "./interactive";
import { replayCareer } from "./replay";

function playFullCareer(
  options: CareerOptions,
  pickEventChoice: (optionIds: string[]) => string,
  pickTransferChoice: (currentClubId: string, offerIds: string[]) => string | null
) {
  let progress = startCareerProgress(options);

  while (!progress.finished) {
    const { progress: afterSeason, stats, event } = playSeason(progress);
    const choiceId = event ? pickEventChoice(event.opciones.map((o) => o.id)) : null;
    const resolved = resolveEvent(afterSeason, stats, event, choiceId);

    if (resolved.finished) {
      progress = resolved.progress;
      break;
    }

    if (resolved.offers.length > 0) {
      const chosenId = pickTransferChoice(
        resolved.progress.club.id,
        resolved.offers.map((o) => o.id)
      );
      const chosenClub = chosenId ? resolved.offers.find((o) => o.id === chosenId)! : null;
      progress = resolveTransfer(resolved.progress, chosenClub);
    } else {
      progress = skipTransfer(resolved.progress);
    }
  }

  return progress;
}

describe("interactive engine vs replay", () => {
  const options: CareerOptions = {
    seed: 555111,
    nombre: "Replay Test",
    posicion: "mediocentro_ofensivo",
    arquetipo: "lider",
  };

  it("replaying the exact decisions made interactively reproduces the same result", () => {
    const played = playFullCareer(
      options,
      (ids) => ids[0],
      (_current, offerIds) => offerIds[0] ?? null // always take the first offer, if any
    );
    const replayed = replayCareer(options, played.decisions);

    expect(replayed).toEqual(played.result);
  });

  it("replaying with different event decisions than were actually made diverges", () => {
    const played = playFullCareer(
      options,
      (ids) => ids[0],
      () => null // always stay
    );
    const differentDecisions = played.decisions.map((d) =>
      d.type === "event" ? { ...d, choiceId: d.choiceId === "a" ? "b" : "a" } : d
    );
    const replayed = replayCareer(options, differentDecisions);

    expect(replayed).not.toEqual(played.result);
  });

  it("choosing to always take transfer offers changes the outcome vs. always staying", () => {
    const stayed = playFullCareer(
      options,
      (ids) => ids[0],
      () => null
    );
    const moved = playFullCareer(
      options,
      (ids) => ids[0],
      (_current, offerIds) => offerIds[0] ?? null
    );

    expect(stayed.result).not.toEqual(moved.result);
  });

  it("interactive play is itself deterministic for the same seed and choices", () => {
    const pickEvent = (ids: string[]) => ids[0];
    const pickTransfer = (_current: string, offerIds: string[]) => offerIds[0] ?? null;

    const a = playFullCareer(options, pickEvent, pickTransfer);
    const b = playFullCareer(options, pickEvent, pickTransfer);
    expect(a.result).toEqual(b.result);
    expect(a.decisions).toEqual(b.decisions);
  });
});
