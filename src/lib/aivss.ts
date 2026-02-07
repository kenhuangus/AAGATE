export type AivssInput = {
  exploitation: number; // 0-10
  impact: number; // 0-10
  detectability: number; // 0-10 (higher = easier to detect)
};

export type AivssResult = {
  score: number;
  vector: string;
};

const clamp = (value: number) => Math.max(0, Math.min(10, value));

export function scoreAivss(input: AivssInput): AivssResult {
  const exploitation = clamp(input.exploitation);
  const impact = clamp(input.impact);
  const detectability = clamp(input.detectability);

  const rawScore = exploitation * 0.4 + impact * 0.5 + (10 - detectability) * 0.1;
  const score = Math.round(rawScore * 10) / 10;

  return {
    score,
    vector: `EX:${exploitation}/IM:${impact}/DE:${detectability}`,
  };
}
