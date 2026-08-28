import { describe, expect, it } from "vitest";
import { playSeason, startCareerProgress, submitDecision, type CareerOptions } from "./interactive";
import { replayCareer } from "./replay";

function playFullCareer(options: CareerOptions, pickChoice: (optionIds: string[]) => string) {
  let progress = startCareerProgress(options);
  while (!progress.finished) {
    const { progress: afterSeason, stats, event } = playSeason(progress);
    const choiceId = event ? pickChoice(event.opciones.map((o) => o.id)) : null;
    progress = submitDecision(afterSeason, stats, event, choiceId);
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
    const played = playFullCareer(options, (ids) => ids[0]); // always first option
    const replayed = replayCareer(options, played.decisions);

    expect(replayed).toEqual(played.result);
  });

  it("replaying with different decisions than were actually made diverges", () => {
    const played = playFullCareer(options, (ids) => ids[0]);
    const differentDecisions = played.decisions.map((_, i) =>
      i % 2 === 0 ? "b" : "a"
    );
    const replayed = replayCareer(options, differentDecisions);

    // Not a strict guarantee for every possible seed, but true for this one — and the
    // whole point of decisions mattering is that this is the common case.
    expect(replayed).not.toEqual(played.result);
  });

  it("interactive play is itself deterministic for the same seed and choices", () => {
    const a = playFullCareer(options, (ids) => ids[0]);
    const b = playFullCareer(options, (ids) => ids[0]);
    expect(a.result).toEqual(b.result);
    expect(a.decisions).toEqual(b.decisions);
  });
});
