/**
 * Challenge/competitive-mode types. Mirrors the CHALLENGES / CHALLENGE_PLAYERS /
 * CHALLENGE_RESULTS tables from the architecture doc. No persistence yet (Hito 4) —
 * this exists so the simulation engine (Hito 1) never needs a reshape to plug into it.
 */

export type ChallengeMode =
  | "1v1"
  | "same_scenario"
  | "friends_challenge"
  | "daily_challenge";

export type ChallengeStatus = "waiting" | "active" | "finished" | "expired";

export interface Challenge {
  id: string;
  mode: ChallengeMode;
  status: ChallengeStatus;
  seed: number;
  createdBy: string;
  maxPlayers: number;
  configuration: Record<string, unknown>;
  createdAt: string;
  expiresAt: string | null;
}

export interface ChallengePlayer {
  id: string;
  challengeId: string;
  userId: string;
  playerId: string;
  score: number | null;
  finished: boolean;
  joinedAt: string;
}

export interface ChallengeResult {
  id: string;
  challengeId: string;
  winnerId: string | null;
  finalResults: Record<string, unknown>;
  completedAt: string;
}
