/** Generates a fresh seed for a career that wasn't started from a challenge/shared link. */
export function generateSeed(): number {
  return (Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0;
}
