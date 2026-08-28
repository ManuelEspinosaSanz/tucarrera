import type { CareerOptions } from "../simulation/interactive";
import type { CareerDecision } from "../simulation/types";

/**
 * Encodes everything needed to reconstruct a finished career into a URL-safe string:
 * the seed, the setup, and the ordered choices made. No database — replay.ts's
 * determinism does the rest. This is what `/carrera/[id]` decodes.
 */
export interface CareerSharePayload {
  seed: number;
  nombre: string;
  posicion: CareerOptions["posicion"];
  arquetipo: CareerOptions["arquetipo"];
  decisions: CareerDecision[];
}

function toBase64Url(input: string): string {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  const base64 = typeof btoa !== "undefined" ? btoa(binary) : Buffer.from(binary, "binary").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(encoded: string): string {
  const padded = encoded.padEnd(encoded.length + ((4 - (encoded.length % 4)) % 4), "=");
  const base64 = padded.replace(/-/g, "+").replace(/_/g, "/");
  const binary = typeof atob !== "undefined" ? atob(base64) : Buffer.from(base64, "base64").toString("binary");
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export function encodeCareerShare(payload: CareerSharePayload): string {
  return toBase64Url(JSON.stringify(payload));
}

export function decodeCareerShare(id: string): CareerSharePayload | null {
  try {
    const parsed = JSON.parse(fromBase64Url(id));
    if (
      typeof parsed.seed !== "number" ||
      typeof parsed.nombre !== "string" ||
      typeof parsed.posicion !== "string" ||
      typeof parsed.arquetipo !== "string" ||
      !Array.isArray(parsed.decisions)
    ) {
      return null;
    }
    return parsed as CareerSharePayload;
  } catch {
    return null;
  }
}
