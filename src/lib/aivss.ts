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
const weight = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const weights = {
  exploitation: weight(process.env.AIVSS_WEIGHT_EXPLOITATION, 0.4),
  impact: weight(process.env.AIVSS_WEIGHT_IMPACT, 0.5),
  detectability: weight(process.env.AIVSS_WEIGHT_DETECTABILITY, 0.1),
};

export function scoreAivss(input: AivssInput): AivssResult {
  const exploitation = clamp(input.exploitation);
  const impact = clamp(input.impact);
  const detectability = clamp(input.detectability);

  const rawScore =
    exploitation * weights.exploitation +
    impact * weights.impact +
    (10 - detectability) * weights.detectability;
  const score = Math.round(rawScore * 10) / 10;

  return {
    score,
    vector: `EX:${exploitation}/IM:${impact}/DE:${detectability}`,
  };
}
