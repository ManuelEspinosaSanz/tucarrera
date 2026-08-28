import { ImageResponse } from "next/og";
import { findClub } from "@/lib/simulation/clubs";
import { crestColors, crestInitials } from "@/lib/simulation/crest";
import { LEGACY_LABELS, POSITION_LABELS } from "@/lib/simulation/labels";
import { decodeCareerShare } from "@/lib/sharing/encode";
import { replayCareer } from "@/lib/simulation/replay";
import type { LegacyTier } from "@/lib/simulation/types";

// Node runtime's ImageResponse pulls in `sharp`; on machines where a native binary
// gets blocked (seen locally: Windows Application Control policy), that crashes the
// whole dev server, not just this route. Edge runtime renders PNGs without it.
export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const LEGACY_COLOR: Record<LegacyTier, string> = {
  jugador_local: "#a1a1aa",
  profesional: "#38bdf8",
  estrella: "#a78bfa",
  leyenda: "#fbbf24",
  inmortal: "#fb7185",
};

export default async function OpengraphImage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const payload = decodeCareerShare(id);
  const result = payload
    ? replayCareer(
        {
          seed: payload.seed,
          nombre: payload.nombre,
          dorsal: payload.dorsal,
          posicion: payload.posicion,
          arquetipo: payload.arquetipo,
        },
        payload.decisions
      )
    : null;

  if (!result) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            background: "#09090b",
            color: "#e4e4e7",
            fontSize: 48,
          }}
        >
          Tu Carrera
        </div>
      ),
      size
    );
  }

  const { resumen, temporadas } = result;
  const legacyColor = LEGACY_COLOR[result.legado];
  const lastClub = findClub(temporadas[temporadas.length - 1].clubId);
  const crest = crestColors(lastClub.id);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          background: "#09090b",
          padding: 72,
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", fontSize: 26, letterSpacing: 4, color: "#34d399", textTransform: "uppercase" }}>
            Tu Carrera
          </div>
          <div
            style={{
              display: "flex",
              width: 64,
              height: 64,
              borderRadius: 16,
              background: crest.primary,
              border: `3px solid ${crest.secondary}`,
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
              fontWeight: 700,
              color: "white",
            }}
          >
            {crestInitials(lastClub.nombre)}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", marginTop: 28 }}>
          <div style={{ display: "flex", fontSize: 72, fontWeight: 700, lineHeight: 1.1 }}>
            {resumen.nombreJugador}
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#a1a1aa", marginTop: 8 }}>
            {POSITION_LABELS[resumen.posicion]} · {lastClub.nombre}
          </div>
        </div>

        <div style={{ display: "flex", marginTop: 56, gap: 56 }}>
          <Stat label="Partidos" value={resumen.partidosTotales} />
          <Stat label="Goles" value={resumen.golesTotales} />
          <Stat label="Asistencias" value={resumen.asistenciasTotales} />
          <Stat label="Títulos" value={resumen.titulosTotales} />
        </div>

        <div style={{ display: "flex", flex: 1 }} />

        <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
          <div style={{ display: "flex", fontSize: 64, fontWeight: 700 }}>
            {result.puntuacionFinal.toLocaleString("es-ES")}
          </div>
          <div style={{ display: "flex", fontSize: 32, fontWeight: 700, color: legacyColor, textTransform: "uppercase", letterSpacing: 2 }}>
            {LEGACY_LABELS[result.legado]}
          </div>
        </div>
      </div>
    ),
    size
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", fontSize: 40, fontWeight: 700 }}>{value}</div>
      <div style={{ display: "flex", fontSize: 20, color: "#71717a", textTransform: "uppercase", letterSpacing: 1, marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}
