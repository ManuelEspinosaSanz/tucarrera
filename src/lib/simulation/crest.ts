/** Deterministic crest identity for a fictional club — shared by the on-page crest and the OG image. */
export function crestHash(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function crestColors(id: string): { primary: string; secondary: string } {
  const hue = crestHash(id) % 360;
  return {
    primary: `hsl(${hue}, 52%, 40%)`,
    secondary: `hsl(${(hue + 35) % 360}, 58%, 26%)`,
  };
}

export function crestInitials(nombre: string): string {
  const words = nombre.split(" ").filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
